# AI Workflows & Integration Guide

This document outlines the revised AI workflows for the EKA platform, leveraging Supabase Vector Search and Edge Functions for enhanced personalization and memory.

## 1. Memory & RAG Workflow (New)

We have introduced a **Retrieval-Augmented Generation (RAG)** workflow to give the AI "memory" of past user interactions, journal entries, and preferences.

### Components
- **`AIMemoryService`**: Client-side service in `@ekaacc/ai-services`.
- **`ai-memory` Edge Function**: Handles embedding generation (OpenAI) and database operations.
- **`user_memory` Table**: Stores text chunks with `vector(1536)` embeddings.

### Workflow: Storing Memories
When a user creates a journal entry or a significant interaction occurs:
1.  **App** calls `AIMemoryService.storeMemory(userId, content, metadata)`.
2.  **Service** calls `ai-memory` Edge Function (`action: 'store'`).
3.  **Edge Function** generates an embedding using OpenAI `text-embedding-3-small`.
4.  **Edge Function** inserts the content + embedding into `user_memory`.

### Workflow: Retrieving Context (RAG)
When generating advice or chatting with the user:
1.  **App** calls `AIMemoryService.retrieveMemories(userId, userQuery)`.
2.  **Service** calls `ai-memory` Edge Function (`action: 'retrieve'`).
3.  **Edge Function** generates an embedding for the query.
4.  **Edge Function** calls `match_user_memory` (Postgres function) to find semantically similar entries.
5.  **App** receives relevant past entries.
6.  **App** constructs a prompt for the LLM:
    ```text
    Context from past entries:
    - [Date] I felt anxious about work...
    - [Date] Yoga helped me relax...

    User's current question: "How can I handle my stress today?"
    ```
7.  **App** calls `ai-chat` Edge Function with this enriched prompt.

## 2. Journal Analysis Workflow (Revised)

The `AIJournalAnalyzer` currently uses keyword-based analysis. To enhance this:

1.  **Analyze**: Use the existing rule-based analysis for immediate, low-latency feedback (Sentiment, Themes).
2.  **Store**: Asynchronously store the entry using `AIMemoryService`.
3.  **Deep Insight (Optional)**: For premium users or on-demand, trigger a "Deep Analysis" using the RAG workflow above to compare the current entry with past patterns.

## 3. Chat Workflow

The `ai-chat` Edge Function provides a direct interface to OpenAI.

- **Model**: `gpt-4o-mini` (Cost-effective, fast).
- **Streaming**: Responses are streamed for real-time feel.
- **Security**: API keys are stored in Supabase Secrets, never exposed to the client.

## Integration with Supabase

- **Database**: `user_memory` table with `pgvector`.
- **Edge Functions**: `ai-chat` and `ai-memory` handle the heavy lifting and secret management.
- **RLS**: Row Level Security ensures users can only access their own memories.

## Future Improvements

- **Agentic Workflows**: Create specialized agents (e.g., "Sleep Coach", "Nutritionist") that have access to specific subsets of the knowledge base.
- **Background Processing**: Use Supabase Database Webhooks to trigger analysis automatically when a new record is inserted.
