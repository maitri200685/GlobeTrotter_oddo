import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import app from '../src/app';
import { AgentService } from '../src/agent/agent.service';

// Mock Supabase
vi.mock('../src/config/supabase', () => {
  return {
    getAuthSupabaseClient: vi.fn(() => ({
      from: vi.fn((table) => {
        if (table === 'trips') {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: '123e4567-e89b-12d3-a456-426614174000' },
              error: null
            })
          };
        }
      })
    })),
    getAdminSupabaseClient: vi.fn(() => ({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
          error: null
        })
      }
    }))
  };
});

// Mock Mistral AgentService
vi.mock('../src/agent/agent.service', () => {
  const MockAgentService = vi.fn();
  MockAgentService.prototype.runAgentLoop = vi.fn().mockResolvedValue({
    userId: 'user-1',
    request: 'Plan a trip',
    tripId: '123e4567-e89b-12d3-a456-426614174000',
    iteration: 1,
    status: 'completed',
    observations: [
      { tool: 'search_cities', input: { query: 'Goa' }, result: { success: true, data: [] } }
    ],
    finalResponse: 'Here is your trip.'
  });
  return { AgentService: MockAgentService };
});

describe('Agent API', () => {
  it('should successfully run chat endpoint', async () => {
    const res = await request(app)
      .post('/api/v1/agent/chat')
      .set('Authorization', 'Bearer valid-token')
      .send({
        message: 'Plan a trip to Goa',
        tripId: '123e4567-e89b-12d3-a456-426614174000'
      });
      
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.message).toBe('Here is your trip.');
    expect(res.body.data.status).toBe('completed');
    expect(res.body.data.observations.length).toBe(1);
  });

  it('should return 400 on missing message', async () => {
    const res = await request(app)
      .post('/api/v1/agent/chat')
      .set('Authorization', 'Bearer valid-token')
      .send({}); // missing message
      
    expect(res.status).toBe(400); // Zod error
  });
});
