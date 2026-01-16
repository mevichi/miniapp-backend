import { Router } from "express";
import { users, tasks, userTasks } from "../store";
import { authMiddleware, AuthRequest } from "../middleware";

const router = Router();

/**
 * GET /api/tasks
 * Get all available tasks for the user
 * Headers: Authorization: Bearer {token}
 * Response: Array<{ taskId, name, description, reward, completed, type, duration }>
 */
router.get("/", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return all tasks with completion status
    const taskList = Array.from(tasks.values()).map((task) => ({
      taskId: task.taskId,
      name: task.name,
      description: task.description,
      reward: task.reward,
      type: task.type,
      duration: task.duration,
      completed: userTasks.has(`${task.taskId}-${userId}`),
    }));

    res.json(taskList);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/**
 * POST /api/tasks/:taskId/complete
 * Complete a task (e.g., watch ad video)
 * Headers: Authorization: Bearer {token}
 * Response: { success, keysEarned, newBalance, totalKeys }
 */
router.post("/:taskId/complete", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const task = tasks.get(taskId as string);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if already completed
    const taskKey = `${taskId}-${userId}`;
    if (userTasks.has(taskKey)) {
      return res.status(400).json({ error: "Task already completed" });
    }

    // Award the user
    user.totalKeys += task.reward;

    // Mark task as completed
    userTasks.set(taskKey, [
      {
        userId,
        taskId: taskId as string,
        completed: true,
        completedAt: new Date(),
      },
    ]);

    // Simulate balance update from watching ad
    const adBonus = Math.floor(Math.random() * 15) + 5; // Random 5-20 coins
    user.balance += adBonus;

    res.json({
      success: true,
      keysEarned: task.reward,
      adBonus,
      newBalance: user.balance,
      totalKeys: user.totalKeys,
    });
  } catch (error) {
    console.error("Complete task error:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
});

/**
 * POST /api/tasks/:taskId/reset (for daily tasks)
 * Reset a daily task (admin only for testing)
 */
router.post("/:taskId/reset", authMiddleware, (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const taskKey = `${taskId}-${userId}`;
    userTasks.delete(taskKey);

    res.json({ success: true, message: "Task reset" });
  } catch (error) {
    console.error("Reset task error:", error);
    res.status(500).json({ error: "Failed to reset task" });
  }
});

export default router;
