import { Router } from "express";
import { users } from "../store";

const router = Router();

const MIN_WITHDRAW = 100;

router.post("/", (req, res) => {
  const { telegramId, wallet } = req.body;

  const user = users.get(Number(telegramId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.balance < MIN_WITHDRAW) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  // TODO: send TON transaction
  console.log(`Send ${user.balance} TON to ${wallet}`);

  user.balance = 0;

  res.json({ success: true });
});

export default router;
