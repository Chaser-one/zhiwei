<template>
  <el-container style="overflow-x:hidden">
    <el-header style="border-bottom:1px solid #ccc;padding:10px 0;margin-bottom:20px">
      <el-row :gutter="10">
        <el-col
            :span="18"
            :offset="3"
            class="header"
        >
          <img src="@/assets/logo.png" style="height: 40px">
          <el-input
              v-model="searchStr"
              placeholder="请输入博客标题"
              style="width: 60%"
          >
            <el-button type="primary" slot="append" icon="el-icon-search" @click="goBlogListPage"></el-button>
          </el-input>
          <el-dropdown v-if="hasPermission" @command="handleSelectSetting">
            <el-avatar
                class="avatar"
                :src="userData.avatar"
                :title="userData.userName"
                shape="square"
                fit="cover"
            >
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>{{ userData.userName }}</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="signOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-link type="primary" href="login.html" v-if="!hasPermission">登录</el-link>
          <el-button type="text" icon="el-icon-s-home" v-if="hasPermission" @click="goChatHome">小树洞</el-button>
          <el-button type="text" icon="el-icon-edit" v-if="hasPermission" @click="goEditor">写文章</el-button>
          <el-button type="text" icon="el-icon-s-data" v-if="isAdmin" @click="goAdmin">站点管理系统</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside v-if="hasPermission" width="300px">
        <UserInfo :user-data="userData"></UserInfo>
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName" @tab-click="switchTab">
          <el-tab-pane label="广场" name="article">
            <Community></Community>
          </el-tab-pane>
          <el-tab-pane label="我的文章" name="myself">
            <MyBlog/>
          </el-tab-pane>
          <el-tab-pane label="喜欢" name="like">
            <MyLikeBlog/>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comment">
            <MyComment/>
          </el-tab-pane>
          <el-tab-pane label="关注" name="attention">
            <MyAttentions/>
          </el-tab-pane>
          <el-tab-pane label="黑名单" name="blacklist">
            <MyBlackList/>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <el-dialog
        :visible.sync="isShowSetting"
        width="60%"
    >
      <UserSetting/>
    </el-dialog>
  </el-container>
</template>

<script>
import AuthorService from "@/service/AuthorService"
import defaultConfig from "@/config/config.default"
import UserInfo from "@/pages/user/Components/UserInfo"
import Community from "@/pages/user/Components/Community"
import MyBlog from "@/pages/user/Components/MyBlog"
import MyLikeBlog from "@/pages/user/Components/MyLikeBlog"
import MyComment from "@/pages/user/Components/MyComment"
import MyAttentions from "@/pages/user/Components/MyAttentions"
import MyBlackList from "@/pages/user/Components/MyBlackList"
import UserSetting from "@/pages/user/Components/UserSetting"

export default {
  name: "Home",
  data() {
    return {
      searchStr: '',
      hasPermission: false,
      isAdmin: false,
      userData: {},
      activeName: '',
      isShowSetting: false
    }
  },
  components: {
    UserInfo,
    Community,
    MyBlackList,
    MyAttentions,
    MyComment,
    MyLikeBlog,
    MyBlog,
    UserSetting
  },
  created() {
    AuthorService.checkPermission().then(rs => {
      if (rs.data.status === 200) {
        this.hasPermission = true
        this.userData = rs.data.data.userData
        this.isAdmin = this.userData.isAdmin
        sessionStorage.removeItem('userData')
        sessionStorage.setItem('userData', JSON.stringify(this.userData))
      } else {
        // window.location.replace(`${defaultConfig.hostname}/login.html`)
      }
    })
    this.activeName = this.$route.params.module ? this.$route.params.module : 'article'
  },
  methods: {
    goEditor() {
      this.$router.push('/editor')
    },
    goChatHome() {
      this.$router.push('/chatHome')
    },
    goBlogListPage() {
      if (this.searchStr) {
        this.$router.push(`/blogList/${this.searchStr}`)
      }
    },
    goAdmin() {
      window.location.replace(`${defaultConfig.hostname}/admin.html`)
    },
    switchTab(tab) {
      this.$router.push(`/home/${tab.name}`).catch(err=>err)
    },
    handleSelectSetting(command) {
      switch (command) {
        case "setting":
          this.isShowSetting = !this.isShowSetting
          break;
        case "signOut":
          this.signOut();
          break
      }
    },
    signOut() {
      sessionStorage.removeItem('Authorization')
      window.location.replace(`${defaultConfig.hostname}/index.html`)
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar {
  width: 45px;
  height: 45px;
}
</style>
