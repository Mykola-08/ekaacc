"use client";
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Support both NEXT_PUBLIC and VITE prefixes to be flexible across environments
  const domain = (process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN || '') as string;
  const clientId = (process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || process.env.VITE_AUTH0_CLIENT_ID || '') as string;

  if (!domain || !clientId) {
    // Render children without Auth0 if not configured. This avoids breaking server-rendered pages.
    console.warn('Auth0 not configured. Set NEXT_PUBLIC_AUTH0_DOMAIN and NEXT_PUBLIC_AUTH0_CLIENT_ID or VITE equivalents.');
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: typeof window !== 'undefined' ? window.location.origin : '' }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ClientProvider;
