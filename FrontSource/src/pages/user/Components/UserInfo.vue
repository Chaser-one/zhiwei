<template>
  <el-card class="box-card">
   <el-image
    :src="userData.avatar"
    style="width: 100%;margin: auto"
   ></el-image>
    <el-row :gutter="10">
     <el-col :span="24" style="text-align: center">
       <span>{{userData.userName}}</span>
     </el-col>
    </el-row>
    <el-row :gutter="10">
     <el-col :span="24" style="text-align: center">
       <span>{{userData.introduction}}</span>
     </el-col>
    </el-row>
    <el-row :gutter="10" style="text-align: center;margin-top: 20px">
     <el-col :span="8">
       <el-badge class="mark" :value="userData.userDetail.articles.length">
         <el-button type="primary" size="mini">我的文章</el-button>
       </el-badge>
     </el-col>
      <el-col :span="8">
        <el-badge class="mark" :value="userData.views">
          <el-button type="primary" size="mini">浏览数</el-button>
        </el-badge>
      </el-col>
      <el-col :span="8">
        <el-badge class="mark" :value="userData.likes">
          <el-button type="primary" size="mini">点赞数</el-button>
        </el-badge>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import defaultConfig from '@/config/config.default'
export default {
name: "UserInfo",
  props:{
    userData:{
      type:Object,
      default(){
        return{

        }
      }
    }
  },
}
</script>

<style scoped>

</style>
