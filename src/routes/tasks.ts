import { Router } from "express";
import { users } from "../store";

const router = Router();

router.post("/complete", (req, res) => {
  const { telegramId, taskId } = req.body;

  const user = users.get(Number(telegramId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // TODO: real verification (join channel, etc)
  user.balance += 10;

  res.json({
    success: true,
    balance: user.balance
  });
});

export default router;
