var mongoose = require('mongoose');

var messagesSchema = require('../schemas/messages.js');

module.exports = mongoose.model('Message',messagesSchema);