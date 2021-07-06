<template>
  <div>
    <el-page-header
        @back="goBack"
        :content="blogData.title"
    >
    </el-page-header>
    <el-card class="box-card" style="margin-top: 20px">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="2">
            <el-avatar
                :src="blogData.author.avatar"
                size="large"
            >
            </el-avatar>
          </el-col>
          <el-col :span="6">
            <span>{{ blogData.author.userName }}</span>
            <br>
            <span>{{ blogData.lastModified | transformTime }}</span>
          </el-col>
          <el-col :span="8" :offset="8">
            <el-button type="warning"
                       :icon="userData.userDetail.likes.includes(blogId)?'el-icon-star-on':'el-icon-star-off'"
                       circle
                       @click="switchLike"
            ></el-button>
            <el-button
                type="primary"
                :icon="userData.userDetail.attentions.includes(blogData.author.userName)?'el-icon-check':'el-icon-plus'"
                v-if="!(blogData.author.userName === userData.userName)"
                @click="switchAttentions"
            >关注
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-s-custom"
                v-if="!(blogData.author.userName===userData.userName)"
                @click="switchBlackList"
            >
              {{ userData.userDetail.blacklist.includes(blogData.author.userName) ? '已拉黑' : '拉黑' }}
            </el-button>
            <el-button type="danger" icon="el-icon-thumb" @click="switchTipOff">举报</el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <div v-html="blogData.content"></div>
        <div style="margin-top: 20px">
          <el-tag type="success" v-for="(tag,index) in blogData.tags" :key="index" style="margin-right: 20px">
            {{ tag }}
          </el-tag>
        </div>
        <div style="margin-top: 20px">
          <el-row>
            <el-col :span="1"><i class="el-icon-star-on"></i>{{ blogData.likes }}</el-col>
            <el-col :span="1"><i class="el-icon-view"></i>{{ blogData.views }}</el-col>
            <el-col :span="1"><i class="el-icon-s-comment"></i>{{ blogData.comment.length }}</el-col>
          </el-row>
        </div>
      </div>
      <el-divider><i class="el-icon-s-comment"></i></el-divider>
      <GlobalComment
        :blog-id="blogId"
        :comment="blogData.comment"
      ></GlobalComment>
    </el-card>
    <el-dialog
        title="举报文章"
        :visible.sync="isShowTipOff"
        width="30%"
        >
      <el-input v-model="tipOffReason" placeholder="请输入举报原因" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowTipOff = false">取 消</el-button>
        <el-button type="primary" @click="switchTipOff">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BlogService from "@/service/BlogService"
