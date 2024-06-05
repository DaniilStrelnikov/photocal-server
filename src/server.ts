import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express, { Application } from "express";
import { connectDB } from "./config/db";
import cors from "cors";

import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { router } from "./routes";

var passport = require("passport");

const app: Application = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "SECRET" }));

// Passport:
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport.ts");

// Routes
app.use("/api", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
