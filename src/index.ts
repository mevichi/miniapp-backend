import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./routes/auth";
import tasks from "./routes/tasks";
import withdraw from "./routes/withdraw";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/tasks", tasks);
app.use("/withdraw", withdraw);

app.get("/", (_, res) => {
  res.send("MBux-style backend running");
});

export default app;
