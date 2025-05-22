<template>
  <el-card class="box-card" v-loading="isPublishing">
    <div slot="header" class="clearfix">
      <span>写文章</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="publishBlog">发布</el-button>
    </div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-upload class="avatar-uploader" :action="`${defaultConfig.baseApiUrl}/uploadImg`" name="blogIllustrations"
          :show-file-list="false" :on-success="handleAvatarSuccess">
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
            <el-tag :key="tag" v-for="tag in tags" closable :disable-transitions="false" @close="handleClose(tag)">
              {{ tag }}
            </el-tag>
            <el-input class="input-new-tag" v-model="inputValue" v-if="inputVisible" ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <div style="border: 1px solid #ccc;">
          <Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
          <Editor style="height: 800px; overflow-y: hidden;" v-model="html" :defaultConfig="editorConfig" :mode="mode"
            @onCreated="onCreated" />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import defaultConfig from '@/config/config.default'
import ImgFileService from "@/service/ImgFileService"
import BlogService from "@/service/BlogService"

export default {
  name: "Global-Editor",
  components: { Editor, Toolbar },
  data() {
    return {
      defaultConfig,
      cover: '',
      title: '',
      description: '',
      inputVisible: false,
      inputValue: '',
      tags: [],
      isPublishing: false,
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入文章内容...',
        MENU_CONF: {
          uploadImage: {
            // 自定义图片上传
            async customUpload(file, insertFn) {
              let imgData = new FormData()
              imgData.append('blogIllustrations', file)
              const rs = await ImgFileService.uploadImgFile(imgData)
              if (rs.data && rs.data.data && rs.data.data.imgList) {
                rs.data.data.imgList.forEach(url => insertFn(url, '', url))
              }
            },
            maxFileSize: 2 * 1024 * 1024,
            maxNumberOfFiles: 9,
            allowedFileTypes: ['image/*'],
            base64LimitSize: 5 * 1024 // 5kb 以下图片转 base64
          }
        }
      },
      mode: 'default'
    }
  },
  mounted() {
    
  },
  
  methods: {
    onCreated(editor) {
      this.editor = editor
    },
    handleAvatarSuccess(rs) {
      this.cover = rs.data.imgList[0]
    },
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    handleInputConfirm() {
      if (this.inputValue) {
        this.tags.push(this.inputValue)
        this.inputValue = ''
      }
      this.inputVisible = false
    },
    showInput() {
      this.inputVisible = true
    },
    publishBlog() {
      let blogData = {
        title: this.title,
        description: this.description,
        tags: this.tags,
        cover: this.cover,
        content: this.html
      }
      if (this.title && this.description && this.tags.length && blogData.content) {
        this.isPublishing = true;
        BlogService.createBlog(blogData).then(rs => {
          if (rs.data.status === 200) {
            this.$message.success('发布成功')
            this.$emit('publishSuccess')
          } else {
            this.$message.error('发布失败')
          }
        }).finally(() => {
          this.isPublishing = false
        })
      } else {
        this.$message.warning('博客数据不全,请完善后再发表')
      }
    },
  },
  beforeDestroy() {
    if (this.editor) this.editor.destroy()
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.el-tag+.el-tag {
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
