<template>
  <div>
    <el-table
        :data="tipOffData"
        style="width: 100%">
      <el-table-column
          prop="blogId"
          label="博客id"
          width="180">
      </el-table-column>
      <el-table-column
          prop="title"
          label="博客标题"
          width="180">
      </el-table-column>
      <el-table-column
          prop="博客封面"
          width="180">
        <template slot-scope="scope">
          <el-image :src="scope.row.cover" style="width: 180px"></el-image>
        </template>
      </el-table-column>
      <el-table-column
          prop="description"
          label="博客简介"
          width="180"
      >
      </el-table-column>
      <el-table-column
          prop="reason"
          label="举报原因">
      </el-table-column>
      <el-table-column
          label="操作"
      >
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;justify-content: center">
            <el-button type="primary" size="mini" @click="goDetail(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" @click="ignoreTipOff(scope.row)">忽略举报</el-button>
            <el-button type="danger" size="mini" @click="rejectedBlog(scope.row)">删除文章</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        layout="prev, pager, next"
        :page-size="searchParams.limit"
        :total="totalNum">
    </el-pagination>
  </div>
</template>

<script>
import TipOffService from "@/service/TipOffService"
export default {
  name: "TipOff",
  data(){
    return{
      tipOffData:[],
      searchParams:{
        limit:10,
        offset:0
      },
      totalNum:0
    }
  },
  created() {
    this.getTipOffData()
  },
  methods:{
    getTipOffData(){
      TipOffService.getTipOffData(this.searchParams).then(rs=>{
        this.totalNum = rs.data.data.totalNum
        this.tipOffData = rs.data.data.tipOffData
      })
    },
    goDetail(row){
      this.$router.push(`/article/${row.blogId}`)
    },
    ignoreTipOff(article){
      TipOffService.ignoreTipOffDataById({
        tipOffId:article._id
      }).then(rs => {
        if (rs.status === 200){
          this.$message.success('忽略成功')
          this.getTipOffData()
        }
      })
    },
    rejectedBlog(article){
      TipOffService.deleteTipOffDataById({
        tipOffId:article._id
      }).then(rs=>{
        if (rs.status === 200){
          this.$message.success('删除成功')
          this.getTipOffData()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
