let express = require('express')
let crypto = require('crypto')
let { v4 } = require('uuid')
let UserTables = require('../db/UserCountDB/userTables')
let UserDetailTables = require('../db/UserDetailDB/userDetailTables')
let BlogTables = require('../db/BlogDataDB/blogTable')
function enCryptData(data, key, algorithm) {
  if (!crypto.getHashes().includes(algorithm)) {
    throw new Error('不支持哈希函数')
  }
  const hmac = crypto.createHmac(algorithm, key)
  hmac.update(data)
  return hmac.digest('hex')
}
let authenticationApp = express()
authenticationApp.post('/registerUser', function (req, res) {
  let key = v4() //生成一个独一无二的key
  let password = enCryptData(req.body.password, key, 'sha256')
  let userName = req.body.userName
  let avatar = req.body.avatar
  let token = enCryptData(v4(), v4(), 'sha256') //生成一个随机令牌
  UserTables.find({
    userName: userName
  }).then(rs => {
    if (rs.length) {
      res.send({
        status: 500,
        message: '该用户名已被使用'
      })
    } else {
      UserTables.create({
        userName,
        password,
        key,
        token,
        avatar,
        isAdmin: false,
        introduction: '',
        approved: true,
        createTime: new Date()
      }).then(() => {
        res.setHeader('Authorization', token)
        res.send({
          status: 200,
        })
      })
      UserDetailTables.create({
        key,
        comments: [],
        articles: [],
        likes: [],
        attentions: [],
        blacklist: []
      })
    }
  })
})
authenticationApp.post('/loginUser', function (req, res) {
  if (req.body.userName === '游客') {
    return res.send({
      status: 500,
      message: '游客账号不允许登录'
    })
  }
  UserTables.find({
    userName: req.body.userName
  }).then(rs => {
    if (rs.length) {
      if (rs[0].password === enCryptData(req.body.password, rs[0].key, 'sha256')) {
        if (rs[0].approved) {
          res.setHeader("Authorization", rs[0].token)
          res.send({
            status: 200,
            message: '登录成功'
          })
        } else {
          res.send({
            status: 500,
            message: '该账号正在审核中'
          })
        }
      } else {
        res.send({
          status: 500,
          message: "用户密码错误"
        })
      }
    } else {
      res.send({
        status: 500,
        message: '用户不存在'
      })
    }
  })
})
authenticationApp.get('/checkPermission', async function (req, res) {
  let token = req.headers.authorization;
  let isVisitor = false;
  if (!token) {
    let data = await UserTables.findOne({
      userName: '游客'
    })
    if (data) {
      isVisitor = true;
      token = data.token;
    } else {
      res.send({
        status: 500,
        message: '游客账号不存在'
      })
    }
  }
  UserTables.find({
    token: token
  }).then(async rs => {
    if (rs.length && rs[0].approved) {
      let views = 0; //我的文章阅览数
      let likes = 0; //我的文章点赞数
      let userDetail = await UserDetailTables.findOne({
        key: rs[0].key
      }, {
        key: false,
        _id: false,
        __v: false
      })
      let blogList = await BlogTables.find({
        'author.userName': rs[0].userName
      })
      blogList.forEach(blogData => {
        views += blogData.views
        likes += blogData.likes
      })
      res.send({
        status: 200,
        message: isVisitor ? '游客模式' : '用户鉴权成功',
        data: {
          userData: {
            userName: rs[0].userName,
            avatar: rs[0].avatar,
            introduction: rs[0].introduction,
            isAdmin: rs[0].isAdmin,
            userDetail,
            views,
            likes
          }
        }
      })
    } else {
      res.send({
        status: 500,
        message: '用户鉴权失败'
      })
    }
  })
})
authenticationApp.post('/updateUserInfo', async function (req, res) {
  //查询用户表获取_id字段更新博客表和文章详情表
  let { _id, userName, key } = await UserTables.findOne({
    token: req.headers.authorization
  });
  if (req.body.avatar) {
    await Promise.all([
      UserTables.updateOne({
        _id: _id
      }, {
        $set: {
          avatar: req.body.avatar,
        }
      }),
      BlogTables.updateMany({
        'author.userName': userName
      }, {
        $set: {
          'author.avatar': req.body.avatar,
          'comment.$[i].userData.avatar': req.body.avatar,
          'comment.$[i].comment.$[j].userData.avatar': req.body.avatar
        }
      }, {
        arrayFilters: [
          { 'i.userData.userName': userName },
          { 'j.userData.userName': userName }
        ]
      }),
      UserDetailTables.updateOne({
        'key': key
      }, {
        $set: {
          'comments.$[i].blogData.author.avatar': req.body.avatar,
          'comments.$[i].commentData.$[j].userData.avatar': req.body.avatar
        }
      }, {
        arrayFilters: [
          { 'i.blogData.author.userName': userName },
          { 'j.userData.userName': userName }
        ]
      })
    ]);
  }
  if (req.body.userName) {
    let { avatar } = await UserTables.findOne({
      token: req.headers.authorization
    });
    await Promise.all([
      UserTables.updateOne({
        _id: _id
      }, {
        $set: {
          'userName': req.body.userName,
        }
      }),
      BlogTables.updateMany({
        'author.avatar': avatar
      }, {
        $set: {
          'author.userName': req.body.userName,
          'comment.$[i].userData.userName': req.body.userName,
          'comment.$[i].comment.$[j].userData.userName': req.body.userName
        }
      }, {
        arrayFilters: [
          { 'i.userData.avatar': avatar },
          { 'j.userData.avatar': avatar }
        ]
      }),
      UserDetailTables.updateOne({
        'key': key
      }, {
        $set: {
          'comments.$[i].blogData.author.userName': req.body.userName,
          'comments.$[i].commentData.$[j].userData.userName': req.body.userName
        }
      }, {
        arrayFilters: [
          { 'i.blogData.author.avatar': avatar },
          { 'j.userData.avatar': avatar }
        ]
      })
    ]);
  }
  if (req.body.introduction) {
    await UserTables.updateOne({
      token: req.headers.authorization
    }, {
      $set: {
        introduction: req.body.introduction,
      }
    })
  }
  res.send({
    status: 200,
    message: '用户信息更新成功'
  })
})
authenticationApp.get('/unapprovedUser', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    if (rs.length && rs[0].isAdmin) {
      let { offset, limit } = req.query; // 获取参数
      let userTotalNum = 0;
      await UserTables.find({
        approved: false
      }).then(unapprovedUsers => {
        userTotalNum = unapprovedUsers.length; // 获取未授权用户的总数
      })
      UserTables.find({
        approved: false
      }, {
        _id: false,
        __v: false
      }, {
        skip: Number(offset),
        limit: Number(limit)
      }).then(unapprovedUsers => {
        res.send({
          status: 200,
          message: '查询成功',
          data: {
            userTotalNum,
            userList: unapprovedUsers
          }
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
authenticationApp.get('/unAllUser', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async rs => {
    if (rs.length && rs[0].isAdmin) {
      let { offset, limit } = req.query
      let totalNum = 0
      await UserTables.find({
      }).then(unapprovedUsers => {
        totalNum = unapprovedUsers.length //未授权用户数
      })
      UserTables.find({

      }, {
        _id: false,
        __v: false
      }, {
        skip: Number(offset),
        limit: Number(limit),
        sort: {
          lastModified: -1
        }
      }).then(unapprovedUsers => {
        res.send({
          status: 200,
          message: '查询成功',
          data: {
            totalNum,
            userList: unapprovedUsers
          }
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
authenticationApp.post('/approvedUser', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async rs => {
    if (rs.length && rs[0].isAdmin) {
      UserTables.updateOne({
        key: req.body.key
      }, {
        $set: {
          approved: true
        }
      }).then(() => {
        res.send({
          status: 200,
          message: '批准用户注册'
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
authenticationApp.post('/unApprovedUser', function (req, res) {
  UserTables.find({
    token: req.headers.authorization,
  }).then(async rs => {
    if (rs.length && rs[0].isAdmin) {
      UserTables.updateOne({
        key: req.body.key
      }, {
        $set: {
          approved: false
        }
      }).then(() => {
        res.send({
          status: 200,
          message: '批准用户注册',
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
authenticationApp.post('/deleteUser', async function (req, res) {
  try {
    const adminList = await UserTables.find({ token: req.headers.authorization });
    if (!(adminList.length && adminList[0].isAdmin)) {
      return res.send({ status: 401, message: '没有操作权限' });
    }

    const userKey = req.body.key;
    if (!userKey) {
      return res.send({ status: 400, message: '缺少用户key参数' });
    }

    const userInfo = await UserTables.findOne({ key: userKey });
    console.log('deleteUser 查到的 userInfo:', userInfo);

    if (!userInfo) {
      return res.send({ status: 404, message: '未找到该用户' });
    }

    // 删除该用户的所有博客
    await BlogTables.deleteMany({ 'author.userName': userInfo.userName });
    console.log('删除用户的博客数据');

    // 删除用户详情
    await UserDetailTables.deleteOne({ key: userKey });
    console.log('删除用户的详细数据');

    // 删除用户主数据
    await UserTables.deleteOne({ key: userKey });
    console.log('删除用户的主数据');

    res.send({ status: 200, message: '删除用户成功' });
  } catch (err) {
    console.error('删除用户出错:', err);
    res.send({ status: 500, message: '服务器内部错误' });
  }
})
authenticationApp.post('/setAdmin', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then((rs) => {
    if (rs.length && rs[0].isAdmin) {
      UserTables.updateOne({
        key: req.body.key
      }, {
        $set: {
          isAdmin: true
        }
      }).then(userInfos => {
        res.send({
          status: 200,
          message: '更改用户权限成功'
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
authenticationApp.post('/cancelAdmin', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(rs => {
    if (rs.length && rs[0].isAdmin) {
      UserTables.updateOne({
        key: req.body.key
      }, {
        $set: {
          isAdmin: false
        }
      }).then(userInfos => {
        res.send({
          status: 200,
          message: '更改用户权限成功'
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
authenticationApp.get('/userRegisterInfo', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(rs => {
    if (rs.length && rs[0].isAdmin) {
      UserTables.find({}, {
        createTime: true
      }).then(userInfo => {
        res.send({
          status: 200,
          data: {
            userInfo
          }
        })
      })
    } else {
      res.send({
        status: 401,
        message: '没有操作权限'
      })
    }
  })
})
module.exports = {
  authenticationApp
}
