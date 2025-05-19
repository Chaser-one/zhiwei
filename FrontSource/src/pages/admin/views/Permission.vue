<template>
  <div>
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
      >
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
      <el-table-column label="是否冻结账户">
        <template slot-scope="scope">
          <el-switch
              :value="!scope.row.approved"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchApproved(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
          label="是否设置为管理员"
      >
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.isAdmin"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchAdmin(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
          width="180"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button type="danger" @click="rejectedUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin-top: 20px">
      <el-pagination
          layout="prev, pager, next"
          :total="userTotalNum"
          :page-size="searchUserParams.limit"
          @current-change="handleUserCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AuthorService from "@/service/AuthorService"

export default {
  name: "Permission",
  data(){
    return{
      searchUserParams:{
        limit:10,
        offset:0
      },
      userTotalNum:0,
      userList:[]
    }
  },
  created() {
    this.getUserList()
  },
  methods:{
    switchApproved(userItem){
      userItem.approved = !userItem.approved
      this.$confirm('此操作将改变用户权限，是否继续？','警告',{
        confirmButtonText:'Yes',
        cancelButtonText:'No',
        type:'warning'
      }).then(()=>{
        if (userItem.approved){
          AuthorService.approvedUser({
            key:userItem.key
          }).then(()=>{
            this.$message({
              type:'success',
              message:'解冻成功'
            })
          })
        }else{
          AuthorService.unApprovedUser({
            key:userItem.key
          }).then(()=>{
            this.$message({
              type:'success',
              message:'冻结成功'
            })
          })
        }
      }).catch(()=>{
        userItem.isAdmin = !userItem.isAdmin
        this.$message({
          type:'info',
          message:'取消操作'
        })
      })
    },
    switchAdmin(userItem){
      this.$confirm('此操作将改变用户权限，是否继续？','警告',{
        confirmButtonText:'Yes!',
        cancelButtonText:'No!',
        type:'warning'
      }).then(()=>{
        if (!userItem.approved){
          userItem.isAdmin = !userItem.isAdmin
          this.$message({
            type:'warning',
            message:'该用户还没有通过审核'
          })
        }else {
          if (userItem.isAdmin){
            AuthorService.setAdmin({
              key:userItem.key
            }).then(()=>{
              this.$message({
                type:'success',
                message:'更改权限成功'
              })
            })
          }else{
            AuthorService.cancelAdmin({
              key:userItem.key
            }).then(()=>{
              this.$message({
                type:'success',
                message:'更改权限成功'
              })
            })
          }
        }
      }).catch(()=>{
        userItem.isAdmin = !userItem.isAdmin
        this.$message({
          type:'info',
          message:'取消操作'
        })
      })
    },
    getUserList(){
      AuthorService.getAllUserList(this.searchUserParams).then(rs => {
        this.userTotalNum = rs.data.data.totalNum
        this.userList = rs.data.data.userList
      })
    },
    rejectedUser(user){
      this.$confirm('此操作将永久删除用户及其所有博客，是否继续？','警告', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(()=>{
        AuthorService.deleteUser({
          key:user.key
        }).then(rs => {
          if (rs.status === 200){
            this.$message.success('删除成功')
            this.getUserList()
          }
        })
      }).catch((err)=>{
        console.log(err)
      })
    },
    handleUserCurrentChange(page){
      this.searchUserParams.offset = (page-1)*this.searchUserParams.limit
      this.getUserList()
    }
  }
}
</script>

<style scoped>

</style>
