let express = require('express')
let mongoose = require('mongoose')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let apiAddr = require('./config/PublicPath')
// let history = require('connect-history-api-fallback');

//连接数据库
mongoose.connect('mongodb://localhost:27017/blogDB',{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(()=>{
  console.log('数据库连接成功')
}).catch(()=>{
  console.log('数据库连接失败')
})

let app = express()
//启用中间件
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// app.use(history());

// app.use(history({
//   rewrites: [
//     {//访问路径含dist则继续访问
//       from: /^\/dist\/.*$/,
//       to: function(context) {
//         return context.parsedUrl.pathname;
//       }
//     },
//     {//后缀为js|css 访问dist下相应文件
//       from: /^\/.*[js|css]$/,
//       to: function(context) {
//         return '/dist/'+context.parsedUrl.pathname;
//       }
//     },
//     {//访问路径不含dist则默认访问/dist/index.html
//       from: /^\/.*$/,
//       to: function(context) {
//         return '/dist/';
//       }
//     },
//   ]
// }));

//处理跨域请求
app.all('*',function (req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-Width,Content-Type,Authorization');
  res.setHeader('Access-Control-Expose-Headers','Authorization');
  next()
})

//挂载应用
let {uploadImgFileApp} = require('./service/img.file.upload.service')
let {getImgFileApp} = require('./service/img.file.get.service')
let {authenticationApp} = require('./service/identifyAuthenticationService')
let {blogApp} = require('./service/blogDataservice')
let {userDetailApp} = require('./service/UserDetailService')
let {tipOffApp} = require('./service/TipOffService')
let {websiteDataApp} = require('./service/websiteDataServer')
//启用各种服务
app.use(apiAddr.uploadImgApiAddr,uploadImgFileApp)
app.use(apiAddr.getImgApiAddr,getImgFileApp)
app.use(apiAddr.authenticationApiAddr,authenticationApp)
app.use(apiAddr.blogApiAddr,blogApp)
app.use(apiAddr.userDetailApiAddr,userDetailApp)
app.use(apiAddr.tipOffApiAddr,tipOffApp)
app.use(apiAddr.websiteDataApiAddr,websiteDataApp)
app.listen(8888)

console.log('后端服务启动')

const WebSocket = require('ws')
const wss = new WebSocket.Server({port:12581})
let userList = []
wss.on('connection',function connection(user) {
  userList.push(user)//储存用户
  user.on('message',function incoming(message) {
    for (let i = 0,len=userList.length;i<len;i++){
      if (userList[i] !== user){
        userList[i].send(message)
      }
    }
  })
})
