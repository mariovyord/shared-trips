const { Schema, model, Types: { ObjectId } } = require('mongoose');

const postSchema = new Schema({
	start: {
		type: String,
		required: [true, 'Starting point is required'],
		minlength: [4, 'Starting point minimum length is 4 characters']
	},
	end: {
		type: String,
		required: true,
		minlength: [4, 'Ending point minimum length is 4 characters']
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
		validate: {
			validator: function (v) {
				return v.startsWith('http://') || v.startsWith('https://');
			},
			message: 'Image URL should be a valid link'
		},
	},
	brand: {
		type: String,
		required: true,
		minlength: [4, 'Brand minimum length is 4 characters']
	},
	seats: {
		type: Number,
		required: true,
		min: [0, 'Minimum number of seats is 0'],
		max: [4, 'Maximum number of seats is 0'],
	},
	price: {
		type: Number,
		required: true,
		min: [1, 'Minimum number of seats is 1'],
		max: [50, 'Maximum number of seats is 50'],
	},
	description: {
		type: String,
		required: true,
		minlength: [10, 'Description minimum length is 10 characters']
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