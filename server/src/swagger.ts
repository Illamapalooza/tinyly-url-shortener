import swaggerJsdoc from "swagger-jsdoc";
import { version } from "../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "URL Shortener API",
      version,
      description: "API documentation for URL Shortener Service",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controller/*.ts", "./src/dto/*.ts"],
};

export const specs = swaggerJsdoc(options);
