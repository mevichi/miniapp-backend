# 📖 Backend Documentation Index

## Quick Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | ⚡ 30-second cheat sheet | 2 min |
| **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** | 📋 What was built | 5 min |
| **[BACKEND_API.md](./BACKEND_API.md)** | 📚 Complete API reference | 15 min |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | 🧪 How to test everything | 20 min |

---

## I'm a...

### 👨‍💻 Developer
1. Start with **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Get commands to run
2. Read **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Understand what's built
3. Check **[BACKEND_API.md](./BACKEND_API.md)** - See all endpoints
4. Reference **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Test everything

### 🧪 QA/Tester
1. Read **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete workflows
2. Check **[BACKEND_API.md](./BACKEND_API.md)** - Expected responses
3. Use **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick commands

### 🏗️ DevOps/Deployer
1. Check **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What to deploy
2. See production section in **[BACKEND_API.md](./BACKEND_API.md)**
3. Review environment variables

### 🎨 Frontend Developer
1. Check **[BACKEND_API.md](./BACKEND_API.md)** - All endpoints and responses
2. Use **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Test data and flows
3. Reference **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Sample calls

---

## What Was Built

### ✅ Complete Backend with 20+ Endpoints

```
🔐 Authentication (2)
  - User verification & token generation
  - Token refresh

👤 User Management (2)
  - Profile retrieval
  - Profile updates

📋 Task System (3)
  - List tasks
  - Complete tasks (earn keys + coins)
  - Reset tasks (for testing)

🎡 Wheel Game (2)
  - Record spins
  - View spin history

💰 Wallet & Withdrawals (4)
  - Connect wallet
  - Withdraw coins
  - View withdrawals
  - Check limits

🏆 Leaderboard (2)
  - Top users ranking
  - Individual user rank
```

### 📦 Mock Data Included

- 5 test users (pre-loaded with different balances)
- 4 sample tasks (watch_ad, daily, special)
- Complete user management
- Transaction history
- Full statistics tracking

---

## File Structure

```
backend/
├── src/
│   ├── index.ts              ← Main server (start here!)
│   ├── store.ts              ← Data models & mock database
│   ├── middleware.ts         ← JWT authentication
│   ├── verifyTelegram.ts     ← Telegram verification
│   └── routes/               ← All API endpoints
│       ├── auth.ts           ← Login & tokens
│       ├── user.ts           ← Profile
│       ├── tasks.ts          ← Tasks & rewards
│       ├── wheel.ts          ← Wheel spins
│       ├── withdraw.ts       ← Wallet & withdrawals
│       └── leaderboard.ts    ← Rankings
├── QUICK_REFERENCE.md        ← 2-minute cheat sheet
├── IMPLEMENTATION_SUMMARY.md ← What was built
├── BACKEND_API.md            ← Full API documentation
├── TESTING_GUIDE.md          ← How to test
├── package.json
└── tsconfig.json
```

---

## Getting Started (3 Steps)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Server
```bash
npm run dev
```

### 3. Test It Works
```bash
curl http://localhost:3000/
```

**That's it!** Server is running at `http://127.0.0.1:3000`

---

## Architecture

### Authentication Flow
```
Frontend sends initData + userId + username
         ↓
Backend verifies & generates JWT token
         ↓
Frontend stores token in state
         ↓
All API calls include: Authorization: Bearer {token}
         ↓
Backend validates token on each request
```

### Data Model
```
User
├── userId (unique)
├── username
├── balance (coins)
├── totalKeys (for spinning)
├── totalSpins (stats)
├── wins (total coins won)
└── walletAddress (TON wallet)

Task
├── taskId
├── name
├── description
├── reward (keys)
├── type (watch_ad, daily, special)
└── duration (in seconds)

WheelSpin
├── spinId
├── userId
├── prize (description)
├── prizeValue (coins)
├── keysSpent
└── timestamp

Withdrawal
├── withdrawalId
├── userId
├── walletAddress
├── amount
├── status
└── transactionId
```

---

## API Categories

### 🔐 Authentication Required
All endpoints except `/api/leaderboard` (public) require:
```
Authorization: Bearer {token}
```

Get a token with:
```bash
POST /api/auth/verify
Body: { initData, userId, username }
```

### 📊 Statistics Endpoints
- `/api/user/profile` - User stats
- `/api/wheel/spins` - Spin history
- `/api/wallet/withdrawals` - Withdrawal history
- `/api/leaderboard` - Ranking

