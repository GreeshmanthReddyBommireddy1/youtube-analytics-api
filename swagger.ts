import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Youtube Analytics API',
      version: '1.0.0',
      description: 'Youtube Analytics Backend API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@youtubeanalytics.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.youtubeanalytics.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['user_id', 'username', 'email', 'full_name', 'country_code'],
          properties: {
            user_id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'john_doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            full_name: {
              type: 'string',
              example: 'John Doe',
            },
            country_code: {
              type: 'string',
              example: 'US',
            },
            joined_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Channel: {
          type: 'object',
          required: ['channel_id', 'user_id', 'channel_name'],
          properties: {
            channel_id: {
              type: 'integer',
              example: 1,
            },
            user_id: {
              type: 'integer',
              example: 1,
            },
            channel_name: {
              type: 'string',
              example: 'Tech Tutorials',
            },
            description: {
              type: 'string',
              example: 'A channel about technology and programming',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            is_verified: {
              type: 'boolean',
              example: false,
            },
          },
        },
        Video: {
          type: 'object',
          required: ['video_id', 'channel_id', 'genre_id', 'title'],
          properties: {
            video_id: {
              type: 'integer',
              example: 1,
            },
            channel_id: {
              type: 'integer',
              example: 1,
            },
            genre_id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'How to Learn TypeScript',
            },
            description: {
              type: 'string',
              example: 'A complete guide to learning TypeScript',
              nullable: true,
            },
            upload_date: {
              type: 'string',
              format: 'date',
              example: '2024-01-15',
            },
            duration_seconds: {
              type: 'integer',
              example: 3600,
            },
            view_count: {
              type: 'integer',
              example: 50000,
            },
            like_count: {
              type: 'integer',
              example: 1200,
            },
            dislike_count: {
              type: 'integer',
              example: 50,
            },
            is_public: {
              type: 'boolean',
              example: true,
            },
          },
        },
        AppUser: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            username: {
              type: 'string',
              example: 'admin_user',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securePassword123!',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'newuser',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securePassword123!',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'admin_user',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'securePassword123!',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        UserRequest: {
          type: 'object',
          required: ['username', 'email', 'full_name', 'country_code'],
          properties: {
            username: {
              type: 'string',
              example: 'jane_smith',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jane@example.com',
            },
            full_name: {
              type: 'string',
              example: 'Jane Smith',
            },
            country_code: {
              type: 'string',
              maxLength: 2,
              example: 'GB',
            },
          },
        },
        ChannelRequest: {
          type: 'object',
          required: ['user_id', 'channel_name'],
          properties: {
            user_id: {
              type: 'integer',
              example: 1,
            },
            channel_name: {
              type: 'string',
              example: 'My New Channel',
            },
            description: {
              type: 'string',
              example: 'Channel description goes here',
              nullable: true,
            },
          },
        },
        VideoRequest: {
          type: 'object',
          required: ['channel_id', 'genre_id', 'title'],
          properties: {
            channel_id: {
              type: 'integer',
              example: 1,
            },
            genre_id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'New Video Title',
            },
            description: {
              type: 'string',
              example: 'Video description',
              nullable: true,
            },
            duration_seconds: {
              type: 'integer',
              example: 1800,
            },
            is_public: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message describing what went wrong',
            },
            error: {
              type: 'string',
              example: 'Error details',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Channels',
        description: 'Channel management endpoints',
      },
      {
        name: 'Videos',
        description: 'Video management endpoints',
      },
    ],
  },
  apis: [
    './routes/authRoutes.ts',
    './routes/userRoutes.ts',
    './routes/channelRoutes.ts',
    './routes/videoRoutes.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
