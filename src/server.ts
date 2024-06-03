import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express, { Application } from "express";
import { connectDB } from "./config/db";
import router from "./routes";
import { router as userRouter } from "./routes/users";

// Подключение к базе данных
// connectDB();

const app: Application = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api", router);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
