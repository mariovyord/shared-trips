// const User = require('../models/User');
const Post = require('../models/Post');

exports.createPost = async (data, authorId) => {
	const post = new Post({
		title: data.title.trim(),
		keyword: data.keyword.trim(),
		location: data.location.trim(),
		creation_date: data.creation_date.trim(),
		image: data.image.trim(),
		description: data.description.trim(),
		author: authorId,
	});

	return post.save();
}

exports.getAllPosts = async () => {
	return Post.find({}).lean();
}

exports.getPostById = async (id) => {
	return Post.findById(id).populate('author').populate('votes').lean();
}

exports.getPostsByUserId = async (userId) => {
	return Post.find({ author: userId }).populate('author').lean();
}

exports.editPostById = async (id, data, userId) => {
	const post = await Post.findById(id);

	if (post.author != userId) {
		throw new Error('Only owners can edit post')
	}

	post.title = data.title.trim();
	post.keyword = data.keyword.trim();
	post.location = data.location.trim();
	post.creation_date = data.creation_date.trim();
	post.image = data.image.trim();
	post.description = data.description.trim();

	return post.save();
}

exports.deletePostById = async (id) => {
	return Post.findByIdAndDelete(id);
}

exports.upvote = async (id, userId) => {
	const post = await Post.findById(id);
	if (post.votes.includes(userId)) {
		throw new Error('User has already voted');
	}
	post.rating = post.rating + 1;
	post.votes.push(userId);
	post.save();
}

exports.downvote = async (id, userId) => {
	const post = await Post.findById(id);
	if (post.votes.includes(userId)) {
		throw new Error('User has already voted');
	}
	post.rating = post.rating - 1;
	post.votes.push(userId);
	post.save();
}
