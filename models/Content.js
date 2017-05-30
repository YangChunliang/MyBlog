const mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');
//模型类
module.exports = mongoose.model('Contents',contentsSchema);
