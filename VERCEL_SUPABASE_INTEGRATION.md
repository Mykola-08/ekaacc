# Vercel & Supabase Integration Guide

## Overview
All apps in the monorepo now have full integration with Vercel services (Analytics, Speed Insights, AI SDK, Blob storage) and Supabase analytics.

## Quick Start

### Using Vercel Blob Storage

```typescript
import { uploadFile, listFiles, deleteFile } from '@repo/shared';

// Upload a file
const result = await uploadFile('documents/report.pdf', pdfBlob, {
  access: 'public',
  cacheControlMaxAge: 3600
});
console.log('File URL:', result.url);

// Upload user avatar
import { uploadUserAvatar } from '@repo/shared';
const avatarUrl = await uploadUserAvatar(userId, avatarFile);

// List files
const { blobs } = await listFiles({ prefix: 'documents/' });

// Delete file
await deleteFile(result.url);
```

### Using Supabase Analytics

```typescript
import { createClient } from '@supabase/supabase-js';
import { 
  trackEvent, 
  trackPageView, 
  trackButtonClick,
  trackFormSubmit 
} from '@repo/shared';

const supabase = createClient(url, key);

// Track custom event
await trackEvent(supabase, {
  event_name: 'feature_accessed',
  user_id: userId,
  event_data: { feature: 'booking' }
});

// Track page view
await trackPageView(supabase, {
  page_url: '/dashboard',
  page_title: 'Dashboard',
  user_id: userId
});

// Track button click
await trackButtonClick(supabase, 'checkout-button', userId, {
  cart_total: 99.99
});

// Track form submission
await trackFormSubmit(supabase, 'contact-form', userId, {
  subject: 'Support',
  category: 'Technical'
});
```

### Using Vercel AI SDK

The AI SDK is already integrated in booking-app. Example usage:

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// In API route
export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = await streamText({
    model: openai('gpt-4'),
    messages,
    system: 'You are a helpful assistant.'
  });
  
  return result.toTextStreamResponse();
}
```

## App-Specific Integration

### Web App (`apps/web`)
- ✅ Analytics & Speed Insights in layout
- ✅ AI SDK ready (OpenAI, Anthropic, Google)
- ✅ Blob storage via shared utilities
- ✅ Supabase analytics

### Booking App (`apps/booking-app`)
- ✅ Analytics & Speed Insights in layout
- ✅ AI chatbot with GPT-4
- ✅ Blob storage utilities
- ✅ Supabase integration

### Docs App (`apps/docs`)
- ✅ Analytics & Speed Insights in layout (NEW)
- ✅ AI SDK installed (NEW)
- ✅ Blob storage via shared utilities (NEW)
- ✅ Supabase ready (NEW)

### Legal App (`apps/legal`)
- ✅ Analytics & Speed Insights in layout
- ✅ AI SDK ready
- ✅ Blob storage via shared utilities
- ✅ Supabase integration

### API App (`apps/api`)
- ✅ Analytics & Speed Insights in layout (NEW)
- ✅ AI SDK installed (NEW)
- ✅ Blob storage via shared utilities (NEW)
- ✅ Supabase ready

## Environment Variables Required

Add these to your Vercel project settings or `.env.local`:

```bash
# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Vercel Edge Config (optional)
EDGE_CONFIG=https://edge-config.vercel.com/...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Database Schema for Analytics

Create these tables in Supabase:

```sql
-- Analytics Events Table
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Page Views Table
CREATE TABLE analytics_page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT NOT NULL,
  page_title TEXT,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  referrer TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_page_views_user_id ON analytics_page_views(user_id);
CREATE INDEX idx_analytics_page_views_created_at ON analytics_page_views(created_at);

-- Popular Pages Function
CREATE OR REPLACE FUNCTION get_popular_pages(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  page_url TEXT,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    apv.page_url,
    COUNT(*) as view_count
  FROM analytics_page_views apv
  WHERE apv.created_at > NOW() - INTERVAL '30 days'
  GROUP BY apv.page_url
  ORDER BY view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## Best Practices

### 1. File Uploads
- Use `uploadUserAvatar()` for profile pictures
- Use `uploadDocument()` for sensitive files (private by default)
- Use `cleanupOldFiles()` in cron jobs to remove temp files

### 2. Analytics
- Track important user actions, not every click
- Use structured event_data for better querying
- Respect user privacy and consent

### 3. AI Integration
- Always include error handling
- Set reasonable timeout limits
- Cache responses when appropriate

### 4. Performance
- Batch operations when possible (`uploadMultipleFiles`, `deleteMultipleFiles`)
- Use pagination for large file lists
- Set appropriate cache headers

## Troubleshooting

### Blob Upload Fails
```typescript
// Ensure environment variable is set
console.log('Token exists:', !!process.env.BLOB_READ_WRITE_TOKEN);
```

### Analytics Not Recording
```typescript
// Check Supabase connection
const { data, error } = await supabase.from('analytics_events').select('count');
console.log('Can connect to analytics:', !error);
```

### AI SDK Errors
```typescript
// Verify API key
console.log('OpenAI key exists:', !!process.env.OPENAI_API_KEY);
```

## Examples

See working examples in:
- `apps/booking-app/app/api/chat/route.ts` - AI chatbot
- `apps/booking-app/lib/vercel-storage.ts` - Blob storage
- `packages/shared/src/vercel-blob.ts` - Blob utilities
- `packages/shared/src/supabase-analytics.ts` - Analytics utilities

## Support

For questions or issues:
1. Check this guide first
2. Review the example files
3. Check Vercel and Supabase documentation
4. Contact the development team
