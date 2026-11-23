
import swaggerJsdoc from "swagger-jsdoc";
import dotenv from 'dotenv';

dotenv.config();
const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Finance Tracker API",
      version: "1.0.0",
      description:
        "REST API documentation for the Finance Tracker application",
    },

    servers: [
      {
        url: process.env.NODE_ENV === 'development' ? "http://localhost:4000" : 'https://finance-tracker-api-oap9.onrender.com/',
        description: "Development server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Transactions",
        description: "Transaction management endpoints",
      },
      {
        name: "Categories",
        description: "Predefined transaction categories",
      },
      {
        name: "Upload",
        description: "Profile picture upload endpoints",
      },
      {
        name: "Admin",
        description: "Admin-only endpoints",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
