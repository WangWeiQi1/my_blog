var mongoose = require('mongoose');

var linksSchema = require('../schemas/links.js');

module.exports = mongoose.model('Link',linksSchema);