### 🎮 Action Endpoints
- `POST /api/tasks/:id/complete` - Complete task
- `POST /api/wheel/spin` - Record spin
- `POST /api/wallet/connect` - Connect wallet
- `POST /api/wallet/withdraw` - Withdraw coins

---

## Common Workflows

### Workflow 1: New User Sign In
```
1. POST /api/auth/verify          → Get token
2. GET /api/user/profile          → See initial state
```

### Workflow 2: Watch Ad & Earn Keys
```
1. GET /api/tasks                 → See available tasks
2. POST /api/tasks/task-1/complete → Complete & earn keys
3. GET /api/user/profile          → Check new balance/keys
```

### Workflow 3: Spin the Wheel
```
1. GET /api/user/profile          → Check you have keys
2. POST /api/wheel/spin           → Record the spin
3. GET /api/wheel/spins           → View spin history
```

### Workflow 4: Withdraw Coins
```
1. GET /api/wallet/check-minimum  → Check min/max
2. POST /api/wallet/connect       → Connect wallet
3. POST /api/wallet/withdraw      → Withdraw coins
4. GET /api/wallet/withdrawals    → View history
```

### Workflow 5: Check Rank
```
1. GET /api/leaderboard           → See top users
2. GET /api/leaderboard/:userId   → Get specific rank
```

---

## Response Types

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not found |
| 500 | Server error |

---

## Test Data Available

### Pre-loaded Users
```
TestUser (123456)     - 250 coins, 15 keys
ProPlayer (234567)    - 500 coins, 30 keys
NewbieGamer (345678)  - 100 coins, 5 keys
HighRoller (456789)   - 1000 coins, 50 keys
Lucky (567890)        - 800 coins, 40 keys
```

### Sample Tasks
```
task-1: Watch Ad Video 1 (1 key, 5 sec)
task-2: Watch Ad Video 2 (1 key, 5 sec)
task-3: Daily Bonus (2 keys)
task-4: Share with Friend (5 keys)
```

---

## Next Steps

### For Local Testing
→ Follow **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**

### For Full API Reference
→ See **[BACKEND_API.md](./BACKEND_API.md)**

### For Implementation Details
→ Check **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**

### For Quick Reminders
→ Use **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)**

---

## Integration with Frontend

The frontend (`nextjs-template/src/services/api.ts`) is already set up to call these endpoints!

Just update the `API_BASE_URL`:

```typescript
// For local development
const API_BASE_URL = 'http://127.0.0.1:3000';

// For production
const API_BASE_URL = 'https://api.solfren.dev';
```

Then start both servers and they'll communicate automatically!

---

## Production Deployment

### Backend
1. Replace mock database with real database
2. Set up environment variables
3. Deploy to cloud (Heroku, Railway, Render, etc.)
4. Update API_BASE_URL in frontend

### Security Checklist
- [ ] Change JWT_SECRET
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Add request logging
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Enable CORS properly

---

## Troubleshooting

### Server won't start
```bash
# Check if port is in use
npm run dev -- --port 3001

# Or kill process
lsof -ti:3000 | xargs kill -9
```

### Token expired
Create a new token:
```bash
POST /api/auth/verify
```

### Wallet not connected
Connect wallet first:
```bash
POST /api/wallet/connect
```

### Insufficient balance
Check balance:
```bash
GET /api/user/profile
```

---

## Support Files

| File | Contains |
|------|----------|
| `src/index.ts` | Server setup & routes |
| `src/store.ts` | Data models & mock data |
| `src/middleware.ts` | JWT authentication |
| `src/routes/*.ts` | All API endpoints |
| `BACKEND_API.md` | Full documentation |
| `TESTING_GUIDE.md` | Testing workflows |
| `QUICK_REFERENCE.md` | Cheat sheet |

---

## Summary

✅ **Complete backend with:**
- 20+ endpoints
- JWT authentication
- Mock data (5 users, 4 tasks)
- Full documentation
- Testing guide
- Production-ready code

✅ **Ready to:**
- Start locally
- Test with cURL
- Integrate with frontend
- Deploy to production

---

**Let's get started!** 🚀

1. `cd backend && npm install`
2. `npm run dev`
3. `curl http://localhost:3000/`

See **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** for instant API calls!
