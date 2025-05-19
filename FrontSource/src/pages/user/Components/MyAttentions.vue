<template>
  <div>
    <el-card
        class="box-card"
        v-for="(attentionItem,index) in attentionList"
        :key="index"
        style="margin-bottom: 20px;"
    >
      <el-row :gutter="10" style="display: flex;justify-content: space-around">
        <el-col :span="6">
          <el-avatar :src="attentionItem.avatar"></el-avatar>
          <br>
          <span>{{ attentionItem.userName }}</span>
        </el-col>
        <el-col :span="14" style="text-align: left">
          <span>{{attentionItem.introduction}}</span>
        </el-col>
        <el-col :span="4">
          <el-button
              type="primary"
              :icon="userData.userDetail.attentions.includes(attentionItem.userName)?'el-icon-check':'el-icon-plus'"
              @click="switchAttentions(attentionItem.userName)"
          >关注</el-button>
        </el-col>
      </el-row>
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
import UserDetailService from "@/service/UserDetailService"

export default {
  name: "MyAttentions",
  data() {
    return {
      attentionList: [],
      params: {
        limit: 10,
        offset: 0
      },
      totalNum: 0,
      userData: JSON.parse(sessionStorage.getItem('userData'))
    }
  },
  created() {
    this.getBlogData()
  },
  methods: {
    getBlogData() {
      UserDetailService.getAttentionList(this.params).then(rs => {
        this.totalNum = rs.data.data.totalNum
        this.attentionList = rs.data.data.attentionList
      })
    },
    changePage(page) {
      this.params.offset = (page - 1) * this.params.limit
      this.getBlogData()
    },
    switchAttentions(userName) {
      if (this.userData.userDetail.attentions.includes(userName)) {
        let tempData = JSON.parse(sessionStorage.getItem('userData'))
        tempData.userDetail.attentions.splice(tempData.userDetail.attentions.indexOf(userName), 1)
        sessionStorage.setItem('userData', JSON.stringify(tempData))
        this.userData.userDetail.attentions.splice(this.userData.userDetail.attentions.indexOf(userName), 1)
        UserDetailService.unAttentions({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success('取消关注成功')
          } else {
            this.$message.error('取消关注失败')
          }
        })
      } else {
        let tempData = JSON.parse(sessionStorage.getItem('userData'))
        tempData.userDetail.attentions.push(userName)
        sessionStorage.setItem('userData', JSON.stringify(tempData))
        this.userData.userDetail.attentions.push(userName)
        UserDetailService.setAttentions({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success('关注成功')
          } else {
            this.$message.error('关注失败')
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
