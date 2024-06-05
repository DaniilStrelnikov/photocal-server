import mongoose from "mongoose";

var FoodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	ccal: {
		type: Number,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	user_id: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
});

export const Food = mongoose.model("food", FoodSchema);
