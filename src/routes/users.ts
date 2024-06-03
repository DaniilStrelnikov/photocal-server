import { Router, Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string, // This is the default and can be omitted
});

export const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.json({ message: "Список пользователей" });
});

router.get("/login", (req: Request, res: Response) => {});

router.get("/food", async (req: Request, res: Response) => {
	const chatCompletion = await openai.chat.completions.create({
		messages: [{ role: "user", content: "Say this is a test" }],
		model: "gpt-3.5-turbo",
	});

	res.json({ message: chatCompletion.choices[0].message });
});

// get login
// post register
// get data
// get calendar data
// post add food
