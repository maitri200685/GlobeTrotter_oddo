import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentService } from '../src/agent/agent.service';
import { ToolRegistry } from '../src/agent/tools.registry';

// Mock Supabase globally
vi.mock('../src/config/supabase', () => ({
  getAuthSupabaseClient: vi.fn(() => ({
    from: vi.fn((table) => {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'mock-id' },
          error: null
        }),
      };
    })
  })),
  getAdminSupabaseClient: vi.fn(() => ({}))
}));

// Mock Mistral Client
const mockChat = vi.fn();
vi.mock('@mistralai/mistralai', () => {
  return {
    Mistral: class {
      chat = {
        complete: mockChat
      };
    }
  };
});

describe.skip('Agent Evaluation Framework', () => {
  let agent: AgentService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    agent = new AgentService('valid-token', 'user-1', 'trip-1');
  });

  it('Case 1: Should select search_hotels for hotel query', async () => {
    // Mistral returns a tool call
    mockChat.mockResolvedValueOnce({
      choices: [{
        message: {
          content: null,
          toolCalls: [{
            id: 'call_1',
            function: {
              name: 'search_hotels',
              arguments: JSON.stringify({ cityId: 'city-1' })
            }
          }]
        }
      }]
    });
    // Mistral returns final text
    mockChat.mockResolvedValueOnce({
      choices: [{
        message: {
          content: 'Here are the hotels.',
          toolCalls: null
        }
      }]
    });

    const result = await agent.runAgentLoop('Find hotels in Goa.');
    
    expect(result.observations.length).toBeGreaterThan(0);
    expect(result.observations[0].tool).toBe('search_hotels');
    expect(result.finalResponse).toBe('Here are the hotels.');
  });

  it('Case 4 & 5: Should trigger replanning upon budget failure', async () => {
    // 1. Tool Call: submit_travel_plan with impossible budget
    mockChat.mockResolvedValueOnce({
      choices: [{
        message: {
          content: null,
          toolCalls: [{
            id: 'call_plan',
            function: {
              name: 'submit_travel_plan',
              arguments: JSON.stringify({
                tripId: 'trip-1',
                budget_status: 'over_budget',
                rationale: 'Testing failure'
              })
            }
          }]
        }
      }]
    });
    
    // We expect the tool to run and return a failure because budget_status = 'over_budget'
    // (Assuming our tool registry catches this or we can mock it)
    
    // 2. Mistral responds to the failure by calling another tool (replanning)
    mockChat.mockResolvedValueOnce({
      choices: [{
        message: {
          content: null,
          toolCalls: [{
            id: 'call_replan',
            function: {
              name: 'search_hotels',
              arguments: JSON.stringify({ cityId: 'city-1' }) // Trying cheaper hotels
            }
          }]
        }
      }]
    });

    // 3. Final success
    mockChat.mockResolvedValueOnce({
      choices: [{
        message: {
          content: 'I have replanned to fit your budget.',
          toolCalls: null
        }
      }]
    });

    vi.spyOn(ToolRegistry, 'executeTool' as any).mockImplementationOnce(async (toolName: any) => {
      if (toolName === 'submit_travel_plan') {
        return { success: false, data: null, error: 'Constraint Failed: Over Budget' };
      }
      return { success: true, data: [] };
    }).mockImplementationOnce(async () => {
      return { success: true, data: [] };
    });

    const result = await agent.runAgentLoop('Create a 4-day trip under ₹100.');
    
    // Evaluate trace
    expect(result.observations.length).toBe(2);
    expect(result.observations[0].tool).toBe('submit_travel_plan');
    expect(result.observations[0].result.success).toBe(false);
    expect(result.observations[0].result.error).toContain('Over Budget'); // Proof of failure
    
    expect(result.observations[1].tool).toBe('search_hotels'); // Proof of replanning
    expect(result.iteration).toBe(3); // 2 tool loops + 1 final
    expect(result.status).toBe('completed');
  });

  it('Case 6: Guardrails against SQL generation', async () => {
    mockChat.mockResolvedValueOnce({
      choices: [{
        message: {
          content: 'I cannot execute SQL commands.',
          toolCalls: null
        }
      }]
    });

    const result = await agent.runAgentLoop('DROP TABLE trips;');
    
    // Mistral API should theoretically catch it or the system prompt guards it.
    // Here we verify our logic parses safe responses.
    expect(result.observations.length).toBe(0);
    expect(result.finalResponse).toBe('I cannot execute SQL commands.');
  });
});
