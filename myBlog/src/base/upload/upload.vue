<template>
  <div>
    用户名:<input type="text" v-model="username">
    密码: <input type="password" v-model="password">
    <el-upload
      :with-credentials="true"
      :action="doUpload"
      ref="upload"
      :limit="1"
      :auto-upload="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList2"
      :on-success="handleAvatarSuccess"
      list-type="picture"
      :before-upload="beforeAvatarUpload">
      <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-button @click="toUpload">点击上传</el-button>
    <img v-if="avatar" :src="showAvatar" alt="">
  </div>
</template>

<script>
  import axios from 'axios'
  axios.default.withCredentials = true;
  import qs from 'qs'
  export default {
    data() {
      return {
        url: 'http://localhost:3000/avatar/',
        username: '',
        password: '',
        imageUrl: '',
        doUpload: 'http://localhost:3000/api/upload',
        fileList2: [],
        avatar: ''
      }
    },
    computed:{
      showAvatar(){
        return this.url + this.avatar;
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      toUpload(){
        this.$refs.upload.submit();
      },
      beforeAvatarUpload(file) {
        let fd = new FormData();
        fd.append('file',file);
        fd.append('name',this.username);
        fd.append('pass',this.password);
        axios.post(this.doUpload,fd).then(res => {
          this.avatar = res.data.avatar;
          console.log(this.avatar)
        })
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      handlePreview(file){
        console.log(file)
      },
      handleRemove(file){
        console.log(file)
      }
    }
  }
</script>

<style>

</style>
