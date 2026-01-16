import { Router } from "express";
import { verifyInitData } from "../verifyTelegram";
import { users } from "../store";

const router = Router();

router.post("/", (req, res) => {
  const { initData, ref } = req.body;

  if (!verifyInitData(initData, process.env.BOT_TOKEN!)) {
    return res.status(401).json({ error: "Invalid Telegram initData" });
  }

  const params = new URLSearchParams(initData);
  const telegramUser = JSON.parse(params.get("user")!);
  const telegramId = telegramUser.id;

  if (!users.has(telegramId)) {
    users.set(telegramId, {
      telegramId,
      referrer: ref ? Number(ref) : undefined,
      balance: 0
    });
  }

  res.json({ telegramId });
});

export default router;
