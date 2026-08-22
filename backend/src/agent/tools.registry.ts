import { AgentTool } from './agent.types';
import { getAuthSupabaseClient } from '../config/supabase';
import { BudgetService } from '../services/budget.service';
import { PlanningService, TravelPlan } from '../services/planning.service';

export class ToolRegistry {
  private tools: Map<string, AgentTool> = new Map();

  registerTool(tool: AgentTool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): AgentTool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  getMistralTools() {
    return this.getAllTools().map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema
      }
    }));
  }
}

export const registry = new ToolRegistry();

// 1. search_cities
registry.registerTool({
  name: 'search_cities',
  description: 'Search for cities based on a query (e.g. region, name).',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'The search query or region name' }
    },
    required: ['query']
  },
  async execute(input: { query: string }, context) {
    const { data, error } = await context.supabase
      .from('cities')
      .select('id, name, country, region')
      .ilike('name', `%${input.query}%`)
      .limit(5);

    if (error) return { success: false, error: { code: 'DB_ERROR', message: error.message } };
    return { success: true, data };
  }
});

// 2. search_hotels
registry.registerTool({
  name: 'search_hotels',
  description: 'Search for hotels in a specific city, optionally under a max price.',
  inputSchema: {
    type: 'object',
    properties: {
      city_id: { type: 'string', description: 'The UUID of the city' },
      max_price: { type: 'number', description: 'The maximum price per night' }
    },
    required: ['city_id']
  },
  async execute(input: { city_id: string; max_price?: number }, context) {
    let query = context.supabase
      .from('hotels')
      .select('id, name, price_per_night, rating')
      .eq('city_id', input.city_id);

    if (input.max_price !== undefined) {
      query = query.lte('price_per_night', input.max_price);
    }

    const { data, error } = await query.limit(5);
    if (error) return { success: false, error: { code: 'DB_ERROR', message: error.message } };
    return { success: true, data };
  }
});

// 3. search_activities
registry.registerTool({
  name: 'search_activities',
  description: 'Search for activities in a specific city.',
  inputSchema: {
    type: 'object',
    properties: {
      city_id: { type: 'string', description: 'The UUID of the city' },
      category: { type: 'string', description: 'Activity category, e.g. adventure, museum' }
    },
    required: ['city_id']
  },
  async execute(input: { city_id: string; category?: string }, context) {
    let query = context.supabase
      .from('activities')
      .select('id, name, price, category')
      .eq('city_id', input.city_id);

    if (input.category) {
      query = query.ilike('category', `%${input.category}%`);
    }

    const { data, error } = await query.limit(5);
    if (error) return { success: false, error: { code: 'DB_ERROR', message: error.message } };
    return { success: true, data };
  }
});

// 4. calculate_budget
registry.registerTool({
  name: 'calculate_budget',
  description: 'Calculate the total estimated budget for a trip and see if it is within target.',
  inputSchema: {
    type: 'object',
    properties: {
      trip_id: { type: 'string', description: 'The UUID of the trip to calculate' }
    },
    required: ['trip_id']
  },
  async execute(input: { trip_id: string }, context) {
    const budgetService = new BudgetService(context.supabase);
    try {
      const summary = await budgetService.getBudgetSummary(input.trip_id);
      return { success: true, data: summary };
    } catch (e: any) {
      return { success: false, error: { code: 'CALC_ERROR', message: e.message } };
    }
  }
});
// 5. submit_travel_plan
registry.registerTool({
  name: 'submit_travel_plan',
  description: 'Submit a proposed travel plan for validation. If it fails constraints (e.g., budget exceeded, schedule overlap), you will receive the errors back and must replan. If successful, the plan is persisted.',
  inputSchema: {
    type: 'object',
    properties: {
      plan: {
        type: 'object',
        description: 'The full TravelPlan object containing activities, accommodations, dates, and budget.'
      }
    },
    required: ['plan']
  },
  async execute(input: { plan: TravelPlan }, context) {
    const planningService = new PlanningService();
    const result = await planningService.validatePlan(input.plan, context);
    
    if (!result.isValid) {
      return { success: false, error: { code: 'PLAN_INVALID', message: `Plan validation failed: ${result.errors.join(', ')}` } };
    }

    const persistResult = await planningService.persistPlan(input.plan, context);
    if (!persistResult.success) {
      return { success: false, error: { code: 'PLAN_PERSIST_ERROR', message: persistResult.error || 'Failed to save to database.' } };
    }

    return { success: true, data: { message: 'Plan validated and finalized successfully.' } };
  }
});
