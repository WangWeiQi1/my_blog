var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	content: String,
	addTime: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	replies: []
})