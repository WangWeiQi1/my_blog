var mongoose = require('mongoose');

var essaysSchema = require('../schemas/essays.js');

module.exports = mongoose.model('Essay',essaysSchema);