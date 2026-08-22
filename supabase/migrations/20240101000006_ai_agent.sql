-- Create Agent Sessions Table
CREATE TABLE agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Agent Messages Table
CREATE TABLE agent_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system', 'tool'
    content TEXT,
    tool_calls JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Agent Tool Calls Table (Audit & Iteration tracking)
CREATE TABLE agent_tool_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES agent_messages(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    input_args JSONB,
    result JSONB,
    status TEXT DEFAULT 'pending', -- 'pending', 'success', 'error'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Agent State Table (For constraint solving and memory)
CREATE TABLE agent_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    state_data JSONB NOT NULL,
    iteration INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for agent_sessions updated_at
CREATE TRIGGER set_agent_sessions_updated_at
BEFORE UPDATE ON agent_sessions
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
