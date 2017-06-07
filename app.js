const express = require('express');

//加载模板
const swig = require('swig');

//加载数据库模块
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const Cookies = require('cookies');

var app = express();

var User = require('./models/User');

//设置静态文件托管
//当用户访问的url一'/public'开始，那么直接返回对应的__dirname+'public'下的文件
app.use('/public',express.static(__dirname + '/public'));

//配置应用模板（模板默认使用缓存）
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀
//第二个参数：表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views,第二个参数时目录的路径
app.set('views','./views');
//注册模板所使用的引擎，第一个参数必须是view engine
//第二个参数和上方模板引擎名称一致
app.set('view engine','html');

//实际开发，取消模板缓存
swig.setDefaults({cache:false});

//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
  req.cookies = new Cookies(req,res);

  req.userInfo = {};
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
      User.findById(req.userInfo._id).then(function(userInfo){
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
        next();
      });
    } catch (e) {}
  }else {
    next();
  }
});

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://139.199.14.15:27017/blog',function(err){
  if (err) {
    console.log("server connect defeat");
  }else {
    console.log("server connect success")
  }
});

app.listen(8080);
console.log("server run on port 8080...");
//用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则
//-> 执行指定的函数，返回对应内容至用户
//public -> 静态 -> 直接读取知道你个目录下的文件返回给用户
//动态 -> 处理业务逻辑啊，加载模板，解析模板 -> 返回数据给用户
