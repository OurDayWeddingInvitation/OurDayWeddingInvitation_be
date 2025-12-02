/**
 * @file Swagger(OpenAPI) 설정 (자동반영)
 */
import fs from 'fs';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'OurDay API Docs',
      version: '1.0.0',
      description: 'OurDay API 문서',
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: 'http://api.ourday.kr',
        description: 'Local Server',
      },
      {
        url: 'http://localhost:8000',
        description: 'Local Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      responses: {
        SuccessResponse: {
          description: '성공 응답',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/*/*route.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("✅ swagger.json 파일 생성 완료");