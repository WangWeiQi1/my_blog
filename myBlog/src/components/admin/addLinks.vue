<template>
  <el-main>
    <Card title="添加友链">
      <div class="links-name">
        <el-input v-model="input" placeholder="请输入名称" clearable></el-input>
      </div>
      <div class="links-link">
        <el-input v-model="link" placeholder="请输入链接"></el-input>
      </div>
      <div class="links-desc">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入描述"
          v-model="textarea">
        </el-input>
      </div>
      <div class="links-avatar">
        <el-upload
          :with-credentials="true"
          :action="doUpload"
          ref="upload"
          :limit="1"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :on-success="handleAvatarSuccess"
          list-type="picture"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" type="primary">上传图标</el-button>
        </el-upload>
      </div>
      <div class="add-links">
        <el-button size="small" type="success" @click="addLinks">添加友链</el-button>
      </div>
    </Card>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        input: '',
        textarea: '',
        link: '',
        doUpload: 'http://localhost:3000/addLinks',
        fileList: []
      }
    },
    methods:{
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传图标只能是JPG或PNG格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图标大小不能超过 2MB!');
          return false;
        }
        let fd = new FormData();
        fd.append('file',file);
        fd.append('name',this.input);
        fd.append('desc',this.textarea);
        fd.append('link',this.link);
        axios.post(this.doUpload,fd).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.input = '';
            this.textarea = '';
            this.link = '';
          }
        })
      },
      addLinks(){
        if(this.input === ''){
          this.$message.warning({
            message: '名称不能为空',
            duration: 1000
          })
          return;
        }
        if(this.link === ''){
          this.$message.warning({
            message: '链接不能为空',
            duration: 1000
          })
          return;
        }
        if(this.textarea === ''){
          this.$message.warning({
            message: '描述不能为空',
            duration: 1000
          })
          return;
        }
        this.$refs.upload.submit();
      },
      handlePreview(){

      },
      handleRemove(){

      },
      handleAvatarSuccess(res, file) {

      }
    },
    components:{
      Card
    }
  }
</script>

<style scoped>
  .links-name{
    padding: 20px 0;
    width: 50%;
  }
  .links-link{
    width: 50%;
    padding-bottom: 20px;
  }
  .links-desc{
    padding: 0 0 20px 0;
    width: 60%;
  }
  .links-avatar{
    position: relative;
    left: 52%;
    bottom: 190px;
    width: 20%;
    height: 40px;
  }
</style>
