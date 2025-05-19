<template>
  <div>
    <div
        v-for="(commentItem,index) in localComment"
        :key="index"
        class="comment-card"
        style="margin-bottom: 20px"
    >
      <el-row :gutter="10">
        <el-col :span="2">
          <el-avatar :src="commentItem.userData.avatar" size="large"></el-avatar>
        </el-col>
        <el-col :span="6" style="font-size: 12px">
          <span>{{commentItem.userData.userName}}</span>
          <br>
          <span>{{commentItem.lastModified | transformTime}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
       <el-col :span="24" style="text-indent: 2em">{{commentItem.content}}</el-col>
       <el-col :span="24" style="border-left: 2px solid #ccc;margin-top: 20px">
         <div
          v-for="(sonCommentItem,index) in commentItem.comment"
          :key="index"
          style="margin: 20px;border-bottom: 1px dashed #fbc4c4"
         >
           <el-row :gutter="10">
            <el-col :span="2">
              <el-avatar :src="sonCommentItem.userData.avatar" size="large"></el-avatar>
            </el-col>
            <el-col :span="6" style="color: #3a8ee6;font-size: 12px">
              <span>{{sonCommentItem.userData.userName}}</span>
              <br>
              <span>{{sonCommentItem.lastModified | transformTime}}</span>
            </el-col>
             <el-col :span="16" style="color: #07bcdd;text-indent: 2em">
               {{sonCommentItem.content}}
             </el-col>
           </el-row>
         </div>
       </el-col>
      </el-row>
      <el-row :gutter="10">
       <el-col :span="6">
         <el-button
             type="text"
             icon="el-icon-s-comment"
             @click="switchComment(commentItem)"
         >回复
         </el-button>
       </el-col>
      </el-row>
      <el-row :gutter="10" v-if="commentItem.isComment">
       <el-col :span="24">
         <el-input v-model="commentStr" placeholder="请输入评论内容"></el-input>
       </el-col>
        <el-col :span="24" style="text-align: right;margin-top: 20px">
          <el-button type="primary" @click="cancelComment(commentItem,'son')">取消</el-button>
          <el-button type="primary" v-if="commentStr" @click="addComment(commentItem,'son')">回复</el-button>
        </el-col>
      </el-row>

    </div>
    <el-row :gutter="10" v-if="isComment">
      <el-col :span="24">
        <el-input v-model="articleCommentStr" placeholder="请输入评论内容"></el-input>
      </el-col>
      <el-col :span="24" style="text-align: right;margin-top: 20px">
        <el-button type="primary" @click="cancelComment(localComment,'father')">取消</el-button>
        <el-button type="primary" v-if="articleCommentStr" @click="addComment(localComment,'father')">回复</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BlogService from "@/service/BlogService"
export default {
  name: "Global-Comment",
  props:{
   comment:{
     type:Array,
     default(){
       return []
     }
   },
    blogId:{
     type:Number,
     default:0
    }
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
  watch:{
    comment:{
      handler(){
        this.localComment = this.comment.slice(0)
      },
      immediate:true
    }
  },
  data(){
    return{
      articleCommentStr:'',
      commentStr:'',
      localComment:[],
      isComment:true,
      userData:JSON.parse(sessionStorage.getItem('userData'))
    }
  },
  methods:{
    switchComment(commentItem){
      this.localComment.forEach(item=>{
        //关闭之前开启的所有回复框
        if (item !== commentItem){
          item.isComment = false
        }
      })
      //切换当前这个评论的回复状态
      commentItem.isComment = !commentItem.isComment
      if (commentItem.isComment){
        this.isComment = false
      }else{
        this.isComment = true
      }
    },
    cancelComment(target,type){
      switch (type){
        case 'father':
          this.articleCommentStr = ''
             break;
        case 'son':
          this.commentStr = ''
          target.isComment = false
          this.isComment = true
          break;
      }
    },
    addComment(target,type){
      let commentData = {
        fatherId:undefined,
        blogId:this.blogId,
        comment:{}
      }
      switch (type){
        case 'father':
          commentData.comment = {
            userData:{
              userName:this.userData.userName,
              avatar:this.userData.avatar
            },
            content:this.articleCommentStr,
            isComment:false,
            comment:[]
          }
          this.articleCommentStr = ''
          break;
        case 'son':
          commentData.fatherId = target.commentId
          commentData.comment = {
            userData:{
              userName:this.userData.userName,
              avatar:this.userData.avatar
            },
            content:this.commentStr,
          }
          this.commentStr = ''
          target.isComment = false
          this.isComment = true
          break;
      }
      BlogService.createBlogComment(commentData).then(rs=>{
        switch (type){
          case 'father':
            target.push(rs.data.data.commentData)
            break;
          case 'son':
            target.comment.push(rs.data.data.commentData)
            target.isComment = false
            break
        }
      })
    }
  }
}
</script>

<style scoped>
.comment-card {
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 6px rgba(0, 0, 0, 0.1);
}
</style>
