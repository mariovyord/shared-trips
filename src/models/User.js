const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// CHECK USER DATA PROPERTIES 
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+/.test(v);
			},
			message: props => `${props.value} is not a valid email`
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 4,
	},
	gender: {
		type: String,
		required: true,
		enum: {
			values: ['male', 'female'],
			message: 'Choose male or female'
		},
	},
	trips: {
		type: [mongoose.Types.ObjectId],
		ref: 'Post',
		default: [],
	}
})

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 10);
		console.log('Hashing new password');
	}
	next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;