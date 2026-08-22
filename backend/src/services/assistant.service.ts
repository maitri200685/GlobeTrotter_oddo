import { z } from 'zod';
import { AgentService } from '../agent/agent.service';
import { ToolContext } from '../agent/agent.types';

export const assistantIntentSchema = z.enum([
  'CREATE_TRIP',
  'MODIFY_TRIP',
  'ADD_ACTIVITY',
  'REMOVE_ACTIVITY',
  'CHANGE_HOTEL',
  'CHANGE_DESTINATION',
  'CHANGE_DATES',
  'CHANGE_BUDGET',
  'REPLAN_TRIP',
  'CALCULATE_COST',
  'GENERAL_TRAVEL_QUERY'
]);

export type AssistantIntent = z.infer<typeof assistantIntentSchema>;

export class AssistantService {
  private agentService: AgentService;

  constructor() {
    this.agentService = new AgentService();
  }

  async loadTripContext(tripId: string, context: ToolContext) {
    const { data: trip } = await context.supabase
      .from('trips')
      .select('*, itinerary_days(*, itinerary_items(*)), expenses(*)')
      .eq('id', tripId)
      .single();

    return trip;
  }

  async processRequest(request: string, context: ToolContext) {
    if (!context.tripId) {
      throw new Error('Trip ID is required for the Assistant');
    }

    // Load actual DB state to give the LLM context
    const tripData = await this.loadTripContext(context.tripId, context);
    if (!tripData) {
      throw new Error('Trip not found or unauthorized');
    }

    const systemPrompt = `You are the GlobeTrotter AI Trip Assistant.
The user is working on a specific trip: "${tripData.title}" (${tripData.start_date} to ${tripData.end_date}).
Current budget: ${tripData.total_budget}.

Current Trip State:
${JSON.stringify(tripData)}

Your job is to understand the user's intent, execute tools if required, and finally, respond with a confirmation.
IMPORTANT: You MUST ONLY confirm a database change (e.g. "I added the activity") if you successfully used the 'submit_travel_plan' tool or other modifying tools and they returned success: true.
Do NOT fake confirmations. If you cannot do something, tell the user.
If they ask to replan, load the data, modify the plan, and submit_travel_plan.`;

    const finalState = await this.agentService.runAgentLoop({
      userId: context.userId,
      request: request,
      tripId: context.tripId,
      iteration: 0,
      status: 'executing',
      observations: []
    }, context, systemPrompt); // Note: I need to update runAgentLoop to accept custom system prompt

    // We can extract an intent deterministically or probabilistically. Let's just return the LLM's final state for now.
    return {
      intent: 'MODIFY_TRIP', // simplified
      message: finalState.finalResponse,
      status: finalState.status
    };
  }
}
