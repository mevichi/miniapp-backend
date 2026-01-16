export type Task = {
  taskId: string;
  name: string;
  description: string;
  reward: number;
  type: 'watch_ad' | 'daily' | 'special';
  duration: number; // in seconds
};

export type UserTask = {
  userId: number;
  taskId: string;
  completed: boolean;
  completedAt?: Date;
};

export type WheelSpin = {
  spinId: string;
  userId: number;
  prize: string;
  prizeValue: number;
  keysSpent: number;
  timestamp: Date;
};

export type Withdrawal = {
  withdrawalId: string;
  userId: number;
  walletAddress: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  timestamp: Date;
};

export type User = {
  userId: number;
  username: string;
  telegramId: number;
  referrer?: number;
  balance: number;
  totalKeys: number;
  totalSpins: number;
  wins: number;
  walletAddress?: string;
  createdAt: Date;
};

// Mock users database
export const users = new Map<number, User>();

// Mock tasks database
export const tasks = new Map<string, Task>([
  ['task-1', {
    taskId: 'task-1',
    name: 'Watch Ad Video 1',
    description: 'Watch a 5-second advertisement to earn 1 key',
    reward: 1,
    type: 'watch_ad',
    duration: 5,
  }],
  ['task-2', {
    taskId: 'task-2',
    name: 'Watch Ad Video 2',
    description: 'Watch a 5-second advertisement to earn 1 key',
    reward: 1,
    type: 'watch_ad',
    duration: 5,
  }],
  ['task-3', {
    taskId: 'task-3',
    name: 'Daily Bonus',
    description: 'Complete your daily login to earn 2 keys',
    reward: 2,
    type: 'daily',
    duration: 0,
  }],
  ['task-4', {
    taskId: 'task-4',
    name: 'Share with Friend',
    description: 'Invite a friend and get 5 keys',
    reward: 5,
    type: 'special',
    duration: 0,
  }],
]);

// Mock user tasks (completed tasks)
export const userTasks = new Map<string, UserTask[]>();

// Mock wheel spins
export const wheelSpins = new Map<number, WheelSpin[]>();

// Mock withdrawals
export const withdrawals = new Map<number, Withdrawal[]>();

// Initialize with some mock data
export function initializeMockData() {
  // Create a few mock users
  const mockUsers = [
    { userId: 123456, username: 'TestUser', telegramId: 123456, balance: 250, totalKeys: 15, totalSpins: 10, wins: 450 },
    { userId: 234567, username: 'ProPlayer', telegramId: 234567, balance: 500, totalKeys: 30, totalSpins: 25, wins: 1200 },
    { userId: 345678, username: 'NewbieGamer', telegramId: 345678, balance: 100, totalKeys: 5, totalSpins: 3, wins: 150 },
    { userId: 456789, username: 'HighRoller', telegramId: 456789, balance: 1000, totalKeys: 50, totalSpins: 45, wins: 2500 },
    { userId: 567890, username: 'Lucky', telegramId: 567890, balance: 800, totalKeys: 40, totalSpins: 35, wins: 2000 },
  ];

  mockUsers.forEach((user) => {
    users.set(user.telegramId, {
      ...user,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
    });
  });

  // Add some completed tasks
  userTasks.set('task-1-123456', [{ userId: 123456, taskId: 'task-1', completed: true, completedAt: new Date() }]);
  userTasks.set('task-2-123456', [{ userId: 123456, taskId: 'task-2', completed: true, completedAt: new Date() }]);
}
