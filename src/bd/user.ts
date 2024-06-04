import mongoose from "mongoose";

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

export const User = mongoose.model("user", UserSchema);
