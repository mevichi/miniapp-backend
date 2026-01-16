# 🧪 Backend Testing Guide

## Quick Start Testing

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Backend Server Started!
📍 URL: http://127.0.0.1:3000
📊 Health: http://127.0.0.1:3000/
```

### 2. Test Health Check

```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "status": "✅ MBux-style backend is running!",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## Complete Testing Workflow

### Step 1: Authenticate (Get Token)

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "initData": "test_data",
    "userId": 123456,
    "username": "TestUser"
  }'
```

**Response:**
```json
{
  "token": "123456.TestUser.1234567890.signature",
  "userId": 123456,
  "username": "TestUser",
  "balance": 50,
  "totalKeys": 5,
  "totalSpins": 0
}
```

**Save the token:** `TOKEN="123456.TestUser.1234567890.signature"`

---

### Step 2: Get User Profile

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "userId": 123456,
  "username": "TestUser",
  "balance": 50,
  "totalKeys": 5,
  "totalSpins": 0,
  "wins": 0,
  "walletAddress": null,
  "createdAt": "2026-01-16T10:00:00.000Z"
}
```

---

### Step 3: Get All Tasks

```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
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

---

### Step 4: Complete a Task

```bash
curl -X POST http://localhost:3000/api/tasks/task-1/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "success": true,
  "keysEarned": 1,
  "adBonus": 14,
  "newBalance": 64,
  "totalKeys": 6
}
```

**Note:** `adBonus` is random (5-20 coins)

---

### Step 5: Try to Complete Same Task Again

```bash
curl -X POST http://localhost:3000/api/tasks/task-1/complete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected error response:**
```json
{
  "error": "Task already completed"
}
```

---

### Step 6: Reset a Task (for testing)

```bash
curl -X POST http://localhost:3000/api/tasks/task-1/reset \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "success": true,
  "message": "Task reset"
}
```

---

### Step 7: Record a Wheel Spin

```bash
curl -X POST http://localhost:3000/api/wheel/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prize": "50 coins",
    "keysSpent": 1,
    "prizeValue": 50,
    "timestamp": "2026-01-16T10:30:00.000Z"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "newBalance": 114,
  "newKeys": 5,
  "totalWins": 50,
  "totalSpins": 1,
  "spinId": "spin-123456-1705408200000",
  "prize": "50 coins",
  "prizeValue": 50
}
```

---

### Step 8: Try to Spin Without Keys

First, spin multiple times to use all keys:

```bash
# Spin with last key
curl -X POST http://localhost:3000/api/wheel/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prize": "10 coins",
    "keysSpent": 1,
    "prizeValue": 10,
    "timestamp": "2026-01-16T10:35:00.000Z"
  }'
```

Now try to spin again (should fail):

```bash
curl -X POST http://localhost:3000/api/wheel/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "prize": "20 coins",
    "keysSpent": 1,
    "prizeValue": 20,
    "timestamp": "2026-01-16T10:40:00.000Z"
  }'
```

**Expected error:**
```json
{
  "error": "Insufficient keys"
}
```

---

### Step 9: Get Spin History

```bash
curl -X GET "http://localhost:3000/api/wheel/spins?limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "spins": [
    {
      "spinId": "spin-123456-1705408200000",
      "prize": "50 coins",
      "prizeValue": 50,
      "timestamp": "2026-01-16T10:30:00.000Z"
    },
    {
      "spinId": "spin-123456-1705408500000",
      "prize": "10 coins",
      "prizeValue": 10,
      "timestamp": "2026-01-16T10:35:00.000Z"
    }
  ],
  "total": 2,
  "limit": 5,
  "offset": 0
}
```

---

### Step 10: Connect Wallet

```bash
curl -X POST http://localhost:3000/api/wallet/connect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "connected": true,
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

---

### Step 11: Check Withdrawal Limits

```bash
curl -X GET http://localhost:3000/api/wallet/check-minimum
```

**Expected response:**
```json
{
  "minWithdraw": 10,
  "maxWithdraw": 100000
}
```

---

### Step 12: Withdraw Coins

First, check your balance:

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

Note the balance. Then withdraw (must have min 10 coins and wallet connected):

```bash
curl -X POST http://localhost:3000/api/wallet/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 50,
    "timestamp": "2026-01-16T10:45:00.000Z"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "transactionId": "tx-abc123",
  "newBalance": 74,
  "withdrawnAmount": 50,
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

