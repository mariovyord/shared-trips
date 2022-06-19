exports.isUser = () => (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/');
	}
}

exports.isGuest = () => (req, res, next) => {
	if (req.session.user) {
		res.redirect('/');
	} else {
		next();
	}
}