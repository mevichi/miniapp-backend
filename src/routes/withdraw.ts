import { Router } from "express";
import { users, withdrawals } from "../store";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

const MIN_WITHDRAW = 10;
const MAX_WITHDRAW = 100000;

/**
 * POST /api/wallet/connect
 * Connect TON wallet to user account
 * Headers: Authorization: Bearer {token}
 * Body: { walletAddress }
 * Response: { success, connected, walletAddress }
 */
router.post("/connect", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { walletAddress } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // Validate wallet address format (basic check)
    if (!/^0x[a-fA-F0-9]{64}$/.test(walletAddress) && walletAddress.length < 20) {
      return res.status(400).json({ error: "Invalid wallet address format" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Connect wallet
    user.walletAddress = walletAddress;

    res.json({
      success: true,
      connected: true,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error("Connect wallet error:", error);
    res.status(500).json({ error: "Failed to connect wallet" });
  }
});

/**
 * POST /api/wallet/withdraw
 * Withdraw coins to connected TON wallet
 * Headers: Authorization: Bearer {token}
 * Body: { amount }
 * Response: { success, transactionId, newBalance, withdrawnAmount }
 */
router.post("/withdraw", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!amount || amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) {
      return res.status(400).json({
        error: `Invalid amount. Must be between ${MIN_WITHDRAW} and ${MAX_WITHDRAW}`,
      });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.walletAddress) {
      return res.status(400).json({ error: "Wallet not connected" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct from balance
    user.balance -= amount;

    // Create withdrawal record
    const withdrawalId = `withdraw-${userId}-${Date.now()}`;
    const transactionId = `tx-${Math.random().toString(36).substring(7)}`;

    const withdrawal = {
      withdrawalId,
      userId,
      walletAddress: user.walletAddress,
      amount,
      status: "completed" as const,
      transactionId,
      timestamp: new Date(),
    };

    if (!withdrawals.has(userId)) {
      withdrawals.set(userId, []);
    }
    withdrawals.get(userId)!.push(withdrawal);

    // In production, you would send actual TON tokens here
    console.log(`💰 Withdrawal recorded: ${amount} coins to ${user.walletAddress}`);

    res.json({
      success: true,
      transactionId,
      newBalance: user.balance,
      withdrawnAmount: amount,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ error: "Failed to process withdrawal" });
  }
});

/**
 * GET /api/wallet/withdrawals
 * Get user's withdrawal history
 * Headers: Authorization: Bearer {token}
 * Response: Array<{ withdrawalId, amount, status, timestamp }>
 */
router.get("/withdrawals", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userWithdrawals = withdrawals.get(userId) || [];

    res.json({
      withdrawals: userWithdrawals.map((w) => ({
        withdrawalId: w.withdrawalId,
        amount: w.amount,
        status: w.status,
        timestamp: w.timestamp,
        transactionId: w.transactionId,
      })),
      walletAddress: user.walletAddress || null,
    });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    res.status(500).json({ error: "Failed to fetch withdrawal history" });
  }
});

/**
 * GET /api/wallet/check-minimum
 * Check minimum withdrawal amount
 * Response: { minWithdraw, maxWithdraw }
 */
router.get("/check-minimum", (req, res) => {
  res.json({
    minWithdraw: MIN_WITHDRAW,
    maxWithdraw: MAX_WITHDRAW,
  });
});

export default router;
