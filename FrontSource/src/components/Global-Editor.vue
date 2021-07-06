<template>
  <el-card class="box-card" v-loading="isPublishing">
    <div slot="header" class="clearfix">
      <span>写文章</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="publishBlog">发布</el-button>
    </div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-upload
            class="avatar-uploader"
            :action="`${defaultConfig.baseApiUrl}/uploadImg`"
            name="blogIllustrations"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
        >
          <img v-if="cover" :src="cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon">封面</i>
        </el-upload>
      </el-col>
      <el-col :span="18">
        <el-row :gutter="10" style="margin-bottom:20px ">
         <el-col :span="24">
           <el-input v-model="title" placeholder="请输入文章标题"></el-input>
         </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-bottom: 20px">
          <el-col :span="24">
            <el-input v-model="description" placeholder="请输入文章简介"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
         <el-col :span="24">
           <el-tag
            :key="tag"
            v-for="tag in tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
           >
             {{tag}}
           </el-tag>
           <el-input
               class="input-new-tag"
               v-model="inputValue"
               v-if="inputVisible"
               ref="saveTagInput"
               size="small"
               @keyup.enter.native="handleInputConfirm"
               @blur="handleInputConfirm"
           ></el-input>
           <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
         </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="10">
     <el-col :span="24">
       <div id="editor" ref="editor"></div>
     </el-col>
    </el-row>
  </el-card>
</template>

<script>
import defaultConfig from '@/config/config.default'
import Editor from 'wangeditor'
import hljs from 'highlight.js'
import ImgFileService from "@/service/ImgFileService"
import BlogService from "@/service/BlogService"

export default {
  name: "Global-Editor",
  data(){
    return{
      defaultConfig,
      cover:'',
      title:'',
      description:'',
      inputVisible:false,
      inputValue:'',
      tags:[],
      editor:null,
      isPublishing:false
    }
  },
  mounted() {
    this.editor=new Editor(this.$refs.editor) //初始化编辑器
    this.editor.highlight=hljs //代码高亮

    //编辑器的基本配置
    this.editor.config.height = 800
    this.editor.config.zIndex = 1000
    this.editor.config.placholder = '请输入文章内容'
    this.editor.config.focus = true

    //功能菜单配置
   /* this.editor.config.menus=[
      'bold',
      'head',
      'link',
      'italic',
      'underline'
    ]*/
    //配置字体
    /*this.editor.config.fontNames = [
      '黑体',
      '仿宋',
      '楷体',
      '标楷体',
      '华文仿宋',
      '华文楷体',
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana',
      'Times New Roman',
      'Courier New',
    ]*/
    //配置字号
    /*this.editor.config.fontSizes = {
      'x-small': { name: '10px', value: '1' },
      'small': { name: '13px', value: '2' },
      'normal': { name: '16px', value: '3' },
      'large': { name: '18px', value: '4' },
      'x-large': { name: '24px', value: '5' },
      'xx-large': { name: '32px', value: '6' },
      'xxx-large': { name: '48px', value: '7' },
      'xxxx-large': { name: '60px', value: '8' },
    }*/
    //配置行高
    // this.editor.config.lineHeights = ['1', '1.15', '1.6', '2', '2.5', '3']

    //配置表情包
    /*this.editor.config.emotions = [
      {
        title: 'emoji',  // tab 的标题
        type: 'emoji', // 'emoji' / 'image'
        // emoji 表情，content 是一个数组即可
        content:
            '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😓 😪 😴 🙄 🤔 😬 🤐 🤽‍♂ 💯 🤢  ❤️ 🧡 💛 💔 💖 '
                .split(/\s/),
      },
      {
        title: '动图',
        type:'image' ,
        content:[
          {
            alt: '[抖腿]',
            src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606841532580&di=aa2a2d03ac29ab222aee52ac77937bca&imgtype=0&src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F12%2F20200412024706_VYieJ.thumb.1000_0.gif'
          },
        ]
      }
    ]*/

    // 字体颜色  背景色的预设值
   /* this.editor.config.colors = [
      '#000',
      '#fff',
      '#18b318',
      '#1414be'
    ]*/
    // 自定义检查插入的链接
    /*this.editor.config.linkCheck = function(text, link) {
      // 以下情况，请三选一

      // 1. 返回 true ，说明检查通过
      return true

      // // 2. 返回一个字符串，说明检查未通过，编辑器会阻止链接插入。会 alert 出错误信息（即返回的字符串）
      // return '链接有 xxx 错误'

      // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止链接插入。
      // 此处，你可以自定义提示错误信息，自由发挥
    }
*/
    //本地图片上传
    this.editor.config.uploadImgMaxSize = 2*1024*1024
    this.editor.config.uploadImgMaxLength = 9
    this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      //resultFiles 相当于input type=file 所选中的目标
      //insertImgFn 回调函数,获取图片的最终地址，插入到编辑器里面
      let imgData = new FormData()
      for (let i = 0,len = resultFiles.length;i<len;i++){
         imgData.append('blogIllustrations',resultFiles[i])
      }
      ImgFileService.uploadImgFile(imgData).then(rs => {
        for (let i = 0,len=rs.data.data.imgList.length;i<len;i++){
          insertImgFn(rs.data.data.imgList[i])
        }
      })
    }
    //base64保存图片
    this.editor.config.uploadImgShowBase64 = true
    // 支持的编辑语言
    this.editor.config.languageType = [
      'Bash'
    ]
    // 粘贴文本的内容处理
    // this.editor.config.pasteTextHandle = function (pasteStr){
    //   console.log(pasteStr);// 只保留纯文本文档
    //   return '解析过后的str';
    // }
    // editor.config.pasteFilterStyle = false
    // 编辑器内容的获取 纯文本, html, json格式的
    // 编辑器内容的修改
    this.editor.create()
  },
  methods:{
    handleAvatarSuccess(rs){
      this.cover=rs.data.imgList[0]
    },
    handleClose(tag){
      this.tags.splice(this.tags.indexOf(tag),1)
    },
    handleInputConfirm(){
      if (this.inputValue){
        this.tags.push(this.inputValue)
        this.inputValue=''
      }
      this.inputVisible=false
    },
    showInput(){
      this.inputVisible=true
    },
    publishBlog(){
      let blogData = {
        title:this.title,
        description:this.description,
        tags:this.tags,
        cover:this.cover,
        content:this.editor.txt.html()
      }
      if (this.title&&this.description&&this.tags.length&&blogData.content){
        this.isPublishing = true;
        BlogService.createBlog(blogData).then(rs=>{
          if (rs.data.status===200){
            this.$message.success('发布成功')
            this.$emit('publishSuccess')
          }else {
            this.$message.error('发布失败')

          }
        }).finally(()=>{
          this.isPublishing = false
        })
      }else {
        this.$message.warning('博客数据不全,请完善后在发表')
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy();// 销毁编辑器, 当用户离开这个组件的时候
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px !important;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
