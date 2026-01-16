import { Router } from "express";
import { users } from "../store";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

/**
 * GET /api/user/profile
 * Get user profile and balance
 * Headers: Authorization: Bearer {token}
 * Response: { userId, username, balance, totalKeys, totalSpins, wins, walletAddress, createdAt }
 */
router.get("/profile", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      userId: user.userId,
      username: user.username,
      balance: user.balance,
      totalKeys: user.totalKeys,
      totalSpins: user.totalSpins,
      wins: user.wins,
      walletAddress: user.walletAddress || null,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * PUT /api/user/profile/update
 * Update user profile
 * Headers: Authorization: Bearer {token}
 * Body: { username }
 * Response: { success, user }
 */
router.put("/profile/update", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) {
      user.username = username;
    }

    res.json({
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        balance: user.balance,
        totalKeys: user.totalKeys,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
