import { Router } from "express";
import { users } from "../store";
import { optionalAuthMiddleware, AuthRequest } from "../middleware";

const router = Router();

/**
 * GET /api/leaderboard
 * Get leaderboard (top users by balance)
 * Query: limit=10, offset=0
 * Optional Headers: Authorization: Bearer {token}
 * Response: Array<{ rank, userId, username, balance, totalSpins, totalKeys }>
 */
router.get("/", optionalAuthMiddleware, (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    // Get all users and sort by balance
    const allUsers = Array.from(users.values())
      .sort((a, b) => b.balance - a.balance)
      .slice(offset, offset + limit)
      .map((user, index) => ({
        rank: offset + index + 1,
        userId: user.userId,
        username: user.username,
        balance: user.balance,
        totalSpins: user.totalSpins,
        totalKeys: user.totalKeys,
        wins: user.wins,
      }));

    // Find current user's rank if authenticated
    let userRank = null;
    if (req.userId) {
      const currentUser = users.get(req.userId);
      if (currentUser) {
        const allUsersSorted = Array.from(users.values()).sort(
          (a, b) => b.balance - a.balance
        );
        const rankPosition = allUsersSorted.findIndex(
          (u) => u.userId === req.userId
        );
        userRank = rankPosition + 1;
      }
    }

    res.json({
      leaderboard: allUsers,
      total: users.size,
      userRank,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

/**
 * GET /api/leaderboard/:userId
 * Get specific user's rank
 * Response: { rank, userId, username, balance, totalSpins }
 */
router.get("/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const targetUserId = parseInt(userId);

    const targetUser = users.get(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate rank
    const allUsers = Array.from(users.values()).sort(
      (a, b) => b.balance - a.balance
    );
    const rank = allUsers.findIndex((u) => u.userId === targetUserId) + 1;

    res.json({
      rank,
      userId: targetUser.userId,
      username: targetUser.username,
      balance: targetUser.balance,
      totalSpins: targetUser.totalSpins,
      totalKeys: targetUser.totalKeys,
      wins: targetUser.wins,
    });
  } catch (error) {
    console.error("Get user rank error:", error);
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
});

export default router;
