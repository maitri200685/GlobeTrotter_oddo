import { SupabaseClient } from '@supabase/supabase-js';

export interface AgentState {
  userId: string;
  request: string;
  tripId?: string;
  iteration: number;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  observations: AgentObservation[];
  finalResponse?: string;
}

export interface AgentObservation {
  tool: string;
  input: unknown;
  result?: unknown;
  error?: string;
}

export interface ToolContext {
  userId: string;
  token: string;
  tripId?: string;
  supabase: SupabaseClient;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
  };
}

export interface AgentTool {
  name: string;
  description: string;
  inputSchema: any; // We will use this to generate the JSON schema for Mistral
  execute(input: any, context: ToolContext): Promise<ToolResult>;
}
