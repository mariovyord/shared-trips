const router = require('express').Router();
const { mapErrors } = require('../utils/mapErrors');
const { isUser } = require('../middleware/guardsMiddleware');
const { createPost, getAllPosts, getPostById, editPostById, deletePostById, upvote, downvote, getPostsByUserId } = require('../services/postsService');

// ALL POSTS PAGE
router.get('/', async (req, res) => {
	try {
		const posts = await getAllPosts();
		res.render('shared-trips', { posts, title: 'Shared Trips' });
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
})

// TODO USER PROFILE
router.get('/user/:id', isUser(), async (req, res) => {
	console.log('here')
	try {
		// const posts = await getPostsByUserId(req.params.id);
		res.render('profile', { title: 'Profile' })
	} catch (err) {
		const errors = mapErrors(err);
		console.log('errors', err)
		res.render('404', { errors, title: '404' });
	}
})

// CREATE NEW POST
router.get('/create', isUser(), (req, res) => {
	res.render('trip-create', { title: 'Create Trip' })
});

router.post('/create', isUser(), async (req, res) => {
	try {
		await createPost(req.body, req.session.user._id);
		res.redirect('/posts')
	} catch (err) {
		const errors = mapErrors(err);
		res.render('create', { errors, values: req.body })
	}
});

// EDIT POST IF OWNER
router.get('/edit/:id', isUser(), async (req, res) => {
	try {
		const post = await getPostById(req.params.id);

		if (req.session.user._id != post.author._id) {
			throw new Error('Only owners can edit post');
		}

		res.render('edit', { post, title: `Edit: ${post.title}` })
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});

router.post('/edit/:id', isUser(), async (req, res) => {
	try {
		await editPostById(req.params.id, req.body, req.session.user._id);
		res.redirect('/posts/details/' + req.params.id);
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});

// DELETE POST IF OWNER
router.get('/delete/:id', isUser(), async (req, res) => {
	try {
		const post = await getPostById(req.params.id);

		if (req.session.user._id != post.author._id) {
			throw new Error('Only owners can delete posts')
		}

		await deletePostById(req.params.id);
		res.redirect('/posts');
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});

// SHOW POST DETAILS
router.get('/details/:id', async (req, res) => {
	try {
		const post = await getPostById(req.params.id);
		const userId = req.session?.user?._id;

		if (userId == post.creator._id) {
			res.locals.isOwner = true;
		}

		res.render('trip-details', { title: 'Details', post })
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});

// VOTE 
router.get('/vote-up/:id', isUser(), async (req, res) => {
	try {
		await upvote(req.params.id, req.session.user._id);
		res.redirect('/posts/details/' + req.params.id);
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});

router.get('/vote-down/:id', isUser(), async (req, res) => {
	try {
		await downvote(req.params.id, req.session.user._id);
		res.redirect('/posts/details/' + req.params.id);
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});



module.exports = router;