import { Router, Request, Response } from "express";
import OpenAI from "openai";
import upload from "../middleware/upload";
import { User } from "../bd/user";
import { JWT_OPTIONS } from "../config/passport";
import passport from "passport";
const jwt = require("jsonwebtoken");

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string, // This is the default and can be omitted
});

export const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.json({ message: "Список пользователей" });
});

router.post(
	"/food",
	upload.single("image"),
	async (req: Request, res: Response) => {
		if (!req.file) {
			res.json({ message: "error, нет фото" });
			return;
		}

		const base64Image = req.file.buffer.toString("base64");

		const chatCompletion = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text: "Почситай килокаллории на фото, жду от тебя ответ в формате - ***, где * цифры, количество не имеет значения, главное точность, так же не пиши лишних символов, только количество в цифрах",
						},
						{
							type: "image_url",
							image_url: { url: `data:image/jpeg;base64,${base64Image}` },
						},
					],
				},
			],
			model: "gpt-4o",
			max_tokens: 200,
		});

		res.json({ data: chatCompletion.choices[0].message.content });
	}
);

router.get(
	"/calendar",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json("Protected Route");
	}
),
	router.post("/login", async (req: Request, res: Response, next: any) => {
		try {
			const data = await User.findOne({ username: req.body.email });

			if (data === null) {
				res.json({ error: "Incorrect email" });
				return;
			}

			if (req.body.password !== data.password) {
				res.json({ error: "Incorrect password" });
				return;
			}

			const payload = { email: req.body.email };

			const token = jwt.sign(payload, JWT_OPTIONS.secretOrKey, {
				expiresIn: "1d",
			});

			return res.json({ data: token });
		} catch (err) {
			console.error(err + " ---------- login error");
			res.json({ error: "Something wrong" });
		}
	});

// get login
// get data
// get calendar data
// post add food
