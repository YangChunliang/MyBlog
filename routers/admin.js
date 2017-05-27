const express = require('express');
var router = express.Router();
var User = require('../models/User');

router.use(function(req,res,next){
  if (!req.userInfo.isAdmin) {
    res.send('对不起，只有管理员可以进入');
    return;
  }
  next();
});

router.get('/',function(req,res,next){
  res.render('admin/index',{
    userInfo: req.userInfo
  });
})

router.get('/user',function(req,res,next){
  // 从数据库中读取数据

  var page = Number(req.query.page) || 1;//初始页
  var limit = 2;//限制条数
  var pages;//总页数
  User.count().then(function(count){//返回User实例的总条数
    //计算总页数
    pages = Math.ceil(count/limit);
    page = Math.min(page,pages);
    page = Math.max(page,1);
    //跳过的条数
    var skip = (page -1)*limit;

    User.find().limit(limit).skip(skip).then(function(users){
      res.render('admin/user_index',{
        userInfo: req.userInfo,
        users: users,
        page: page,
        pages: pages
      });
    });
  })

})

module.exports = router;
