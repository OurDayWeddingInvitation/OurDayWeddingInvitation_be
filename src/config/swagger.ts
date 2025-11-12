/**
 * @file Swagger(OpenAPI) 설정 (자동반영)
 */
import fs from 'fs';
import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const prismaSchemaPath = './prisma/json-schema/json-schema.json';

function loadPrismaSchemas(): Record<string, any> {
    if (!fs.existsSync(prismaSchemaPath)) {
        console.warn('[swagger] Prisma JSON schema file not found');
        return {};
    }

    const schemaJson = JSON.parse(fs.readFileSync(prismaSchemaPath, 'utf8'));
    return schemaJson.definition || {};
}

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
        url: 'http://localhost:8080',
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
      schemas: loadPrismaSchemas(), // Prisma 모델 자동 반영
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
  apis: ['./src/modules/*/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("✅ swagger.json 파일 생성 완료");