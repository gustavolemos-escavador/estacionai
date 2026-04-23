import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import automobileRoutes from "./routes/automobile.routes";
import spotsRoutes from "./routes/spots.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/automobiles", automobileRoutes);
app.use("/api/spots", spotsRoutes);

export default app;
