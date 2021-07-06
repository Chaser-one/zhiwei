<template>
  <div>
    <GlobalArticle
        v-for="(blogItem,index) of blogList"
        :article-data="blogItem"
        :key="index"
    />
    <el-pagination
        layout="prev, pager, next"
        :page-size="params.limit"
        :total="totalNum"
        @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import GlobalArticle from '@/components/Global-Article'
import BlogService from "@/service/BlogService"
export default {
  name: "MyBlog",
  data(){
    return {
      blogList:[],
      params:{
        limit:1,
        offset:0
      },
      totalNum:0
    }
  },
  created() {
    this.getBlogData()
  },
  methods:{
    getBlogData(){
      BlogService.getMyLikeBlog(this.params).then(rs=>{
        this.totalNum = rs.data.data.totalNum
        this.blogList = rs.data.data.blogList
      })
    },
    changePage(page){
      this.params.offset = (page-1)*this.params.limit
      this.getBlogData()
    }
  },
  components:{
    GlobalArticle
  }
}
</script>

<style scoped>

</style>
