import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import automobileRoutes from "./routes/automobile.routes";
import spotsRoutes from "./routes/spots.routes";
import swaggerSpec from "./swagger";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API docs — available at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Raw OpenAPI JSON — useful for client generators
app.get("/docs.json", (_req, res) => res.json(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/automobiles", automobileRoutes);
app.use("/api/spots", spotsRoutes);

export default app;
