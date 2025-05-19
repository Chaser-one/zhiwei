<template>
  <div>
    <el-card
        class="box-card"
        v-for="(blacklistItem,index) in blacklist"
        :key="index"
        style="margin-bottom: 20px"
    >
      <el-row :gutter="10" style="display: flex;justify-content: space-between">
        <el-col :span="6">
          <el-avatar :src="blacklistItem.avatar"></el-avatar>
          <br>
          <span>{{ blacklistItem.userName }}</span>
        </el-col>
        <el-col :span="14" style="text-align: left">
          <span>{{blacklistItem.introduction}}</span>
        </el-col>
        <el-col :span="4">
          <el-button
              type="danger"
              icon="el-icon-s-custom"
              @click="switchBlackList(blacklistItem.userName)"
          >
            {{userData.userDetail.blacklist.includes(blacklistItem.userName)?'已拉黑':'拉黑'}}
          </el-button>
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
  name: "MyBlackList",
  data() {
    return {
      blacklist: [],
      params: {
        limit: 5,
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
      UserDetailService.getBlackList(this.params).then(rs => {
        this.totalNum = rs.data.data.totalNum
        this.blacklist = rs.data.data.blacklist
      })
    },
    changePage(page) {
      this.params.offset = (page - 1) * this.params.limit
      this.getBlogData()
    },
    switchBlackList(userName) {
      if (this.userData.userDetail.blacklist.includes(userName)) {
        let tempData = JSON.parse(sessionStorage.getItem('userData'))
        tempData.userDetail.blacklist.splice(tempData.userDetail.blacklist.indexOf(userName), 1)
        sessionStorage.setItem('userData', JSON.stringify(tempData))
        this.userData.userDetail.blacklist.splice(this.userData.userDetail.blacklist.indexOf(userName), 1)
        UserDetailService.unBlackList({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success('取消拉黑成功')
          } else {
            this.$message.error('取消拉黑失败')
          }
        })
      } else {
        let tempData = JSON.parse(sessionStorage.getItem('userData'))
        tempData.userDetail.blacklist.push(userName)
        sessionStorage.setItem('userData', JSON.stringify(tempData))
        this.userData.userDetail.blacklist.push(userName)
        UserDetailService.setBlackList({
          userName: userName
        }).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success('拉黑成功')
          } else {
            this.$message.error('拉黑失败')
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
