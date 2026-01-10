# Code Quality & Best Practices

## Logging

This project includes a production-ready logger utility at `apps/web/src/lib/logger.ts`.

### Usage

**Preferred** - Use the structured logger:
```typescript
import { logger } from '@/lib/logger';

// Development-only logs
logger.debug('Debug information', { userId: 123 });
logger.info('User action', { action: 'login', userId: 123 });

// Production logs
logger.warn('Warning condition', { context: 'payment' });
logger.error('Error occurred', { error, userId: 123 });
```

**Acceptable** - Console methods for quick debugging (but prefer logger):
```typescript
console.log('Quick debug');   // OK for development
console.warn('Warning');       // Logged in all environments
console.error('Error');        // Logged in all environments
```

### Why Use the Logger?

1. **Structured Data**: Logs include timestamps, context, and metadata
2. **Environment-Aware**: Debug/info logs only in development
3. **Production Ready**: JSON output for log aggregation services
4. **Performance Tracking**: Built-in timer utilities
5. **Error Context**: Automatic stack trace extraction

### Logger Features

- **Log Levels**: debug, info, warn, error
- **Metadata Support**: Attach structured data to logs
- **Performance Timers**: Track operation duration
- **HTTP Logging**: Standardized request/response logging
- **Child Loggers**: Create context-specific loggers

### Migration Path

Console statements are currently allowed (ESLint warnings disabled) to avoid blocking development. When ready for production:

1. Review console.log usage in critical paths
2. Replace with appropriate logger methods
3. Add metadata for better debugging
4. Consider enabling console warnings in ESLint

## ESLint Configuration

Current configuration:
- ✅ No errors
- ✅ No warnings
- ✅ Console statements allowed (logger available)
- ✅ TypeScript-focused rules
- ✅ Disabled non-critical warnings (empty blocks, case declarations, etc.)

The ESLint configuration is intentionally lenient to avoid blocking development while maintaining code quality through TypeScript and tooling.
