<template>
  <div class="chat_box">
    <el-page-header style="height: 24px" @back="goBack"></el-page-header>
    <div class="chat-wrapper" :style="{background:'url('+src+')100% 100% no-repeat'}">
      <div class="content-area" ref="contentArea">
        <div
            v-for="(msgItem,index) in msgList"
            :key="index"
            class="msg-item"
        >
          <div :style="{float:msgItem.type==='other'?'left':'right'}">
            <div
                :style="{
                float:msgItem.type==='other'?'left':'right',
                margin:'30px',
                textAlign:'center'
          }"
            >
              <el-avatar :size="40" :src="msgItem.avatar" style="display: block"></el-avatar>
              <span style="font-size: 12px">{{ msgItem.userName }}</span>
            </div>
            <el-card
                class="box-card"
                style="margin: 23px 10px"
                :style="{float:msgItem.type==='other'?'left':'right'}"
            >
              <span v-if="msgItem.msg.type==='text'">{{ msgItem.msg.content }}</span>
              <el-image v-else :src="msgItem.msg.content"></el-image>
            </el-card>
          </div>
        </div>
      </div>
      <div class="tool-bar">
        <el-row style="height: 100%">
          <el-col :span="22">
            <el-input v-model="msgText" @keypress.enter.native="sendText"></el-input>
          </el-col>
          <el-col :span="1" style="display: flex;justify-content: center;align-items: center;height: 100%">
            <i class="el-icon-picture-outline" @click="sendText" style="font-size: 25px;position: relative">
              <input
                  @change="sendImg"
                  type="file"
                  ref="selectImg"
                  style="position: absolute;z-index: 10;top: 0;left: 0;width: 100%;opacity: 0"
              >
            </i>
          </el-col>
          <el-col :span="1"
                  style="display: flex;justify-content: center;align-items: center;height: 100%;cursor: pointer">
            <i class="el-icon-s-promotion" @click="sendText" style="font-size: 25px;color: #3a8ee6"></i>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>


</template>

<script>
import url1 from '../assets/chat_bg.png'
import defaultConfig from '@/config/config.default'
import {io} from "socket.io-client";

async function cutImageBase64(files, width, quality) {
  return new Promise(resolve => {
    const file = files[0]
    let URL = window.URL || window.webkitURL
    const blog = URL.createObjectURL(file)
    let base64
    const img = new Image()
    img.src = blog
    img.onload = function () {
      const that = this
      let w = that.width
      let h = that.height
      let scale = w / h
      w = width || w
      h = w / scale;
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = w / 4
      canvas.height = h / 4
      ctx.drawImage(that, 0, 0, w / 4, h / 4)
      base64 = canvas.toDataURL('image/jpeg', 1)
      resolve(base64)
    }
  })
}

export default {
  name: "ChatHome",
  data() {
    return {
      socket: null,
      msgText: '',
      src: url1,
      message: {
        userName: '',
        avatar: '',
        msg: {
          type: '',
          content: ''
        }
      },
      userData: JSON.parse(sessionStorage.getItem('userData')),
      msgList: []
    }
  },
  watch: {
    userData: {
      handler() {
        this.message.userName = this.userData.userName
        this.message.avatar = this.userData.avatar
      },
      immediate: true
    },
    'socket.readyState': {
      handler(e) {
        console.log(this.socket)
      },
      immediate: true
    }
  },
  mounted() {
    debugger
    const self = this;
    // this.socket = new WebSocket(`${defaultConfig.wssApiUrl}`)
    // this.socket.addEventListener('open', () => {
    //   this.$message.success('加入聊天室')
    // })
    // this.socket.addEventListener('message', (event) => {
    //   this.msgList.push({
    //     ...JSON.parse(event.data),
    //     type: 'other'
    //   })
    //   this.$nextTick(() => {
    //     this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
    //   })
    // })
    this.socket = io(defaultConfig.wssApiUrl);
    // this.socket.addEventListener('open', () => {
    //   this.$message.success('加入聊天室')
    // })
    this.socket.on('chat message', (event) => {
      self.msgList.push({
        ...JSON.parse(JSON.stringify(event)),
        type: 'other'
      })
      this.$nextTick(() => {
        this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
      })
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    sendImg() {
      cutImageBase64(this.$refs.selectImg.files, 400, 0.6).then(rs => {
        this.message.msg.type = 'img'
        this.message.msg.content = rs
        // this.socket.send(JSON.stringify(this.message));
        this.socket.emit('chat message',this.message)
        this.msgList.push({
          ...JSON.parse(JSON.stringify(this.message)),
          type: 'me'
        })
        this.message.msg.type = ''
        this.message.msg.content = ''
        this.$nextTick(() => {
          this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
        })
      })
    },
    sendText() {
      if (this.msgText) {
        this.message.msg.type = 'text'
        this.message.msg.content = this.msgText
        // this.socket.send(JSON.stringify(this.message))
        this.socket.emit('chat message',this.message)
        this.msgText = ''
        this.msgList.push({
          ...JSON.parse(JSON.stringify(this.message)),
          type: 'me'
        })
        this.message.msg.type = ''
        this.message.msg.content = ''
        this.$nextTick(() => {
          this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
        })
      }
    }
  }
}

</script>

<style>
.chat_box {
  width: 100%;
  height: 100%;
}

canvas {
  transform: scale(0.4);
  transform-origin: 0 0;
}

.chat-wrapper {
  position: relative;
  width: 100%;
  height: calc(100% - 24px);
  overflow-x: hidden;
}

.content-area {
  width: 100%;
  height: calc(100% - 50px);
  overflow: auto;
}


.tool-bar {
  margin: 5px 10px;
  height: 40px;
  width: calc(100% - 20px);
  z-index: 2;
}

.msg-item {
  margin-bottom: 20px;
}

.msg-item::after {
  content: '';
  display: block;
  clear: both;
}

</style>
