
describe('Auth0 Action: Sync User to Supabase', () => {
  // Mock the Auth0 Action environment
  const mockApi = {
    idToken: {
      setCustomClaim: jest.fn(),
    },
    accessToken: {
      setCustomClaim: jest.fn(),
    },
  };

  const mockEvent = {
    user: {
      user_id: 'auth0|123456',
      email: 'test@example.com',
      email_verified: true,
    },
    authorization: {}, // Simulating authorization present
  };

  // The code deployed to Auth0
  const onExecutePostLogin = async (event: any, api: any) => {
    const namespace = 'https://supabase.io/jwt/claims';
    
    if (event.authorization) {
      api.idToken.setCustomClaim(namespace, {
        user_id: event.user.user_id,
        email: event.user.email,
        email_verified: event.user.email_verified,
        role: 'authenticated'
      });
      
      api.accessToken.setCustomClaim(namespace, {
        user_id: event.user.user_id,
        email: event.user.email,
        email_verified: event.user.email_verified,
        role: 'authenticated'
      });
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add Supabase custom claims to ID and Access tokens', async () => {
    await onExecutePostLogin(mockEvent, mockApi);

    const expectedClaims = {
      user_id: 'auth0|123456',
      email: 'test@example.com',
      email_verified: true,
      role: 'authenticated',
    };

    const namespace = 'https://supabase.io/jwt/claims';

    expect(mockApi.idToken.setCustomClaim).toHaveBeenCalledWith(namespace, expectedClaims);
    expect(mockApi.accessToken.setCustomClaim).toHaveBeenCalledWith(namespace, expectedClaims);
  });

  it('should not add claims if authorization is missing', async () => {
    const eventWithoutAuth = { ...mockEvent, authorization: undefined };
    await onExecutePostLogin(eventWithoutAuth, mockApi);

    expect(mockApi.idToken.setCustomClaim).not.toHaveBeenCalled();
    expect(mockApi.accessToken.setCustomClaim).not.toHaveBeenCalled();
  });
});
