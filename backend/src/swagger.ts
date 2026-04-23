import type { OpenAPIV3 } from "openapi-types";

const bearerAuth: OpenAPIV3.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
};

const spec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "EstacionAI API",
    version: "1.0.0",
    description: "Backend para o sistema de monitoramento de vagas EstacionAI.",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: { bearerAuth },
    schemas: {
      User: {
        type: "object",
        properties: {
          id:        { type: "string", format: "uuid" },
          firstName: { type: "string" },
          lastName:  { type: "string" },
          email:     { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Automobile: {
        type: "object",
        properties: {
          id:        { type: "string", format: "uuid" },
          model:     { type: "string" },
          plate:     { type: "string" },
          type:      { type: "string", enum: ["CAR", "MOTORCYCLE"] },
          userId:    { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SpotsStatus: {
        type: "object",
        properties: {
          total:     { type: "integer" },
          free:      { type: "integer" },
          occupied:  { type: "integer" },
          vagas:     { type: "array", items: { type: "boolean" }, description: "true = disponível, false = ocupada" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },
  paths: {
    // ── Auth ──────────────────────────────────────────────────────────────
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Criar conta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password"],
                properties: {
                  firstName: { type: "string" },
                  lastName:  { type: "string" },
                  email:     { type: "string", format: "email" },
                  password:  { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Usuário criado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "400": { description: "Campos obrigatórios ausentes", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "E-mail já em uso",            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Autenticar e obter token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email:    { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login bem-sucedido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user:  { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "400": { description: "Campos obrigatórios ausentes", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Credenciais inválidas",        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Automobiles ───────────────────────────────────────────────────────
    "/automobiles": {
      get: {
        tags: ["Automobiles"],
        summary: "Listar veículos do usuário autenticado",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Lista de veículos", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Automobile" } } } } },
          "401": { description: "Não autenticado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        tags: ["Automobiles"],
        summary: "Cadastrar veículo",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["model", "plate", "type"],
                properties: {
                  model: { type: "string" },
                  plate: { type: "string", example: "ABC1D23" },
                  type:  { type: "string", enum: ["CAR", "MOTORCYCLE"] },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Veículo criado",   content: { "application/json": { schema: { $ref: "#/components/schemas/Automobile" } } } },
          "400": { description: "Campos inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Não autenticado",  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "Placa já cadastrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/automobiles/{id}": {
      delete: {
        tags: ["Automobiles"],
        summary: "Remover veículo",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "204": { description: "Removido com sucesso" },
          "401": { description: "Não autenticado",    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "403": { description: "Sem permissão",      content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Veículo não encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },

    // ── Spots ─────────────────────────────────────────────────────────────
    "/spots/hardware": {
      post: {
        tags: ["Spots"],
        summary: "Atualizar vagas via hardware (ESP32)",
        description: "Recebe o estado de todas as vagas enviado pelo sensor HC-SR04. `true` = disponível, `false` = ocupada. Enviado a cada 2 segundos.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["vagas"],
                properties: {
                  vagas: {
                    type: "array",
                    minItems: 1,
                    items: { type: "boolean" },
                    example: [true, false, true, true, false, true, false],
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Estado atualizado", content: { "application/json": { schema: { $ref: "#/components/schemas/SpotsStatus" } } } },
          "400": { description: "Payload inválido",  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/spots/status": {
      get: {
        tags: ["Spots"],
        summary: "Obter estado atual das vagas",
        description: "Retorna o último estado recebido do hardware.",
        responses: {
          "200": { description: "Estado atual", content: { "application/json": { schema: { $ref: "#/components/schemas/SpotsStatus" } } } },
          "404": { description: "Nenhum dado recebido ainda", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/spots/update": {
      post: {
        tags: ["Spots"],
        summary: "Atualizar vagas manualmente",
        description: "Endpoint legado para envio manual de contagem e notificação Slack.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["free", "total"],
                properties: {
                  free:   { type: "integer", minimum: 0 },
                  total:  { type: "integer", minimum: 1 },
                  sector: { type: "string", example: "A" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Notificação enviada", content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" }, free: { type: "integer" }, total: { type: "integer" }, sector: { type: "string" } } } } } },
          "400": { description: "Campos inválidos",   content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "422": { description: "Valores inconsistentes", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "502": { description: "Falha no Slack",     content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
};

export default spec;