import UserDetailService from "@/service/UserDetailService"
import GlobalComment from '@/components/Global-Comment'
import TipOffService from "@/service/TipOffService"
export default {
  name: "Article-Detail",
  components:{
    GlobalComment
  },
  data() {
    return {
      blogId: '',
      blogData: {
        title: '',
        author: {
          userName: '',
          avatar: ''
        },
        description: '',
        comment: [],
        cover: '',
        views: 0,
        likes: 0,
        lastModified: '',
        tags: []
      },
      userData: JSON.parse(sessionStorage.getItem('userData')),
      tipOffReason: '',
      isShowTipOff: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    switchTipOff(){
      this.isShowTipOff = !this.isShowTipOff
      if (!this.isShowTipOff){
        const data = {
          blogId:this.blogId,
          description:this.blogData.description,
          cover:this.blogData.cover,
          title:this.blogData.title,
          reason:this.tipOffReason
        };
        TipOffService.tipBlog(data).then(()=>{
          this.$message.success('举报成功')
        })
      }
    },
    switchBlackList(){
      if (this.userData.userDetail.blacklist.includes(this.blogData.author.userName)){
        //修改本地sessionStorage数据
        let temData = JSON.parse(sessionStorage.getItem('userData'))
        temData.userDetail.blacklist.splice(temData.userDetail.blacklist.indexOf(this.blogData.author.userName),1)
        //从本地数据清除用户名
        sessionStorage.setItem('userData',JSON.stringify(temData))
        //修改组内数据
        this.userData.userDetail.blacklist.splice(this.userData.userDetail.blacklist.indexOf(this.blogData.author.userName),1)
        UserDetailService.unBlackList({
          userName:this.blogData.author.userName
        }).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('取消拉黑成功')
          }else {
            this.$message.error('取消拉黑失败')
          }
        })
      }else {
        let temData = JSON.parse(sessionStorage.getItem('userData'))
        temData.userDetail.blacklist.push(this.blogData.author.userName)
        //从本地数据清除用户名
        sessionStorage.setItem('userData',JSON.stringify(temData))
        //修改组内数据
        this.userData.userDetail.blacklist.push(this.blogData.author.userName)
        UserDetailService.setBlackList({
          userName:this.blogData.author.userName
        }).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('拉黑成功')
          }else {
            this.$message.error('拉黑失败')
          }
        })
      }
    },
    switchAttentions(){
      if (this.userData.userDetail.attentions.includes(this.blogData.author.userName)){
        //修改本地sessionStorage数据
        let temData = JSON.parse(sessionStorage.getItem('userData'))
        temData.userDetail.attentions.splice(temData.userDetail.attentions.indexOf(this.blogData.author.userName),1)
        //从本地数据清除用户名
        sessionStorage.setItem('userData',JSON.stringify(temData))
        //修改组内数据
        this.userData.userDetail.attentions.splice(this.userData.userDetail.attentions.indexOf(this.blogData.author.userName),1)
        UserDetailService.unAttentions({
          userName:this.blogData.author.userName
        }).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('取消关注成功')
          }else {
            this.$message.error('取消关注失败')
          }
        })
      }else {
        let temData = JSON.parse(sessionStorage.getItem('userData'))
        temData.userDetail.attentions.push(this.blogData.author.userName)
        //从本地数据清除用户名
        sessionStorage.setItem('userData',JSON.stringify(temData))
        //修改组内数据
        this.userData.userDetail.attentions.push(this.blogData.author.userName)
        UserDetailService.setAttentions({
          userName:this.blogData.author.userName
        }).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('关注成功')
          }else {
            this.$message.error('关注失败')
          }
        })
      }
    },
    switchLike(){
      if (this.userData.userDetail.likes.includes(this.blogId)){
        //修改本地sessionStorage数据
        let temData = JSON.parse(sessionStorage.getItem('userData'))
        temData.userDetail.likes.splice(temData.userDetail.likes.indexOf(this.blogId),1)
        //从本地数据清除用户名
        sessionStorage.setItem('userData',JSON.stringify(temData))
        //修改组内数据
        this.userData.userDetail.likes.splice(this.userData.userDetail.likes.indexOf(this.blogId),1)
        UserDetailService.unLikes({
          blogId:this.blogId
        }).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('取消点赞成功')
          }else {
            this.$message.error('取消点赞失败')
          }
        })
      }else {
        let temData = JSON.parse(sessionStorage.getItem('userData'))
        temData.userDetail.likes.push(this.blogId)
        //从本地数据清除用户名
        sessionStorage.setItem('userData',JSON.stringify(temData))
        //修改组内数据
        this.userData.userDetail.likes.push(this.blogId)
        UserDetailService.setLikes({
          blogId:this.blogId
        }).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('点赞成功')
          }else {
            this.$message.error('点赞失败')
          }
        })
      }
    },
  },

  filters: {
    transformTime(time) {
      let blogCreateTime = new Date(time)//博客发布时间
      let currentTime = new Date() //当前时间
      let offsetTime = currentTime - blogCreateTime
      let offsetSecond = offsetTime / 1000
      let offsetMinute = offsetSecond / 60
      let offsetHour = offsetMinute / 60
      let offsetDay = offsetHour / 24
      let year = new Date().getFullYear()
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        if (offsetDay > 366) {
          return `发表于${Math.floor(offsetDay / 365)} 年之前`;
        } else if (offsetDay >= 30 && offsetDay < 365) {
          return `发表于${Math.floor(offsetDay / 30)} 月之前`;
        } else if (offsetDay >= 7 && offsetDay < 30) {
          return `发表于${Math.floor(offsetDay / 7)} 周之前`;
        } else if (offsetDay >= 1 && offsetDay < 7) {
          return `发表于${Math.floor(offsetDay)} 天之前`;
        } else if (offsetHour >= 1) {
          return `发表于${Math.floor(offsetHour)} 小时之前`;
        } else if (offsetMinute >= 1) {
          return `发表于${Math.floor(offsetMinute)} 分钟之前`;
        } else if (offsetSecond >= 0) {
          return `发表于${Math.floor(offsetSecond)} 秒钟之前`;
        }
      } else {
        if (offsetDay > 365) {
          return `发表于${Math.floor(offsetDay / 365)} 年之前`;
        } else if (offsetDay >= 30 && offsetDay < 365) {
          return `发表于${Math.floor(offsetDay / 30)} 月之前`;
        } else if (offsetDay >= 7 && offsetDay < 30) {
          return `发表于${Math.floor(offsetDay / 7)} 周之前`;
        } else if (offsetDay >= 1 && offsetDay < 7) {
          return `发表于${Math.floor(offsetDay)} 天之前`;
        } else if (offsetHour >= 1) {
          return `发表于${Math.floor(offsetHour)} 小时之前`;
        } else if (offsetMinute >= 1) {
          return `发表于${Math.floor(offsetMinute)} 分钟之前`;
        } else if (offsetSecond >= 0) {
          return `发表于${Math.floor(offsetSecond)} 秒钟之前`;
        }
      }
    }
  },
  created() {
    this.blogId = Number(this.$route.params.id)
    BlogService.getBlogByID({
      blogId:this.blogId
    }).then(rs=>{
      console.log('博客的详细数据',rs.data)
      this.blogData = rs.data.data.blogData
    })
  }
}
</script>

<style scoped>

</style>
