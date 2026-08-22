import { AgentTool } from './agent.types';
import { getAuthSupabaseClient } from '../config/supabase';
import { BudgetService } from '../services/budget.service';

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
