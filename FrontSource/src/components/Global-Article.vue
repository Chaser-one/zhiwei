<template>
  <div @click="goArticleDetail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{articleData.title}}</span>
        <el-tag v-if="!articleData.approved" type="warning">未审核</el-tag>
      </div>
      <el-row :gutter="10">
       <el-col :span="24" style="display: flex;justify-content: center">
         <el-image :src="articleData.cover" style="height: 450px">
           <div slot="placeholder" class="image-slot">
             加载中<span class="dot">...</span>
           </div>
           <div slot="error" class="image-slot">
             <i class="el-icon-picture-outline"></i>
           </div>
         </el-image>
       </el-col>
      </el-row>
      <el-row :gutter="10">
       <el-col :span="24">
         <p>{{articleData.description}}</p>
       </el-col>
      </el-row>
      <el-row :gutter="10">
       <el-col :span="2">
         <el-avatar :src="articleData.author.avatar"  style="width: auto"></el-avatar>
       </el-col>
        <el-col :span="4">
          <p>{{articleData.lastModified | transformTime}}</p>
        </el-col>
        <el-col :span="6" :offset="6" style="display: flex;justify-content: space-around">
          <el-badge class="item" :value="articleData.likes">
            <el-button size="small">喜欢</el-button>
          </el-badge>
          <el-badge class="item" :value="articleData.views" type="primary">
            <el-button size="small">阅览</el-button>
          </el-badge>
          <el-badge class="item" :value="articleData.comment.length" type="warning">
            <el-button size="small">回复</el-button>
          </el-badge>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Global-Article",
  props:{
    articleData:{
      type:Object,
      default(){
        return{
          title:'',
          tags:[],
          description:'',
          cover:'',
          comment:[],
          author:{},
          lastModified:new Date(),
          views:0,
          likes:0,
          blogId:1,//博客id,一个递增字段，用于标识一个独一无二的博客文章数据
          approved:true
        }
      }
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
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0){
        if (offsetDay>366){
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
        if (offsetDay>365){
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
  methods:{
    goArticleDetail(){
      this.$router.push(`/article/${this.articleData.blogId}`)
    }
  }
}
</script>

<style scoped>

</style>
