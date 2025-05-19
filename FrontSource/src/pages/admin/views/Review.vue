<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文章审核" name="article">
        <el-table
            :data="blogList"
            style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column
              prop="title"
              label="标题"
              width="180">
          </el-table-column>
          <el-table-column
              prop="blogId"
              label="博客id">
          </el-table-column>
          <el-table-column
              label="封面">
            <template slot-scope="scope">
              <el-image
                fit="fill"
                :src="scope.row.cover"
                style="width: 100px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
              label="发布时间">
            <template slot-scope="scope">
              {{scope.row.lastModified|transformTime}}
            </template>
          </el-table-column>
          <el-table-column
              prop="description"
              label="简介">
          </el-table-column>
          <el-table-column
              prop="tags"
          >
            <template slot-scope="scope">
              <el-tag
                  type="success"
                  v-for="(tag,index) in scope.row.tags"
                  :key="index"
                  style="margin-right: 10px;margin-bottom: 10px"
              >{{tag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              width="180px"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="approvedBlog(scope.row)">通过</el-button>
              <el-button type="danger" @click="rejectedBlog(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center;margin-top: 20px;">
          <el-pagination
              layout="prev, pager, next"
              :total="BlogTotalNum"
              :page-size="searchBlogParams.limit"
              @current-change="handleBlogCurrentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新用户审核" name="user">
        <el-table
            :data="userList"
            style="width: 100%">
          <el-table-column
              prop="userName"
              label="用户名"
              width="180">
          </el-table-column>
          <el-table-column
              prop="avatar"
              label="头像"
              width="180">
            <template slot-scope="scope">
              <el-image
                fit="fill"
                :src="scope.row.avatar"
                style="width: 100px"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
              prop="introduction"
              label="用户简介">
          </el-table-column>
          <el-table-column
              label="操作"
              width="180"
          >
            <template slot-scope="scope">
              <el-button type="primary" @click="approvedUser(scope.row)">通过</el-button>
              <el-button type="danger" @click="rejectedUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: center;margin-top: 20px;">
          <el-pagination
              layout="prev, pager, next"
              :total="userTotalNum"
              :page-size="searchUserParams.limit"
              @current-change="handleUserCurrentChange"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AuthorService from "@/service/AuthorService"
import BlogService from "@/service/BlogService"
export default {
  name: "Review",
  data(){
    return{
      searchUserParams:{
        limit:10,
        offset:0
      },
      userTotalNum:0,
      userList:[],
      searchBlogParams:{
        limit:10,
        offset:0
      },
      BlogTotalNum:0,
      blogList:[],
      activeName:'article'
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
  created() {
    this.getUserList()
    this.getBlogList()
  },
  methods:{
    getBlogList(){
      BlogService.getUnapprovedBlog(this.searchUserParams).then(rs=>{
        this.blogTotalNum = rs.data.data.blogTotalNum
        this.blogList = rs.data.data.blogList
      })
    },
    approvedBlog(article){
      BlogService.approvedBlog({
        blogId:article.blogId
      }).then(rs=>{
        if (rs.status === 200){
          this.$message.success('批准成功')
          this.getBlogList()
        }
      })
    },
    rejectedBlog(article){
      BlogService.deleteBlog({
        blogId:article.blogId
      }).then(rs=>{
        if (rs.status === 200){
          this.$message.success('删除成功')
          this.getBlogList()
        }
      })
    },
    handleBlogCurrentChange(page){
      this.searchBlogParams.offset = (page-1)*this.searchBlogParams.limit
      this.getBlogList()
    },
    getUserList(){
      AuthorService.getUnapprovedUserList(this.searchUserParams).then(rs=>{
        this.userTotalNum = rs.data.data.userTotalNum
        this.userList = rs.data.data.userList
        // console.log(rs.data.data.userList,rs.data.data.userTotalNum)
      })
    },
    approvedUser(user){
      AuthorService.approvedUser({
        key:user.key
      }).then(rs=>{
        if (rs.status === 200){
          this.$message.success('批准成功')
          this.getUserList()
        }
      })
    },
    rejectedUser(user){
      AuthorService.deleteUser({
        key:user.key
      }).then(rs=>{
        if (rs.status === 200){
          this.$message.success('删除成功')
          this.getUserList()
        }
      })
    },
    handleUserCurrentChange(page){
      this.searchUserParams.offset = (page - 1)*this.searchUserParams.limit
      this.getUserList()
    }
  }
}
</script>

<style scoped>

</style>