---

### Step 13: Get Withdrawal History

```bash
curl -X GET http://localhost:3000/api/wallet/withdrawals \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
```json
{
  "withdrawals": [
    {
      "withdrawalId": "withdraw-123456-1705408500000",
      "amount": 50,
      "status": "completed",
      "timestamp": "2026-01-16T10:45:00.000Z",
      "transactionId": "tx-abc123"
    }
  ],
  "walletAddress": "UQBvzVJXxVJZQV3lJCvOhjmhbEb3LqFKPwJlm2VKVJNv6hCx"
}
```

---

### Step 14: Test Leaderboard

```bash
curl -X GET "http://localhost:3000/api/leaderboard?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected response:**
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
    },
    {
      "rank": 3,
      "userId": 234567,
      "username": "ProPlayer",
      "balance": 500,
      "totalSpins": 25,
      "totalKeys": 30,
      "wins": 1200
    },
    {
      "rank": 4,
      "userId": 123456,
      "username": "TestUser",
      "balance": 74,
      "totalSpins": 1,
      "totalKeys": 5,
      "wins": 50
    },
    {
      "rank": 5,
      "userId": 345678,
      "username": "NewbieGamer",
      "balance": 100,
      "totalSpins": 3,
      "totalKeys": 5,
      "wins": 150
    }
  ],
  "total": 5,
  "userRank": 4,
  "limit": 5,
  "offset": 0
}
```

---

### Step 15: Get Specific User Rank

```bash
curl -X GET http://localhost:3000/api/leaderboard/234567
```

**Expected response:**
```json
{
  "rank": 3,
  "userId": 234567,
  "username": "ProPlayer",
  "balance": 500,
  "totalSpins": 25,
  "totalKeys": 30,
  "wins": 1200
}
```

---

## Error Testing

### Test Invalid Token

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected error:**
```json
{
  "error": "Invalid or expired token"
}
```

### Test Missing Authorization

```bash
curl -X GET http://localhost:3000/api/user/profile
```

**Expected error:**
```json
{
  "error": "Missing or invalid authorization header"
}
```

### Test Insufficient Balance for Withdrawal

```bash
# Create new user with low balance
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "initData": "test",
    "userId": 999,
    "username": "pooruser"
  }'
```

Then try to withdraw more than available:

```bash
curl -X POST http://localhost:3000/api/wallet/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 999.pooruser.1234567890.signature" \
  -d '{
    "amount": 1000,
    "timestamp": "2026-01-16T10:45:00.000Z"
  }'
```

**Expected error:**
```json
{
  "error": "Insufficient balance"
}
```

---

## Using Postman

### Import Collection

Create a new Postman collection with these requests:

```json
{
  "info": {
    "name": "Gold Rush Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Verify User",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/verify",
            "body": {
              "mode": "raw",
              "raw": "{\"initData\":\"test\",\"userId\":123456,\"username\":\"TestUser\"}"
            }
          }
        }
      ]
    }
  ]
}
```

Set environment variable:
```
baseUrl = http://localhost:3000
```

---

## Testing Checklist

- [ ] Health check endpoint responds
- [ ] Authentication creates tokens
- [ ] User profile retrieval works
- [ ] Task listing works
- [ ] Task completion gives keys and coins
- [ ] Task completion prevents re-completion
- [ ] Wheel spin records with correct balance update
- [ ] Insufficient keys error on spin
- [ ] Spin history is stored and retrieved
- [ ] Wallet connection stores address
- [ ] Withdrawal decreases balance
- [ ] Withdrawal history is maintained
- [ ] Leaderboard sorting is correct
- [ ] Individual user rank retrieval works
- [ ] Invalid token returns 401
- [ ] Missing auth header returns 401
- [ ] Non-existent endpoints return 404

---

## Mock Data Available

**Test Users:**
```
TestUser (123456) - balance: 50, keys: 5
ProPlayer (234567) - balance: 500, keys: 30
NewbieGamer (345678) - balance: 100, keys: 5
HighRoller (456789) - balance: 1000, keys: 50
Lucky (567890) - balance: 800, keys: 40
```

**Test Tasks:**
```
task-1: Watch Ad Video 1 (1 key)
task-2: Watch Ad Video 2 (1 key)
task-3: Daily Bonus (2 keys)
task-4: Share with Friend (5 keys)
```

---

**Happy Testing!** 🎉
