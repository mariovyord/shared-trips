const User = require('../models/User');

// CHECK USER DATA PROPERTIES
exports.login = async (userData, session) => {
	const currentUser = await User.findOne({ email: userData.email.trim() });

	if (!currentUser) {
		throw new Error('Incorect username or password')
	}

	const isValid = await currentUser.comparePassword(userData.password);

	if (isValid) {
		session.user = {
			_id: currentUser._id,
			email: currentUser.email.trim(),
			password: currentUser.password.trim(),
			gender: currentUser.gender.trim(),
		}
		console.log('Sign in successful');
	} else {
		throw new Error('Invalid username or password')
	}
}

exports.register = async (userData, session) => {
	const currentUser = new User({
		email: userData.email.trim(),
		password: userData.password.trim(),
		gender: userData.gender.trim(),
	});
	await currentUser.save();

	session.user = {
		_id: currentUser._id,
		email: currentUser.email.trim(),
		password: currentUser.password.trim(),
		gender: currentUser.gender.trim(),
	}
	console.log('Sign up successful');
}
