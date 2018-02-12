const express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.get('/',function(req,res,next){
  res.render('main/login');
})

module.exports = router;
