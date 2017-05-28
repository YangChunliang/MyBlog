const express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');

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

router.get('/category',function(req,res){
  // 从数据库中读取数据

  var page = Number(req.query.page) || 1;//初始页
  var limit = 2;//限制条数
  var pages;//总页数
  Category.count().then(function(count){//返回User实例的总条数
    //计算总页数
    pages = Math.ceil(count/limit);
    page = Math.min(page,pages);
    page = Math.max(page,1);
    //跳过的条数
    var skip = (page -1)*limit;

    Category.find().limit(limit).skip(skip).then(function(categories){
      res.render('admin/category',{
        userInfo: req.userInfo,
        categories: categories,
        page: page,
        pages: pages
      });
    });
  })
});

router.get('/category/add',function(req,res){
  res.render('admin/add_category',{
    userInfo: req.userInfo
  });
});

router.post('/category/add',function(req,res){
  var name = req.body.name || '';
  if (name === '') {
    res.render('admin/error',{
      userInfo:req.userInfo,
      message: "分类名称不能为空!"
    });
    return;
  }
//数据库中是否已经存在同名的分类名称
  Category.findOne({
    name: name
  }).then(function(rs){
    if (rs) {
      res.render('admin/error',{
        userInfo:req.userInfo,
        message: "分类名称已经存在!"
      });
      return Promise.reject();
    }else{
      //数据库中不存在该分类，可以保存
      return new Category({
        name:name
      }).save();
    }
  }).then(function(newCategory){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: "分类保存成功",
      url: '/admin/category'
    });
  });
});

router.get('/category/edit',function(req,res){
  var id = req.query.id || "";
  Category.findOne({
    _id: id
  }).then(function(category){

    if (!category) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '分类信息不存在！'
      })
    }else {
      res.render('admin/edit_category',{
        userInfo: req.userInfo,
        category: category
      })
    }
  });
});

router.post('/category/edit',function(req,res){
  var id = req.query.id || "";
  var name = req.body.name || "";
  if (name === "") {
    res.render('admin/error',{
      userInfo: req.userInfo,
      message: '分类名称不能为空！'
    });
    return;
  }
  Category.findOne({
    _id: id
  }).then(function(category){

    if (!category) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '分类信息不存在！'
      });
      return Promise.reject();
    }else {
      if (name === category.name) {
        res.render('admin/success',{
          userInfo: req.userInfo,
          message: '修改成功！',
          url: '/admin/category'
        });
        return Promise.reject();
      }else {
        return Category.findOne({
          name: name
        });
      }
    }
  }).then(function(sameCategory){
    if (sameCategory) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '已经存在同名的分类！'
      });
      return Promise.reject();
    }else{
      return Category.update({
        _id: id
      },{
        name: name
      });
    }
  }).then(function(){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '修改成功！',
      url: '/admin/category'
    });
  });

});

router.get('/category/delete',function(req,res){
  var id = req.query.id || '';
  Category.remove({
    _id: id
  }).then(function(){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '删除成功！',
      url: '/admin/category'
    });
  });
});

module.exports = router;
