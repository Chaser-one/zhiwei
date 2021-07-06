let express = require('express');
let siteApp = express();
let axios = require('axios');
let gaodeMapKey = '3e27a5cc09170b0205f9ca3dba95f860';

siteApp.use(express.static(`${__dirname}/site`));

siteApp.all('*', function (req, res, next){
  console.log('有人访问了哦');
  let visitorIP = '';
  if (req.ip.substr(0,7) === '::ffff:'){
    visitorIP = req.ip.substr(7);
  }
  axios.get('https://restapi.amap.com/v3/ip',{
    params: {
      key: gaodeMapKey,
      output: 'JSON',
      ip: visitorIP
    }
  }).then(rs => {
    axios.post('http://127.0.0.1:8888/api/v1/websiteData/setVisitorData', {
      ...rs.data,
      ip: visitorIP,
      visitTime: new Date()
    })
  })
  next();
})

console.log('网站运行中');
siteApp.listen(80)
