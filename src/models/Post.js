const { Schema, model, Types: { ObjectId } } = require('mongoose');

const postSchema = new Schema({
	start: {
		type: String,
		required: true,
	},
	end: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	brand: {
		type: String,
		required: true,
	},
	seats: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	creator: {
		type: ObjectId,
		ref: 'User',
	},
	buddies: {
		type: [ObjectId],
		ref: 'User',
		default: [],
	},

});

const Post = model('Post', postSchema);

module.exports = Post;