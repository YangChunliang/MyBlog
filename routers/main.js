const express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

router.get('/',function(req,res,next){
  var data = {
    userInfo: req.userInfo,
    category: req.query.category,
    categories: [],
    count:0,
    page:Number(req.query.page) || 1,//初始页
    limit:4,//限制条数
    pages:0//总页数
  }

  //读取所有的分类信息
  var where = {};
  if (data.category) {
    where.category = data.category;
  }

  Category.find().then(function(categories){

    data.categories = categories;
    return Content.where(where).count();
  }).then(function(count){
    data.count = count;
    //计算总页数
    data.pages = Math.ceil(data.count/data.limit);
    data.page = Math.min(data.page,data.pages);
    data.page = Math.max(data.page,1);
    //跳过的条数
    var skip = (data.page -1)*data.limit;
    return Content.where(where).find().sort({  addTime: -1  }).limit(data.limit).skip(skip).populate(['category','user']);
  }).then(function(contents){
    data.contents = contents;
    res.render('main/index',data);
  });

});

module.exports = router;
