<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <GlobalEditor @publishSuccess="goBack"></GlobalEditor>
  </div>
</template>

<script>
import GlobalEditor from '@/components/Global-Editor'
export default {
  name: "Article-Edit",
  components:{
    GlobalEditor
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    }
  }
}

</script>

<style scoped>

</style>
