<template>
  <el-main>
    <Card title="添加用户">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" placeholder="请输入用户名" v-model="ruleForm2.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" placeholder="请再次输入密码" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn">
            <el-button type="success" @click="submitForm('ruleForm2')">添加</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-switch
        v-model="value"
        active-color="#13ce66"
        active-text="管理员"
        inactive-text="普通用户"
        inactive-color="#ccc">
      </el-switch>
      <div class="nothing"></div>
    </Card>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
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
        value: false,
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
            var url = 'http://localhost:3000/admin/addUsers';
            var data = {
              username: this.ruleForm2.username,
              password: this.ruleForm2.pass,
              isAdmin: this.value,
              addTime: Date.now()
            }
            axios.post(url,qs.stringify(data)).then(res => {
              if(res.data.code === -1){
                this.$message({
                  message: res.data.message,
                  duration: 1000,
                  type: 'error'
                });
                return;
              }else if(res.data.code === 0){
                this.$message({
                  message: res.data.message,
                  duration: 1000,
                  type: 'success'
                });
                this.ruleForm2.pass = '';
                this.ruleForm2.checkPass = '';
                this.ruleForm2.username = '';
              }
            })
          } else {
            this.$message({
              message: '请先补全信息!',
              duration: 1000,
              type: 'warning'
            });
            return false;
          }
        });
      }
    },
    components:{
      Card
    }
  }
</script>

<style lang="stylus">
  .el-form
    width: 500px;
    position: relative;
    .el-button
      position: absolute;
      left: 60%;
  .el-switch
    position: absolute;
    left: 25%;
    top: 53%;
  .nothing
    margin-bottom: 100px
</style>
