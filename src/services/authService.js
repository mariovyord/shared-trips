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
			email: currentUser.email,
			firstName: currentUser.first_name,
			lastName: currentUser.last_name,
		}
		console.log('Sign in successful');
	} else {
		throw new Error('Invalid username or password')
	}
}

exports.register = async (userData, session) => {
	const user = new User({
		email: userData.email.trim(),
		first_name: userData.first_name.trim(),
		last_name: userData.last_name.trim(),
		password: userData.password.trim(),
	});
	await user.save();

	session.user = {
		_id: user._id,
		email: user.email,
		firstName: user.first_name,
		lastName: user.last_name,
	}
	console.log('Sign up successful');
}
