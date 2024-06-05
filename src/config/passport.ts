import { User } from "../bd/user";
const passport = require("passport");

const { Strategy, ExtractJwt } = require("passport-jwt");

export const JWT_OPTIONS = {
	secretOrKey: process.env.JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(
	JWT_OPTIONS,
	async (jwt_payload: any, cb: any) => {
		const user = await User.findOne({ username: jwt_payload.email });
		if (!user) return cb(null, false);
		return cb(null, user);
	}
);

passport.use(strategy);
