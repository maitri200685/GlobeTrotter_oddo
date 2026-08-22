import { AgentState, ToolContext, AgentObservation } from './agent.types';
import { registry } from './tools.registry';

const MAX_ITERATIONS = 10;

export class AgentService {
  private mistral: any;
  private model: string;

  constructor() {
    this.model = process.env.MISTRAL_MODEL || 'mistral-large-latest';
  }

  private async getMistral() {
    if (!this.mistral) {
      const { Mistral } = await import('@mistralai/mistralai');
      const apiKey = process.env.MISTRAL_API_KEY || 'dummy_key';
      this.mistral = new Mistral({ apiKey });
    }
    return this.mistral;
  }

  async runAgentLoop(initialState: AgentState, context: ToolContext, customSystemPrompt?: string): Promise<AgentState> {
    let state = { ...initialState };
    
    // Convert history into messages
    const systemPromptContent = customSystemPrompt || `You are the GlobeTrotter AI Travel Agent. You help users plan trips, find cities, hotels, and activities, and ensure their budget is respected.
You have access to tools. Always use them to fetch data before making recommendations.
Never guess or hallucinate facts about hotels or cities. Use the tools.`;

    const messages: any[] = [
      {
        role: 'system',
        content: systemPromptContent
      },
      { role: 'user', content: state.request }
    ];

    const mistral = await this.getMistral();
    while (state.iteration < MAX_ITERATIONS && state.status === 'executing') {
      try {
        const response = await mistral.chat.complete({
          model: this.model,
          messages: messages,
          tools: registry.getMistralTools() as any,
          toolChoice: 'auto',
        });

        const choice = response.choices?.[0];
        
        if (!choice) {
          state.status = 'failed';
          state.finalResponse = 'No response from AI model';
          break;
        }

        const responseMessage = choice.message;
        if (!responseMessage) {
          state.status = 'failed';
          state.finalResponse = 'No message in response';
          break;
        }
        messages.push(responseMessage);

        // If the model called tools
        if (responseMessage.toolCalls && responseMessage.toolCalls.length > 0) {
          for (const toolCall of responseMessage.toolCalls) {
            const toolName = toolCall.function.name;
            const toolArgs = JSON.parse(toolCall.function.arguments as string);
            
            const tool = registry.getTool(toolName);
            let toolResultContent: string;
            
            if (!tool) {
              toolResultContent = JSON.stringify({ success: false, error: 'Unknown tool' });
              state.observations.push({ tool: toolName, input: toolArgs, error: 'Unknown tool' });
            } else {
              // Execute deterministic tool with isolated RLS context
              const result = await tool.execute(toolArgs, context);
              toolResultContent = JSON.stringify(result);
              state.observations.push({ tool: toolName, input: toolArgs, result });
            }

            // Feed tool result back to the model
            messages.push({
              role: 'tool',
              name: toolName,
              content: toolResultContent,
              toolCallId: toolCall.id
            });
          }
          
          state.iteration++;
        } else {
          // If no tools were called, the model is providing the final answer
          state.status = 'completed';
          state.finalResponse = responseMessage.content as string;
          break;
        }
      } catch (error: any) {
        state.status = 'failed';
        state.finalResponse = `Agent encountered an error: ${error.message}`;
        break;
      }
    }

    if (state.iteration >= MAX_ITERATIONS) {
      state.status = 'failed';
      state.finalResponse = 'Agent reached maximum iteration limit.';
    }

    return state;
  }
}
