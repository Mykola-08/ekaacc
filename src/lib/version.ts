export interface AppVersionInfo {
  version: string;
  buildId: string;
  buildTimestamp: string;
  environment: string;
}

export function getAppVersionInfo(): AppVersionInfo {
  return {
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? process.env.APP_VERSION ?? '0.0.0',
    buildId: process.env.NEXT_PUBLIC_APP_BUILD_ID ?? process.env.APP_BUILD_ID ?? 'dev',
    buildTimestamp:
      process.env.NEXT_PUBLIC_APP_BUILD_TIMESTAMP ??
      process.env.APP_BUILD_TIMESTAMP ??
      new Date(0).toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  };
}
