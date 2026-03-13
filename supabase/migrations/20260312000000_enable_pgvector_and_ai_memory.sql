-- Create pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to user_memory table (1536 dims for text-embedding-3-small)
ALTER TABLE user_memory ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Optional: Create an index on the embedding for faster similarity search
CREATE INDEX IF NOT EXISTS idx_user_memory_embedding
ON user_memory USING hnsw (embedding vector_cosine_ops);

-- Create a search function for RAG
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  memory_type text,
  importance int,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    content,
    memory_type,
    importance,
    1 - (user_memory.embedding <=> query_embedding) AS similarity
  FROM user_memory
  WHERE user_id = p_user_id
    AND 1 - (user_memory.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
