<template>
  <div class="replacebody">
    <div class="bg">
      <div class="header">
        <div class="title">MyBlog - 欢迎注册</div>
      </div>
      <div class="content">
        <h1 class="con-title">Register</h1>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="80px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="ruleForm2.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btn">
              <el-button type="success" @click="submitForm('ruleForm2')">注册</el-button>
              <el-button type="info" @click="goback">返回</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  // 这里设置是为了让后端保持 session 状态
  axios.defaults.withCredentials=true;
  export default {
    data(){
      var validateUser = (rule, value, callback) => {
        var reg = /^[\u4e00-\u9fa5\w]{2,10}$/;
        if(value === ''){
          callback(new Error('用户名不能为空'));
        }else if(value.length < 2 || value.length > 10){
          callback(new Error('长度必须在2-10之间'));
        }else if(!reg.test(value)){
          callback(new Error('只能包含数字、字母、中文、下划线'));
        }
        callback();
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          username: ''
        },
        rules2: {
          username: [
            { required: true, validator: validateUser, trigger: 'blur'}
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var url = 'http://localhost:3000/api/reg';
            var data = {
              username: this.ruleForm2.username,
              password: this.ruleForm2.pass,
              addTime: Date.now()
            }
            axios.post(url,qs.stringify(data)).then(res => {
              if(res.data.code === -1){
                this.$message({
                  message: '用户名已被占用!',
                  duration: 1000,
                  type: 'error'
                });
                return;
              }else if(res.data.code === 0){
                this.$message({
                  message: '恭喜你,注册成功!',
                  duration: 1000,
                  type: 'success'
                });
                setTimeout(() => {
                  this.$router.push('/login');
                },1000)
              }
            })
          } else {
            this.$message({
              message: '请填写正确信息!',
              duration: 1000,
              type: 'warning'
            });
            return false;
          }
        });
      },
      goback(){
        this.$router.push('/index');
      }
    }
  }

</script>

<style lang="stylus">
  html,body,#app
    height: 100%;
    margin: 0;
    padding: 0;
    .replacebody
      width: 100%
      height: 100%
      background-image: url('../../common/image/bg1.jpg') !important
      background-size: 1368px 663px;
      background-repeat: no-repeat;
      .bg
        height: 100%
        .header
          width: 100%;
          .title
            font-size: 30px
            margin-left: 50px
            padding-top: 30px
            color: #BFEFFF
        .content
          width: 400px
          height: 500px
          border: 1px dashed #ccc;
          border-radius: 10px
          position: absolute
          top: 70px
          right: 80px
          .con-title
            font-size: 30px
            position: absolute
            top: 15%;
            left: 50%
            transform: translateX(-50%);
            color: #BFEFFF
          .el-form
            position: absolute;
            top: 35%;
            left: 10%;
            .el-form-item__label
              color: #fff;
</style>
