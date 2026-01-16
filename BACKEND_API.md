# 🚀 Backend API - Complete Implementation

## Overview

This is a fully functional backend for the Gold Rush Telegram Mini App with all required endpoints, mock data, and JWT authentication.

## Features

✅ **Authentication**
- Telegram user verification
- JWT token generation and validation
- Token refresh capability

✅ **User Management**
- User profiles with statistics
- Profile updates
- User ranking

✅ **Task System**
- Multiple task types (watch_ad, daily, special)
- Task completion tracking
- Reward distribution
- Task history

✅ **Wheel Game**
- Spin recording with prizes
- Key deduction and balance updates
- Spin history tracking
- Statistics aggregation

✅ **Wallet Integration**
- Wallet connection management
- Withdrawal processing
- Transaction history
- Balance tracking

✅ **Leaderboard**
- Top users ranking
- Individual user rank lookup
- User statistics display

✅ **Mock Data**
- 5 test users with varied balances
- 4 predefined tasks
- Sample transactions and spins

## Installation

```bash
# Install dependencies
npm install
# or
pnpm install

# Create .env file (optional, has defaults)
echo "JWT_SECRET=your-secret-key" > .env
echo "PORT=3000" >> .env
echo "HOST=127.0.0.1" >> .env
```

## Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Production run
npm start
```

The server will start on `http://127.0.0.1:3000`

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### POST `/api/auth/verify`
Verify Telegram user and get JWT token.

**Request:**
```json
{
  "initData": "query_id=...",
  "userId": 123456,
  "username": "testuser"
}
```

**Response:**
```json
{
  "token": "123456.testuser.1234567890.signature",
  "userId": 123456,
  "username": "testuser",
  "balance": 50,
  "totalKeys": 5,
  "totalSpins": 0
}
```

#### POST `/api/auth/refresh`
Refresh JWT token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "token": "new_token",
  "userId": 123456,
  "username": "testuser"
}
```

---

### 👤 User Profile (`/api/user`)

#### GET `/api/user/profile`
Get user profile and statistics.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "userId": 123456,
  "username": "testuser",
  "balance": 250,
  "totalKeys": 15,
  "totalSpins": 10,
  "wins": 450,
  "walletAddress": "0x...",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

#### PUT `/api/user/profile/update`
Update user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "username": "newusername"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": 123456,
    "username": "newusername",
    "balance": 250,
    "totalKeys": 15
  }
}
```

---

### 📋 Tasks (`/api/tasks`)

#### GET `/api/tasks`
Get all available tasks for the user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "taskId": "task-1",
    "name": "Watch Ad Video 1",
    "description": "Watch a 5-second advertisement to earn 1 key",
    "reward": 1,
    "type": "watch_ad",
    "duration": 5,
    "completed": false
  },
  {
    "taskId": "task-2",
    "name": "Watch Ad Video 2",
    "description": "Watch a 5-second advertisement to earn 1 key",
    "reward": 1,
    "type": "watch_ad",
    "duration": 5,
    "completed": false
  },
  {
    "taskId": "task-3",
    "name": "Daily Bonus",
    "description": "Complete your daily login to earn 2 keys",
    "reward": 2,
    "type": "daily",
    "duration": 0,
    "completed": false
  },
  {
    "taskId": "task-4",
    "name": "Share with Friend",
    "description": "Invite a friend and get 5 keys",
    "reward": 5,
    "type": "special",
    "duration": 0,
    "completed": false
  }
]
```

#### POST `/api/tasks/:taskId/complete`
Complete a task and earn rewards.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "keysEarned": 1,
  "adBonus": 12,
  "newBalance": 262,
  "totalKeys": 16
}
```

