const express = require('express');
var router = express.Router();
var User = require('../models/User');

//同意返回格式
var responseData;
router.use(function(req,res,next){
  responseData = {
    code:0,
    message:''
  }
  next();
});

//注册逻辑
/*
1,用户名不能为空
2,密码不能为空
3,两次输入密码必须一致

1,用户是否已经被注册了
2,
*/


router.post('/user/register',function(req,res,next){

  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.againpassword;

  //用户名是否为空
  if (!username) {
    responseData.code = 1;
    responseData.message = '用户名不能为空！';
    res.json(responseData);
    return;
  }
  //密码是否为空
  if (!password) {
    responseData.code = 2;
    responseData.message = '密码不能为空！';
    res.json(responseData);
    return;
  }
  //两次密码是否一致
  if (password !== repassword) {
    responseData.code = 3;
    responseData.message = '两次输入的密码不一致！';
    res.json(responseData);
    return;
  }

  User.findOne({
    username: username
  }).then(function(userInfo){
    if (userInfo) {
      //数据库中有该用户的信息
      responseData.code = 4;
      responseData.message = '该用户名已经被注册过了！';
      res.json(responseData);
      return;
    }
    //将该信息保存到数据库中
    var user = new User({
      username: username,
      password: password
    });
    return user.save();
  }).then(function(newUserInfo){
    responseData.message = '注册成功';
    res.json(responseData);
  });


});
//登录逻辑
router.post('/user/login',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;

  if (username == "" || password == "") {
    responseData.code = 1;
    responseData.message = "用户名不能为空!";
    res.json(responseData);
    return;
  }

  //查询数据库中相同用户名和密码的记录是否存在
  User.findOne({
      username: username,
      password: password
  }).then(function(userInfo){
    if (!userInfo) {
      responseData.code = 2;
      responseData.message = "用户名或密码错误!"
      res.json(responseData);
      return;
    }

    responseData.message = "登录成功!";
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    };
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }));
    res.json(responseData);
    return;
  })
})

router.get('/user/logout',function(req,res,next){
  req.cookies.set('userInfo',null);
  res.json(responseData);
  return;
})
module.exports = router;
