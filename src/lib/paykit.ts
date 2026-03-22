import { PayKit, createEndpointHandlers } from '@paykit-sdk/core';
import { stripe } from '@paykit-sdk/stripe';

let _paykit: PayKit | null = null;
let _endpoints: ReturnType<typeof createEndpointHandlers> | null = null;

function getPaykit(): PayKit {
  if (!_paykit) {
    _paykit = new PayKit(stripe());
  }
  return _paykit;
}

function getEndpoints(): ReturnType<typeof createEndpointHandlers> {
  if (!_endpoints) {
    _endpoints = createEndpointHandlers(getPaykit());
  }
  return _endpoints;
}

export const paykit = new Proxy({} as PayKit, {
  get(_, prop) {
    return (getPaykit() as any)[prop as string];
  },
});

export const endpoints = new Proxy({} as ReturnType<typeof createEndpointHandlers>, {
  get(_, prop) {
    return (getEndpoints() as any)[prop as string];
  },
});
