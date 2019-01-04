var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category'
	},
	title: String,
	content: {
		type: String,
		default: ''
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	addTime: String,
	views: {
		type: Number,
		default: 0
	},
	comments:{
		type: Array,
		default: []
	},
	coverImg: {
		type: String,
		default: 'defaultCover.jpg'
	},
	blogType: String,
	description: String,
	isTop: {
		type: Boolean,
		default: false
	}
})