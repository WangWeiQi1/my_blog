var mongoose = require('mongoose');

var blogsSchema = require('../schemas/blogs.js');

module.exports = mongoose.model('Blog',blogsSchema);