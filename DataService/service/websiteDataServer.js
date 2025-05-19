let express = require('express')
let websiteTable = require('../db/WebsiteDB/index')
let websiteDataApp = express()
websiteDataApp.post('/setVisitorData',function (req,res) {
  let reqData = req.body
  if ((typeof reqData.rectangle)==='string'){
    let data = {
      ip:reqData.ip,
      visitTime:reqData.visitTime,
      province:reqData.province,
      city:reqData.city,
      location:reqData.rectangle.split(';')[0].split(',')
    };
    websiteTable.create(data).then(()=>{
      res.send({
        status:200,
        message:'有人来访问啦'
      })
    })
  }else {
    res.send({
      status:200,
      message:'境外ip不予记录'
    })
  }
})
websiteDataApp.get('/websiteData',async function (req,res) {
  let {limit,offset} = req.query
  let totalNum = 0
  await websiteTable.find({}).then(rs=>{
    totalNum = rs.length
  })
  websiteTable.find({}, {
    _id: false
  }, {
    skip: Number(offset),
    limit: Number(limit)
  }).then(rs=>{
    res.send({
      status:200,
      message:'查询成功',
      data:{
        websiteData:rs,
        totalNum
      }
    })
  })
})
module.exports = {websiteDataApp}
