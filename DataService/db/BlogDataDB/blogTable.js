let mongoose = require('mongoose')
let Schema = mongoose.Schema
let blogItem = new Schema({
  title:{
    type:String,
    required:true
  },
  tags:{
    type:Array,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  cover:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  comment:{
    type:Array,
    required:true
  },
  author:{
    type:Object,
    required:true
  },
  lastModified:{
    type:Date,
    required:true
  },
  views:{
    type:Number,
    required:true
  },
  likes:{
    type:Number,
    required:true
  },
  blogId:{
    type:Number,
    required:true
  },
  approved:{
    type:Boolean,
    required:true
  }
})
const blogTables = mongoose.model('blogTables',blogItem)
module.exports = blogTables
