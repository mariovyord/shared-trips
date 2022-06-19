const router = require('express').Router();
const { mapErrors } = require('../utils/mapErrors');
const { isUser } = require('../middleware/guardsMiddleware');
const { createPost, getAllPosts, getPostById, editPostById, deletePostById, joinTrip, getPostsByUserId } = require('../services/postsService');

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
		const posts = await getPostsByUserId(req.params.id);
		const isMale = req.session.user.gender == 'male';
		const numTrips = posts.length;
		res.render('profile', { title: 'Profile', posts, isMale, numTrips })
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

		if (req.session.user._id != post.creator._id) {
			throw new Error('Only owners can edit post');
		}

		res.render('trip-edit', { post, title: `Edit` })
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

		if (req.session.user._id != post.creator._id) {
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

		if (post.buddies.some(x => x._id == userId)) {
			post.hasJoined = true;
		}

		if (post.seats > 0) {
			post.hasSeats = true;
		}

		post.buddies = post?.buddies.map(x => x.email).join(', ');
		res.render('trip-details', { title: 'Details', post })
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});

// VOTE 
router.get('/join/:id', isUser(), async (req, res) => {
	try {
		await joinTrip(req.params.id, req.session.user._id);
		res.redirect('/posts/details/' + req.params.id);
	} catch (err) {
		const errors = mapErrors(err);
		res.render('404', { errors })
	}
});




module.exports = router;