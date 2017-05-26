const mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
//模型类
module.exports = mongoose.model('User',usersSchema);
