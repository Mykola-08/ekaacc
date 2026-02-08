import type { Instrumentation } from 'next';
import { reportErrorToSupabase } from '@/lib/observability/error-reporting';

function toHeaders(input: Readonly<Record<string, string | string[] | undefined>>) {
  const h = new Headers();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      h.set(key, value.join(','));
      continue;
    }
    if (typeof value === 'string') {
      h.set(key, value);
    }
  }
  return h;
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const normalized = error instanceof Error ? error : new Error(String(error));
  await reportErrorToSupabase(
    {
      source: 'server',
      level: 'fatal',
      message: normalized.message,
      stack: normalized.stack,
      route: request.path,
      metadata: {
        method: request.method,
      },
      context: {
        source: 'instrumentation.onRequestError',
        routerKind: context.routerKind,
        routePath: context.routePath,
        routeType: context.routeType,
        renderSource: context.renderSource,
        revalidateReason: context.revalidateReason,
      },
      additionalData: {
        errorName: normalized.name,
      },
    },
    toHeaders(request.headers)
  );
};


