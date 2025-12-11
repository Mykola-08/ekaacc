import { NextResponse } from 'next/server';

export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'EKA Account API',
      description: 'API for EKA Account platform actions, designed for ChatGPT integration.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://api.ekabalance.com', // TODO: Update with production URL
        description: 'Production Server',
      },
      // {
      //   url: 'http://localhost:3001', // Local testing
      //   description: 'Local Development Server',
      // },
    ],
    paths: {
      '/api/me': {
        get: {
          operationId: 'getCurrentUser',
          summary: 'Get Current User Info',
          description: 'Retrieves information about the currently authenticated user.',
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
        },
      },
      // Add more paths here as needed
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

  return NextResponse.json(spec);
}
