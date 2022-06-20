const { register, login } = require('../services/authService');
const { mapErrors } = require('../utils/mapErrors');
const { isUser, isGuest } = require('../middleware/guardsMiddleware');
const { body, validationResult } = require('express-validator');

const router = require('express').Router();

// CHECK USER DATA PROPERTIES

// LOGIN
router.get('/login', isGuest(), (req, res) => {
	res.render('login', { title: 'Login' });
});

router.post('/login', isGuest(), async (req, res) => {
	try {
		await login(req.body, req.session);
		res.redirect('/');
	} catch (err) {
		const errors = mapErrors(err);
		const values = req.body;
		res.render('login', { errors, title: 'Login', values });
	}
});

// REGISTER
router.get('/register', isGuest(), (req, res) => {
	res.render('register', { title: 'Register' });
});

router.post('/register',
	isGuest(),
	body('email')
		.isEmail()
		.withMessage('Must be a valid email')
		.normalizeEmail(),
	body('password')
		.isLength({ min: 4 })
		.withMessage('Must be a valid password')
		.isAlphanumeric()
		.withMessage('Must be a valid password')
		.trim().escape(),
	body('gender').trim().escape(),
	async (req, res) => {
		try {

			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				const err = errors.errors.map(x => ({ message: x.msg }))
				throw err;
			}

			if (req.body.password.trim() == '') {
				throw new Error(`Password can't be empty`)
			}
			if (req.body.password != req.body['repass']) {
				throw new Error('Passwords should match')
			}
			console.log(req.body)
			await register(req.body, req.session);
			res.redirect('/');
		} catch (err) {
			const errors = mapErrors(err);
			const values = req.body;
			const isMale = req.body.gender == 'male';
			res.render('register', { errors, title: 'Register', values, isMale });
		}
	})

// LOGOUT
router.all('/logout', isUser(), (req, res) => {
	delete req.session.user;
	console.log('Logout successful');
	res.redirect('/');
});



module.exports = router;