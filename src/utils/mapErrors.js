const mongoose = require('mongoose');

exports.mapErrors = (err) => {
	if (Array.isArray(err)) {
		return err;
	} else if (err instanceof mongoose.Error) {
		return Object.values(err.errors).map(e => ({ message: e.message }));
	} else if (typeof err === 'string') {
		return [{ message: err.message }];
	} else if (err.message) {
		return [{ message: err.message }]
	} else {
		return [{ message: 'Request error' }]
	}
}