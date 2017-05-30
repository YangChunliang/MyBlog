const express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

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
  var limit = 5;//限制条数
  var pages;//总页数
  Category.count().then(function(count){//返回User实例的总条数
    //计算总页数
    pages = Math.ceil(count/limit);
    page = Math.min(page,pages);
    page = Math.max(page,1);
    //跳过的条数
    var skip = (page -1)*limit;

    Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories){
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

router.get('/content',function(req,res){

  var page = Number(req.query.page) || 1;//初始页
  var limit = 5;//限制条数
  var pages;//总页数
  Content.count().then(function(count){//返回User实例的总条数
    //计算总页数
    pages = Math.ceil(count/limit);
    page = Math.min(page,pages);
    page = Math.max(page,1);
    //跳过的条数
    var skip = (page -1)*limit;

    Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
      res.render('admin/content',{
        userInfo: req.userInfo,
        contents: contents,
        page: page,
        pages: pages
      });
    });
  })

});

router.get('/content/add',function(req,res){

  Category.find().sort({_id: -1}).then(function(categories){
    res.render('admin/add_content',{
      userInfo: req.userInfo,
      categories: categories
    });
  });

});

router.post('/content/add',function(req,res){

  if (req.body.category === '') {
    res.render('admin/error',{
        userInfo: req.userInfo,
        message: '内容分类不能为空'
    });
    return;
  }

  new Content({
    category: req.body.category,
    title: req.body.title,
    user:req.userInfo._id.toString(),
    description: req.body.description,
    content: req.body.content
  }).save().then(function(rs){
    res.render('admin/success',{
        userInfo: req.userInfo,
        message: '内容保存成功',
        url: '/admin/content'
    });
    return;
  });

});

router.get('/content/edit',function(req,res){

  var id = req.query.id || "";
  var categories = [];
  Category.find().then(function(rs){

    categories = rs;
    return Content.findOne({
      _id: id
    }).populate('category');
  }).then(function(content){

    if (!content) {
      res.render('admin/error',{
        userInfo: req.userInfo,
        message: '指定内容不存在！'
      })
    }else {
      res.render('admin/edit_content',{
        userInfo: req.userInfo,
        content: content,
        categories: categories
      })
    }
  });

});

router.post('/content/edit',function(req,res){
  var id = req.query.id || "";

  if (req.body.title === "") {
    res.render('admin/error',{
      userInfo: req.userInfo,
      message: '内容标题不能为空！'
    });
    return;
  }
  if (req.body.description === "") {
    res.render('admin/error',{
      userInfo: req.userInfo,
      message: '内容简介不能为空！'
    });
    return;
  }
  if (req.body.content === "") {
    res.render('admin/error',{
      userInfo: req.userInfo,
      message: '文章内容不能为空！'
    });
    return;
  }

  Content.update({
    _id:id
  },{
    category: req.body.category,
    title:req.body.title,
    description:req.body.description,
    content:req.body.content
  }).then(function(){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '内容修改成功！',
      url: '/admin/content'
    });
  });
});

router.get('/content/delete',function(req,res){
  var id = req.query.id || '';
  Content.remove({
    _id: id
  }).then(function(){
    res.render('admin/success',{
      userInfo: req.userInfo,
      message: '删除成功！',
      url: '/admin/content'
    });
  });
});

module.exports = router;
