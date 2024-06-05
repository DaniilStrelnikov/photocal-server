import { Router, Request, Response } from "express";
import OpenAI from "openai";
import upload from "../middleware/upload";
import { User } from "../bd/user";
import { JWT_OPTIONS } from "../config/passport";
import passport from "passport";
import { Food } from "../bd/food";
const jwt = require("jsonwebtoken");
import moment from "moment";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY as string, // This is the default and can be omitted
});

export const router = Router();

router.get("/", (req: Request, res: Response) => {
	res.json({ message: "Список пользователей" });
});

router.post(
	"/food",
	passport.authenticate("jwt", { session: false }),
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
							text: "Почситай килокаллории на фото, ты должен мне ответить такой строкой - (название еды максимум 30 символов||количество калорий), первый параметр строка, второй параметр число, ты обязан ответить только так, другие ответы я не понимаю, если нет еды тогда отправь мне просто слово error",
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

		let chatAnswer: any = chatCompletion.choices[0].message.content;
		let body;

		try {
			chatAnswer = chatAnswer.replace("(", "");
			chatAnswer = chatAnswer.replace(")", "");
			const name = chatAnswer.split("||")[0];
			const ccal = chatAnswer.split("||")[1];
			body = {
				name: name,
				ccal: ccal,
				image: base64Image,
				date: moment().unix(),
			};

			if (body.name === undefined || body.ccal === undefined) {
				res.json({ error: true });
				return;
			}

			const food = new Food({ ...body, user_id: (req.user as any)?._id });
			food.save();
		} catch (err) {
			console.error(err);
			res.json({ error: true });
		}

		res.json({ data: body });
	}
);

const compareDates = (date1: any, date2: any) =>
	moment.unix(date1).date() === moment.unix(date2).date() &&
	moment.unix(date1).month() === moment.unix(date2).month() &&
	moment.unix(date1).year() === moment.unix(date2).year();

//date-moment()
router.get(
	"/calendar",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const date: any = req.query.date;
		const foods = await Food.find({ user_id: (req.user as any)._id }).exec();

		(foods as any).map((el: any) => {
			const _date = {
				day: moment.unix(el.date).date(),
				month: moment.unix(el.date).month(),
				year: moment.unix(el.date).year(),
			};

			const _date2 = {
				day: moment.unix(date).date(),
				month: moment.unix(date).month(),
				year: moment.unix(date).year(),
			};
		});

		const filtered = date
			? foods.filter((el) => compareDates(el.date, date))
			: foods.map((el) => el.date);

		res.json({ data: filtered });
	}
);

//fields
//email - string
//password - string
router.post("/login", async (req: Request, res: Response) => {
	try {
		const data = await User.findOne({ username: req.body.email });
		const payload = { email: req.body.email };
		const token = jwt.sign(payload, JWT_OPTIONS.secretOrKey, {
			expiresIn: "1d",
		});

		if (data === null) {
			const newUser = new User({
				username: req.body.email,
				password: req.body.password,
			});

			const _res = await newUser.save();
			if (_res !== null) return res.json({ data: token });
		}

		if (req.body.password !== data?.password) {
			res.json({ error: "Incorrect password" });
			return;
		}

		return res.json({ data: token });
	} catch (err) {
		console.error(err + " ---------- login error");
		res.json({ error: "Something wrong" });
	}
});

// get data
// get calendar data
// post add food
