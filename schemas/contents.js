const mongoose = require('mongoose');

//分类的表结构

module.exports = new mongoose.Schema({
  //关联字段-分类的ID
  category:{
    //类型
    type:mongoose.Schema.Types.ObjectId,
    //引用
    ref:'Category'
  },


  //内容标题
  title: String,

  //简介
  description:{
    type: String,
    default: ''
  },

  //内容
  content:{
    type: String,
    default: ''
  }
});
