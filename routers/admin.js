const express = require('express');
var router = express.Router();

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

module.exports = router;
