import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeMockData } from "./store";
import auth from "./routes/auth";
import tasks from "./routes/tasks";
import user from "./routes/user";
import wheel from "./routes/wheel";
import withdraw from "./routes/withdraw";
import leaderboard from "./routes/leaderboard";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize mock data
initializeMockData();

// Health check
app.get("/", (_, res) => {
  res.json({
    status: "✅ MBux-style backend is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      tasks: "/api/tasks",
      wheel: "/api/wheel",
      wallet: "/api/wallet",
      leaderboard: "/api/leaderboard",
    },
  });
});

// API Routes
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/tasks", tasks);
app.use("/api/wheel", wheel);
app.use("/api/wallet", withdraw);
app.use("/api/leaderboard", leaderboard);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
);

const PORT = 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST as any, () => {
  console.log(`
🚀 Backend Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 URL: http://${HOST}:${PORT}
📊 Health: http://${HOST}:${PORT}/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Endpoints:
🔐 Authentication:
   POST   /api/auth/verify      - Verify Telegram user & get token
   POST   /api/auth/refresh     - Refresh JWT token

👤 User:
   GET    /api/user/profile     - Get user profile
   PUT    /api/user/profile/update - Update profile

📋 Tasks:
   GET    /api/tasks            - Get all tasks
   POST   /api/tasks/:id/complete - Complete a task
   POST   /api/tasks/:id/reset  - Reset a task (testing)

🎡 Wheel:
   POST   /api/wheel/spin       - Record a spin
   GET    /api/wheel/spins      - Get spin history

💰 Wallet:
   POST   /api/wallet/connect   - Connect TON wallet
   POST   /api/wallet/withdraw  - Withdraw coins
   GET    /api/wallet/withdrawals - Get withdrawal history
   GET    /api/wallet/check-minimum - Check min/max amounts

🏆 Leaderboard:
   GET    /api/leaderboard      - Get top users
   GET    /api/leaderboard/:userId - Get user rank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Mock data loaded with 5 test users
📱 Ready for frontend integration!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

export default app;
