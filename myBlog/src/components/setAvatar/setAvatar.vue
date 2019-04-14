<template>
  <div v-if="login === 1">
    <div class="bgUpload">
      <h2 class="changeAvatar">更改头像</h2>
      <img class="preAvatar" :src="`${avatarUrl}${avatar}`" alt="">
      <div class="uploadAvatar">
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
          <el-button size="small" type="primary">更改头像</el-button>
        </el-upload>
      </div>
      <el-button class="uploadBtn" type="success" @click="toUpload">确认更改</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        doUpload: 'http://localhost:3000/api/uploadAvatar',
        fileList: [],
        login: 0,
        avatar: '',
        avatarUrl: 'http://localhost:3000/avatar/'
      }
    },
    created(){
      var session = JSON.parse(sessionStorage.getItem('userInfo'));
      this.login = session.login;
      this.avatar = session.avatar;
      this.checkLogin();
    },
    methods:{
      handleAvatarSuccess(res, file) {
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        session.avatar = res.avatar;
        sessionStorage.setItem('userInfo',JSON.stringify(session));
        this.$message.success(res.message);
        setTimeout(() => {
          this.$router.push('/blog');
        },1000)
      },
      toUpload(){
        this.$refs.upload.submit();
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是JPG或PNG格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false;
        }
      },
      checkLogin(){
        if(this.login !== 1){
          this.$message.warning('登录后方可设置头像');
          setTimeout(() => {
            this.$router.push('/blog');
          },1000)
        }
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
  .uploadAvatar{
    position: absolute;
    top: 40%;
    left: 20%;
  }
  .uploadBtn{
    padding: 8px 10px;
    position: absolute;
    top: 40%;
    left: 40%;
  }
  .bgUpload{
    width: 500px;
    height: 500px;
    background: #ccc;
    position: absolute;
    top: 10%;
    left: 10%;
  }
  .changeAvatar{
    position: absolute;
    top: 10%;
    left: 30%;
    font-size: 20px;
  }
  .preAvatar{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    top: 20%;
    left: 32%;
  }

</style>
