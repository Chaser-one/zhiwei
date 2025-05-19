let mongoose = require('mongoose')
let Schema = mongoose.Schema
let userDetail = new Schema({
  key:{
    type:String,
    required:true
  },
  articles:{
    type:Array,
    required:true
  },
  comments:{
    type:Array
  },
  likes:{
    type:Array,
  },
  attentions:{
    type:Array
  },
  blacklist:{
    type:Array
  }
})
const userDetailTables = mongoose.model('userDetailTables',userDetail)
module.exports = userDetailTables