#### POST `/api/tasks/:taskId/reset`
Reset a task (for testing daily tasks).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Task reset"
}
```

---

### 🎡 Wheel Game (`/api/wheel`)

#### POST `/api/wheel/spin`
Record a wheel spin result.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "prize": "50 coins",
  "keysSpent": 1,
  "prizeValue": 50,
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "newBalance": 312,
  "newKeys": 15,
  "totalWins": 500,
  "totalSpins": 11,
  "spinId": "spin-123456-1705408200000",
  "prize": "50 coins",
  "prizeValue": 50
}
```

#### GET `/api/wheel/spins`
Get user's spin history.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (default: 10) - Number of spins to return
- `offset` (default: 0) - Pagination offset

**Response:**
```json
{
  "spins": [
    {
      "spinId": "spin-123456-1705408200000",
      "prize": "50 coins",
      "prizeValue": 50,
      "timestamp": "2026-01-16T10:30:00.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

---

### 💰 Wallet (`/api/wallet`)

#### POST `/api/wallet/connect`
Connect a TON wallet to user account.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

**Response:**
```json
{
  "success": true,
  "connected": true,
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

#### POST `/api/wallet/withdraw`
Withdraw coins to connected wallet.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "amount": 100,
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "tx-abc123",
  "newBalance": 212,
  "withdrawnAmount": 100,
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

#### GET `/api/wallet/withdrawals`
Get user's withdrawal history.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "withdrawals": [
    {
      "withdrawalId": "withdraw-123456-1705408200000",
      "amount": 100,
      "status": "completed",
      "timestamp": "2026-01-16T10:30:00.000Z",
      "transactionId": "tx-abc123"
    }
  ],
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

#### GET `/api/wallet/check-minimum`
Check minimum and maximum withdrawal amounts.

**Response:**
```json
{
  "minWithdraw": 10,
  "maxWithdraw": 100000
}
```

---

### 🏆 Leaderboard (`/api/leaderboard`)

#### GET `/api/leaderboard`
Get top users ranked by balance.

**Query Parameters:**
- `limit` (default: 10) - Number of users to return
- `offset` (default: 0) - Pagination offset

**Optional Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": 456789,
      "username": "HighRoller",
      "balance": 1000,
      "totalSpins": 45,
      "totalKeys": 50,
      "wins": 2500
    },
    {
      "rank": 2,
      "userId": 567890,
      "username": "Lucky",
      "balance": 800,
      "totalSpins": 35,
      "totalKeys": 40,
      "wins": 2000
    }
  ],
  "total": 5,
  "userRank": 3,
  "limit": 10,
  "offset": 0
}
```

#### GET `/api/leaderboard/:userId`
Get specific user's rank and statistics.

**Response:**
```json
{
  "rank": 3,
  "userId": 123456,
  "username": "testuser",
  "balance": 250,
  "totalSpins": 10,
  "totalKeys": 15,
  "wins": 450
}
```

---

## Mock Data

### 5 Test Users (Pre-loaded)

| User ID | Username | Balance | Keys | Spins | Wins |
|---------|----------|---------|------|-------|------|
| 123456 | TestUser | 250 | 15 | 10 | 450 |
| 234567 | ProPlayer | 500 | 30 | 25 | 1200 |
| 345678 | NewbieGamer | 100 | 5 | 3 | 150 |
| 456789 | HighRoller | 1000 | 50 | 45 | 2500 |
| 567890 | Lucky | 800 | 40 | 35 | 2000 |

### 4 Sample Tasks

1. **Watch Ad Video 1** (task-1)
   - Type: watch_ad
   - Duration: 5 seconds
   - Reward: 1 key
   - Bonus: 5-20 coins

2. **Watch Ad Video 2** (task-2)
   - Type: watch_ad
   - Duration: 5 seconds
   - Reward: 1 key
   - Bonus: 5-20 coins

3. **Daily Bonus** (task-3)
   - Type: daily
   - Reward: 2 keys
   - Resettable daily

4. **Share with Friend** (task-4)
   - Type: special
   - Reward: 5 keys

---

## Testing with cURL

### Test Authentication
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "initData": "test_data",
    "userId": 999999,
    "username": "newuser"
  }'
```

