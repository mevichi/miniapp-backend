# ⚡ Backend Quick Reference

## Start Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at: **http://127.0.0.1:3000**

---

## Quick API Calls

### 1. Get Token (Auth)
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"initData":"test","userId":123456,"username":"TestUser"}'
```

**Response:** `{ "token": "...", "balance": 50, "totalKeys": 5 }`

Save token as: `TOKEN="123456.TestUser.1234567890.signature"`

---

### 2. Get Profile
```bash
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Get Tasks
```bash
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Complete Task
```bash
curl -X POST http://localhost:3000/api/tasks/task-1/complete \
  -H "Authorization: Bearer $TOKEN"
```

**Response:** `{ "keysEarned": 1, "adBonus": 14, "newBalance": 64, "totalKeys": 6 }`

---

### 5. Record Spin
```bash
curl -X POST http://localhost:3000/api/wheel/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"prize":"50 coins","keysSpent":1,"prizeValue":50}'
```

**Response:** `{ "newBalance": 114, "newKeys": 5, "totalSpins": 1 }`

---

### 6. Connect Wallet
```bash
curl -X POST http://localhost:3000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"walletAddress":"UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"}'
```

---

### 7. Withdraw
```bash
curl -X POST http://localhost:3000/api/wallet/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"amount":50}'
```

**Response:** `{ "transactionId": "tx-abc123", "newBalance": 64 }`

---

### 8. Get Leaderboard
```bash
curl "http://localhost:3000/api/leaderboard?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Test Users (Pre-loaded)

```
ID       | Username    | Balance | Keys | Spins
---------|-------------|---------|------|------
123456   | TestUser    | 250     | 15   | 10
234567   | ProPlayer   | 500     | 30   | 25
345678   | NewbieGamer | 100     | 5    | 3
456789   | HighRoller  | 1000    | 50   | 45
567890   | Lucky       | 800     | 40   | 35
```

---

## Test Tasks

| ID | Name | Type | Reward |
|----|------|------|--------|
| task-1 | Watch Ad Video 1 | watch_ad | 1 key |
| task-2 | Watch Ad Video 2 | watch_ad | 1 key |
| task-3 | Daily Bonus | daily | 2 keys |
| task-4 | Share with Friend | special | 5 keys |

---

## All Endpoints

```
🔐 Auth
  POST   /api/auth/verify
  POST   /api/auth/refresh

👤 User
  GET    /api/user/profile
  PUT    /api/user/profile/update

📋 Tasks
  GET    /api/tasks
  POST   /api/tasks/:id/complete
  POST   /api/tasks/:id/reset

🎡 Wheel
  POST   /api/wheel/spin
  GET    /api/wheel/spins

💰 Wallet
  POST   /api/wallet/connect
  POST   /api/wallet/withdraw
  GET    /api/wallet/withdrawals
  GET    /api/wallet/check-minimum

🏆 Leaderboard
  GET    /api/leaderboard
  GET    /api/leaderboard/:userId
```

---

## Common Responses

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "error": "Error message"
}
```

### Unauthorized (missing token)
```json
{
  "error": "Missing or invalid authorization header"
}
```

### Invalid Token
```json
{
  "error": "Invalid or expired token"
}
```

---

## Headers Needed

### All Protected Endpoints
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Public Endpoints
```
Content-Type: application/json
```

---

## Workflow

```
1. Authenticate → Get Token
2. Get Profile → Check balance & keys
3. Get Tasks → List available
4. Complete Task → Get keys + coins
5. Spin Wheel → Cost 1 key, gain coins
6. Connect Wallet → Set wallet address
7. Withdraw → Send coins to wallet
8. Check Leaderboard → See your rank
```

---

## Files to Know

```
src/store.ts         - Mock database & data models
src/middleware.ts    - JWT authentication
src/index.ts         - Main server & routes
src/routes/auth.ts   - Authentication
src/routes/user.ts   - User profile
src/routes/tasks.ts  - Task system
src/routes/wheel.ts  - Wheel game
src/routes/withdraw.ts - Wallet
src/routes/leaderboard.ts - Rankings
```

---

## Environment Variables

```
PORT=3000              # Server port
HOST=127.0.0.1         # Server host
JWT_SECRET=key         # Signing key
BOT_TOKEN=token        # Telegram bot token
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `PORT=3001 npm run dev` |
| Token expired | Call `/api/auth/verify` again |
| No wallet connected | Call `/api/wallet/connect` first |
| Insufficient balance | Check with `/api/user/profile` |
| No keys to spin | Complete a task to get keys |
| Task already completed | Reset with `/api/tasks/:id/reset` |

---

## For Production

1. Change `JWT_SECRET` in `.env`
2. Use real database (PostgreSQL/MySQL)
3. Enable HTTPS
4. Add rate limiting
5. Set up monitoring
6. Deploy to cloud service

---

**Full Docs:** See `BACKEND_API.md` & `TESTING_GUIDE.md`  
**Status:** ✅ Ready to Use
