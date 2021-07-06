<template>
  <div>
    <el-page-header @back="goBack" style="position: fixed"></el-page-header>
    <div class="chat-wrapper">
      <div class="content-area" ref="contentArea">
        <el-image :src="src" style="width: 100%;height:calc(100vh - 24px);z-index: -100;position: fixed"></el-image>
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
              <span style="font-size: 12px">{{msgItem.userName}}</span>
            </div>
            <el-card
                class="box-card"
                style="margin: 0 10px"
                :style="{float:msgItem.type==='other'?'left':'right'}"
            >
              <span v-if="msgItem.msg.type==='text'">{{msgItem.msg.content}}</span>
              <el-image v-else :src="msgItem.msg.content"></el-image>
            </el-card>
          </div>
        </div>
      </div>
      <div class="tool-bar">
        <el-row style="text-align: center">
          <el-col :span="2">
            <div class="select-img" style="width: 100%;text-align: center">
              <i class="el-icon-picture-outline" style="font-size: 25px"></i>
              <input
                  @change="sendImg"
                  type="file"
                  ref="selectImg"
                  style="position: absolute;z-index: 10;top: 0;left: 0;opacity: 0"
              >
            </div>
          </el-col>
          <el-col :span="20">
            <el-input v-model="msgText" @keypress.enter.native="sendText"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="text" icon="el-icon-s-promotion" @click="sendText" style="transform: scale(2)"></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>


</template>

<script>
import url1 from '../assets/1.jpg'
import defaultConfig from '@/config/config.default'
async function cutImageBase64(files,width,quality) {
  return new Promise(resolve => {
    const file = files[0]
    let URL = window.URL || window.webkitURL
    const blog = URL.createObjectURL(file)
    console.log(blog);
    let base64
    const img = new Image()
    img.src = blog
    img.onload = function () {
      const that =this
      let w = that.width
      let h = that.height
      let scale = w/h
      w = width||w
      h = w/scale;
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = w/4
      canvas.height = h/4
      ctx.drawImage(that,0,0,w/4,h/4)
      base64 = canvas.toDataURL('image/jpeg',1)
      resolve(base64)
    }
  })
}
export default {
  name: "ChatHome",
  data(){
    return{
      socket:null,
      msgText:'',
      src:url1,
      message:{
        userName:'',
        avatar:'',
        msg:{
          type:'',
          content:''
        }
      },
      userData:JSON.parse(sessionStorage.getItem('userData')),
      msgList:[]
    }
  },
  watch:{
    userData:{
      handler(){
        this.message.userName = this.userData.userName
        this.message.avatar = this.userData.avatar
      },
      immediate:true
    }
  },
  mounted() {
    this.socket = new WebSocket(`${defaultConfig.wssApiUrl}`)
    this.socket.addEventListener('open',()=>{
      this.$message.success('加入聊天室')
    })
    this.socket.addEventListener('message',(event) => {
      this.msgList.push({
        ...JSON.parse(event.data),
        type:'other'
      })
      this.$nextTick(()=>{
        this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
      })
    })
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
    sendImg(){
      console.log(this.$refs.selectImg.files)
      cutImageBase64(this.$refs.selectImg.files,400,0.6).then(rs => {
        this.message.msg.type = 'img'
        this.message.msg.content = rs
        this.socket.send(JSON.stringify(this.message))
        this.msgList.push({
          ...JSON.parse(JSON.stringify(this.message)),
          type:'me'
        })
        this.message.msg.type = ''
        this.message.msg.content = ''
        this.$nextTick(()=>{
          this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
        })
      })
    },
    sendText(){
      if (this.msgText){
        this.message.msg.type = 'text'
        this.message.msg.content = this.msgText
        this.socket.send(JSON.stringify(this.message))
        this.msgText = ''
        this.msgList.push({
          ...JSON.parse(JSON.stringify(this.message)),
          type:'me'
        })
        this.message.msg.type = ''
        this.message.msg.content = ''
        this.$nextTick(()=>{
          this.$refs.contentArea.scrollTop = this.$refs.contentArea.scrollHeight
        })
      }
    }
  }
}

</script>

<style>
body {
  margin: 0;
}
canvas{
  transform: scale(0.4);
}
.chat-wrapper {
  position: relative;
  top: 24px;
  width: 100vw;
  height: calc(100vh - 24px);
  overflow-x: hidden;
}

.content-area {
  width: 100vw;
  height: calc(100vh - 64px);
}

.select-img {
  position: relative;
  line-height: 40px;
  overflow: hidden;
}

.tool-bar {
  position: fixed;
  box-sizing: border-box;
  bottom: 10px;
  left: 0;
  height: 40px;
  width: 100%;
}
.msg-item{
  margin-bottom: 20px;
}
.msg-item::after{
  content: '';
  display: block;
  clear: both;
}

</style>