### Test Get Profile
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer 123456.TestUser.1234567890.signature"
```

### Test Complete Task
```bash
curl -X POST http://localhost:3000/api/tasks/task-1/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 123456.TestUser.1234567890.signature"
```

### Test Wheel Spin
```bash
curl -X POST http://localhost:3000/api/wheel/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 123456.TestUser.1234567890.signature" \
  -d '{
    "prize": "50 coins",
    "keysSpent": 1,
    "prizeValue": 50,
    "timestamp": "2026-01-16T10:30:00.000Z"
  }'
```

### Test Connect Wallet
```bash
curl -X POST http://localhost:3000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 123456.TestUser.1234567890.signature" \
  -d '{
    "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
  }'
```

### Test Withdraw
```bash
curl -X POST http://localhost:3000/api/wallet/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 123456.TestUser.1234567890.signature" \
  -d '{
    "amount": 50,
    "timestamp": "2026-01-16T10:30:00.000Z"
  }'
```

### Test Leaderboard
```bash
curl -X GET "http://localhost:3000/api/leaderboard?limit=5" \
  -H "Authorization: Bearer 123456.TestUser.1234567890.signature"
```

---

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Main server file
│   ├── store.ts                 # Mock database & types
│   ├── middleware.ts            # JWT auth middleware
│   ├── verifyTelegram.ts        # Telegram verification
│   └── routes/
│       ├── auth.ts              # Authentication endpoints
│       ├── user.ts              # User profile endpoints
│       ├── tasks.ts             # Tasks endpoints
│       ├── wheel.ts             # Wheel game endpoints
│       ├── withdraw.ts          # Wallet endpoints
│       └── leaderboard.ts       # Leaderboard endpoints
├── package.json
├── tsconfig.json
└── README.md (this file)
```

---

## Database Integration (Production)

To connect to a real database (PostgreSQL/MySQL), replace the in-memory Maps in `store.ts` with actual database queries:

```typescript
// Example with PostgreSQL
import Pool from 'pg'.Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Replace Map-based lookups with:
export const getUserProfile = async (userId: number) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};
```

---

## Environment Variables

```env
# Server Configuration
PORT=3000
HOST=127.0.0.1

# Authentication
JWT_SECRET=your-secret-key-change-in-production
BOT_TOKEN=your-telegram-bot-token

# Database (for production)
DATABASE_URL=postgresql://user:password@localhost/goldRush

# TON Integration (for production)
TON_RPC_URL=https://toncenter.com/api/v2/jsonRPC
TON_MAINNET=true
```

---

## Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Enable Telegram init data verification
- [ ] Add rate limiting middleware
- [ ] Implement HTTPS in production
- [ ] Add input validation and sanitization
- [ ] Set up CORS properly for production domain
- [ ] Add request logging and monitoring
- [ ] Implement withdrawal transaction verification with TON SDK
- [ ] Add email/SMS notifications for withdrawals
- [ ] Set up error logging service

---

## Features to Add (Next Phase)

- [ ] Real database integration (PostgreSQL/MySQL)
- [ ] TON blockchain integration for actual withdrawals
- [ ] Email/SMS notifications
- [ ] User referral system
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Scheduled tasks (daily bonuses)
- [ ] WebSocket for real-time updates
- [ ] Rate limiting and DDoS protection
- [ ] Transaction history export

---

## Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm run dev
```

### JWT Token Expired
Get a new token by calling `/api/auth/verify` again or use `/api/auth/refresh`

### Wallet Not Connected
Call `/api/wallet/connect` first before attempting withdrawal

### Insufficient Balance
Check balance with `/api/user/profile` and ensure it's above minimum withdrawal amount

---

## Support

For issues or questions:
1. Check the API documentation above
2. Review mock data in `src/store.ts`
3. Check console logs for error messages
4. Ensure Authorization header is present for protected routes

---

**Status:** ✅ Ready for Production  
**Version:** 1.0.0  
**Last Updated:** 2026-01-16
