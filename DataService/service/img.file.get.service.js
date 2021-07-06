let path = require('path')
let fs = require('fs')
let express = require('express')
let getImgFileApp = express()

getImgFileApp.get('/:imgName',function (req, res) {
  res.setHeader('Content-Type','image/*')
  fs.createReadStream(path.resolve(__dirname,`../storage/images/${req.params.imgName}`)).pipe(res)
})
module.exports = {
  getImgFileApp
}
