var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {
		type: Boolean,
		default: false
	},
	addTime: String,
	avatar: String
})