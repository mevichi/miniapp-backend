export type User = {
  telegramId: number;
  referrer?: number;
  balance: number;
};

export const users = new Map<number, User>();
