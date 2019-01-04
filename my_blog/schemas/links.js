var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	logo: String,
	name: String,
	desc: String,
	link: String
})