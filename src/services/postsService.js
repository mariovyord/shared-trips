// const User = require('../models/User');
const Post = require('../models/Post');

exports.createPost = async (data, authorId) => {
	console.log(data)
	const post = new Post({
		start: data.start.trim(),
		end: data.end.trim(),
		date: data.date.trim(),
		time: data.time.trim(),
		image: data.image.trim(),
		brand: data.brand.trim(),
		seats: Number(data.seats.trim()),
		price: Number(data.price.trim()),
		description: data.description.trim(),
		creator: authorId,
	});

	return post.save();
}

exports.getAllPosts = async () => {
	return Post.find({}).lean();
}

exports.getPostById = async (id) => {
	return Post.findById(id).populate('creator').lean();
}

exports.getPostsByUserId = async (userId) => {
	return Post.find({ creator: userId }).populate('creator').lean();
}

exports.editPostById = async (id, data, userId) => {
	const post = await Post.findById(id);

	if (post?.creator != userId) {
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

