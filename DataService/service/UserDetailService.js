let express = require('express');
let UserTables = require('../db/UserCountDB/userTables');
let UserDetailTables = require('../db/UserDetailDB/userDetailTables');
let BlogTables = require('../db/BlogDataDB/blogTable');

let userDetailApp = express();

userDetailApp.post('/likes', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    await BlogTables.updateOne({
      blogId: req.body.blogId
    }, {
      $inc: {
        likes: 1
      }
    }).then(() => {
      console.log('有人给博客点赞');
    })

    UserDetailTables.updateOne({
      key: rs[0].key
    }, {
      $push: {
        likes: req.body.blogId
      }
    }).then(() => {
      res.send({
        status: 200,
        message: '点赞成功'
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '点赞失败'
      })
    })
  })
})

userDetailApp.delete('/likes/:id', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    await BlogTables.updateOne({
      blogId: Number(req.params.id)
    }, {
      $inc: {
        likes: -1
      }
    }).then(() => {
      console.log('有人给博客取消点赞');
    })

    UserDetailTables.updateOne({
      key: rs[0].key
    }, {
      $pull: {
        likes: Number(req.params.id)
      }
    }).then(() => {
      res.send({
        status: 200,
        message: '取消点赞成功'
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '取消点赞失败'
      })
    })
  })
})

userDetailApp.post('/attention', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    UserDetailTables.updateOne({
      key: rs[0].key
    }, {
      $push: {
        attentions: req.body.userName
      }
    }).then(() => {
      res.send({
        status: 200,
        message: '关注成功'
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '关注失败'
      })
    })
  })
})

userDetailApp.delete('/attention/:userName', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    UserDetailTables.updateOne({
      key: rs[0].key
    }, {
      $pull: {
        attentions: req.params.userName
      }
    }).then(() => {
      res.send({
        status: 200,
        message: '取消关注成功'
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '取消关注失败'
      })
    })
  })
})

userDetailApp.post('/blacklist', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    UserDetailTables.updateOne({
      key: rs[0].key
    }, {
      $push: {
        blacklist: req.body.userName
      }
    }).then(() => {
      res.send({
        status: 200,
        message: '关注成功'
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '关注失败'
      })
    })
  })
})

userDetailApp.delete('/blacklist/:userName', function (req, res) {
  UserTables.find({
    token: req.headers.authorization
  }).then(async (rs) => {
    UserDetailTables.updateOne({
      key: rs[0].key
    }, {
      $pull: {
        blacklist: req.params.userName
      }
    }).then(() => {
      res.send({
        status: 200,
        message: '取消关注成功'
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '取消关注失败'
      })
    })
  })
})

userDetailApp.get('/comment', function (req, res) {
  let {offset, limit} = req.query; // 获取查询参数
  UserTables.find({
    token: req.headers.authorization
  }).then((rs) => {
    UserDetailTables.find({
      key: rs[0].key
    }).then((comments) => {
      console.log(offset, limit)
      let commentList = comments[0].comments.slice(offset, offset + limit);
      res.send({
        status: 200,
        message: '获取个人评论成功',
        data: {
          commentList,
          totalNum: comments[0].comments.length
        }
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '获取个人评论失败'
      })
    })
  })
})

userDetailApp.get('/attention', function (req, res) {
  let {offset, limit} = req.query; // 获取查询参数
  UserTables.find({
    token: req.headers.authorization
  }).then((rs) => {
    UserDetailTables.find({
      key: rs[0].key
    }).then((attentions) => {
      let attentionList = attentions[0].attentions.slice(offset, offset + limit);
      UserTables.find({
        userName: {
          $in: attentionList
        }
      }, {
        userName: true,
        avatar: true,
        introduction: true
      }).then(rs => {
        res.send({
          status: 200,
          message: '获取个人关注成功',
          data: {
            attentionList: rs,
            totalNum: attentions[0].attentions.length
          }
        })
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '获取个人关注失败'
      })
    })
  })
})

userDetailApp.get('/blacklist', function (req, res) {
  let {offset, limit} = req.query; // 获取查询参数
  UserTables.find({
    token: req.headers.authorization
  }).then((rs) => {
    UserDetailTables.find({
      key: rs[0].key
    }).then((blacklists) => {
      let blacklist = blacklists[0].blacklist.slice(offset, offset + limit);
      UserTables.find({
        userName: {
          $in: blacklist
        }
      }, {
        userName: true,
        avatar: true,
        introduction: true
      }).then(rs => {
        res.send({
          status: 200,
          message: '获取个人黑名单成功',
          data: {
            blacklist: rs,
            totalNum: blacklists[0].blacklist.length
          }
        })
      })
    }).catch(err => {
      res.send({
        status: 500,
        message: '获取个人黑名单失败'
      })
    })
  })
})
module.exports = {
  userDetailApp
}
