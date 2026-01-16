import { Router } from "express";
import { verifyInitData } from "../verifyTelegram";
import { users } from "../store";
import { generateToken } from "../middleware";

const router = Router();

/**
 * POST /api/auth/verify
 * Verify Telegram user and generate JWT token
 * Body: { initData, userId, username }
 * Response: { token, userId, username, balance, totalKeys, totalSpins }
 */
router.post("/verify", (req, res) => {
  try {
    const { initData, userId, username } = req.body;

    // Verify Telegram init data (optional - for now we'll accept it)
    // In production, uncomment to verify:
    // if (!verifyInitData(initData, process.env.BOT_TOKEN!)) {
    //   return res.status(401).json({ error: "Invalid Telegram initData" });
    // }

    if (!userId || !username) {
      return res.status(400).json({ error: "Missing userId or username" });
    }

    // Check if user exists, if not create one
    let user = users.get(userId);
    if (!user) {
      user = {
        userId,
        username,
        telegramId: userId,
        balance: 50, // Starting balance for new users
        totalKeys: 5, // Starting keys for new users
        totalSpins: 0,
        wins: 0,
        createdAt: new Date(),
      };
      users.set(userId, user);
    }

    // Generate JWT token
    const token = generateToken(userId, username);

    res.json({
      token,
      userId: user.userId,
      username: user.username,
      balance: user.balance,
      totalKeys: user.totalKeys,
      totalSpins: user.totalSpins,
    });
  } catch (error) {
    console.error("Auth verify error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 * Headers: Authorization: Bearer {token}
 * Response: { token, userId, username }
 */
router.post("/refresh", (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.substring(7);
    // In a real app, verify the token first
    
    const authHeader2 = req.headers.authorization;
    const token2 = authHeader2!.substring(7);
    
    // Extract user info from token (simplified)
    const parts = token2.split(".");
    if (parts.length < 2) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const userId = parseInt(parts[0]);
    const username = parts[1];

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new token
    const newToken = generateToken(userId, username);

    res.json({
      token: newToken,
      userId,
      username,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

export default router;
