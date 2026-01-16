import { Router } from "express";
import { users, wheelSpins } from "../store";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

/**
 * POST /api/wheel/spin
 * Record a wheel spin result
 * Headers: Authorization: Bearer {token}
 * Body: { prize, keysSpent, prizeValue, timestamp }
 * Response: { success, newBalance, totalWins, spinId }
 */
router.post("/spin", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { prize, keysSpent, prizeValue } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!prize || keysSpent === undefined || prizeValue === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify user has enough keys
    if (user.totalKeys < keysSpent) {
      return res.status(400).json({ error: "Insufficient keys" });
    }

    // Deduct keys
    user.totalKeys -= keysSpent;

    // Add prize to balance
    user.balance += prizeValue;

    // Increment spins and wins
    user.totalSpins += 1;
    if (prizeValue > 0 && prize !== "Nothing") {
      user.wins += prizeValue;
    }

    // Create spin record
    const spinId = `spin-${userId}-${Date.now()}`;
    const spin = {
      spinId,
      userId,
      prize,
      prizeValue,
      keysSpent,
      timestamp: new Date(),
    };

    if (!wheelSpins.has(userId)) {
      wheelSpins.set(userId, []);
    }
    wheelSpins.get(userId)!.push(spin);

    res.json({
      success: true,
      newBalance: user.balance,
      newKeys: user.totalKeys,
      totalWins: user.wins,
      totalSpins: user.totalSpins,
      spinId,
      prize,
      prizeValue,
    });
  } catch (error) {
    console.error("Record spin error:", error);
    res.status(500).json({ error: "Failed to record spin" });
  }
});

/**
 * GET /api/wheel/spins
 * Get user's spin history
 * Headers: Authorization: Bearer {token}
 * Query: limit=10, offset=0
 * Response: Array<{ spinId, prize, prizeValue, timestamp }>
 */
router.get("/spins", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userSpins = wheelSpins.get(userId) || [];
    const spins = userSpins
      .slice(offset, offset + limit)
      .map((spin) => ({
        spinId: spin.spinId,
        prize: spin.prize,
        prizeValue: spin.prizeValue,
        timestamp: spin.timestamp,
      }));

    res.json({
      spins,
      total: userSpins.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Get spins error:", error);
    res.status(500).json({ error: "Failed to fetch spin history" });
  }
});

export default router;
