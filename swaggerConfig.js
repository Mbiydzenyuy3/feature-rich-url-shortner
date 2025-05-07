import swaggerJsdoc from "swagger-jsdoc";

const PORT = process.env.PORT || 4000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment Booking API",
      version: "1.0.0",
      description:
        "API documentation for the Appointment Booking system, including user authentication, provider management, time slots, and appointment booking/cancellation.",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme.",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier of the user",
            },
            name: { type: "string", description: "Full name of the user" },
            email: {
              type: "string",
              format: "email",
              description: "Email address of the user",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date and time when the user was created",
            },
          },
          required: ["id", "name", "email"],
        },
        url: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier of the provider",
            },
            name: { type: "string", description: "Full name of the provider" },
            email: {
              type: "string",
              format: "email",
              description: "Email address of the provider",
            },
            long_url: {
              type: "string",
              description:"",
            }, 
          },
          required: ["id", "name", "email"],
        },
        short_code: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "",
            },
          },
          required: ["id", "day", "startTime", "endTime", "serviceProviderId"],
        },

        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error message description" },
            errors: {
              type: "array",
              items: { type: "string" },
              example: ['"providerId" is not allowed'],
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
