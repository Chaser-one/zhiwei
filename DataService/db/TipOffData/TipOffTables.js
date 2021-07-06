let mongoose = require('mongoose')
let Schema = mongoose.Schema
let tipOffData = new Schema({
  blogId:{
    type:Number,
    required:true
  },
  title:{
    type:String,
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
  reason:{
    type:String,
    required:true
  }
})
const tipOffTables = mongoose.model('tipOffTables',tipOffData)
module.exports = tipOffTables
