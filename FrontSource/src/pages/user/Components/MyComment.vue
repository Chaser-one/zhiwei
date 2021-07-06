<template>
  <div>
    <el-card class="box-card" v-for="(commentItem, index) in commentList" :key="index" style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :span="10">
            <h3 @click="goBlogDetail(commentItem.blogId)">{{ commentItem.blogData.title }}</h3>
          </el-col>
          <el-col :span="14" style="text-align: right;">
            <el-avatar :src="commentItem.blogData.author.avatar"></el-avatar>
            <br>
            <span>{{ commentItem.blogData.author.userName }}</span>
          </el-col>
        </el-row>
      </div>
      <div v-for="(item, index) in commentItem.commentData" :key="index" style="margin-bottom: 20px;">
        <el-row :gutter="10">
          <el-col :span="2">
            <el-avatar :src="item.userData.avatar"></el-avatar>
          </el-col>
          <el-col :span="22" style="box-shadow:0px 0px 1px 1px #cbcbcb">
            <div style="padding: 10px;">
              {{ item.content }}
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
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
import UserDetailService from "@/service/UserDetailService";

export default {
  name: "MyComment",
  data() {
    return {
      commentList: [],
      params: {
        limit: 5,
        offset: 0
      },
      totalNum: 0
    }
  },
  created() {
    this.getBlogData()
  },
  methods: {
    getBlogData() {
      UserDetailService.getCommentList(this.params).then(rs => {
        this.totalNum = rs.data.data.totalNum;
        this.commentList = rs.data.data.commentList;
      })
    },
    changePage(page) {
      this.params.offset = (page - 1) * this.params.limit;
      this.getBlogData();
    },
    goBlogDetail(blogId){
      this.$router.push(`/article/${blogId}`)
    }
  }
}
</script>

<style scoped>

</style>
