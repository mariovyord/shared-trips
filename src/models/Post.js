const { Schema, model, Types: { ObjectId } } = require('mongoose');

const postSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	keyword: {
		type: String,
		required: true,
	},
	location: {
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
	description: {
		type: String,
		required: true,
		minlength: 10,
	},
	author: {
		type: ObjectId,
		ref: 'User',
	},
});

const Post = model('Post', postSchema);

module.exports = Post;