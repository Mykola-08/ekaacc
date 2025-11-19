-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- User Memory Table (Personalization)
CREATE TABLE IF NOT EXISTS user_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embedding dimension
    memory_type VARCHAR(50) DEFAULT 'observation', -- 'preference', 'fact', 'observation', 'interaction'
    metadata JSONB DEFAULT '{}',
    importance INTEGER DEFAULT 1, -- 1-5 scale
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_memory
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own memory
CREATE POLICY "Users can view their own memory"
    ON user_memory FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory"
    ON user_memory FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory"
    ON user_memory FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory"
    ON user_memory FOR DELETE
    USING (auth.uid() = user_id);

-- Knowledge Base Table (General Knowledge)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    embedding vector(1536),
    category VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on knowledge_base
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read knowledge base (or restrict to authenticated)
CREATE POLICY "Authenticated users can read knowledge base"
    ON knowledge_base FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can manage knowledge base (assuming admin role check or service role)
-- For now, we'll leave write policies restricted to service role (no public write)

-- Agent Actions Log (Audit Trail)
CREATE TABLE IF NOT EXISTS agent_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id VARCHAR(50) DEFAULT 'default_agent',
    action_type VARCHAR(100) NOT NULL, -- 'search_knowledge', 'update_memory', 'book_appointment'
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on agent_actions
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agent actions"
    ON agent_actions FOR SELECT
    USING (auth.uid() = user_id);

-- Function to match user memory
CREATE OR REPLACE FUNCTION match_user_memory(
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    p_user_id uuid
)
RETURNS TABLE (
    id uuid,
    content text,
    similarity float,
    metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        um.id,
        um.content,
        1 - (um.embedding <=> query_embedding) as similarity,
        um.metadata
    FROM
        user_memory um
    WHERE
        um.user_id = p_user_id
        AND 1 - (um.embedding <=> query_embedding) > match_threshold
    ORDER BY
        um.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Function to match knowledge base
CREATE OR REPLACE FUNCTION match_knowledge_base(
    query_embedding vector(1536),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id uuid,
    content text,
    similarity float,
    metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kb.id,
        kb.content,
        1 - (kb.embedding <=> query_embedding) as similarity,
        kb.metadata
    FROM
        knowledge_base kb
    WHERE
        1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY
        kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
