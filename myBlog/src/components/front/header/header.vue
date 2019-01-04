<template>
  <div class="header">
    <div class="header-logo">
      <img src="../../../common/image/logo.png" width="130" height="40" alt="">
    </div>
    <ul class="nav">
      <li class="nav-item">
        <router-link to="/index">首页</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/blog">博客</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/essay">随笔</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/message">留言</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/links">友链</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/about">关于</router-link>
      </li>
    </ul>
    <ul class="user-operator" v-if="login === 0">
      <router-link tag="li" to="/reg">
        <span class="user-item">注册</span>
      </router-link>
      <router-link tag="li" to="/login">
        <span class="user-item">登录</span>
      </router-link>
    </ul>
    <div class="login-user" v-if="login === 1">
      <img class="login-avatar" width="40" height="40" style="border-radius: 50%;" :src="`${avatarUrl}${avatar}`" alt="">
      <span class="user-username">{{username}}</span>
      <span class="user-setAvatar" @click="setAvatar">更换头像</span>
      <span class="exitItem" @click="exitItem">退出</span>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        avatarUrl: 'http://localhost:3000/avatar/',
        login: 0,
        avatar: '',
        username: ''
      }
    },
    created(){
      var session = JSON.parse(sessionStorage.getItem('userInfo'));
      if(session){
        this.login = session.login;
        this.avatar = session.avatar || '';
        this.username = session.username || '';
      }else{
        this.login = 0;
      }
    },
    methods:{
      exitItem(){
        axios.get('http://localhost:3000/api/exit').then(res => {
          if(res.data.code === 0){
            sessionStorage.removeItem('userInfo');
            var session = {
              login: 0
            }
            sessionStorage.setItem('userInfo',JSON.stringify(session));
            this.login = JSON.parse(sessionStorage.getItem('userInfo')).login;
            this.$message.success({
              message: '慢走不送',
              duration: 1000
            })
          }
        })
      },
      setAvatar(){
        this.$router.push('/setAvatar');
      }
    }
  }
</script>

<style scoped>
  .header{
    width: 100%;
    min-height: 60px;
    position: fixed;
    background-color: rgba(255,255,255,1);
    z-index: 100;
    top: 0;
    left: 0;
    border-bottom: 1px solid #e8e9e7;
    font-size: 14px;
  }

  .header-logo{
    text-align: center;
    position: absolute;
    left: 10%;
    top: 20%;
  }

  .nav{
    position: absolute;
    left: 30%;
    display: flex;
    text-align: center;
    line-height: 60px;
  }

  .nav-item{
    padding: 0 5px;
  }

  .nav-item a{
    color: #212220;
    padding: 20px 28px;
  }

  .nav-item a:hover{
    color: #6bc30d;
    border-bottom: 2px solid #6bc30d;
    transition: all 0.2s;
  }

  .nav-item a.router-link-exact-active{
    color: #6bc30d;
    border-bottom: 2px solid #6bc30d;
  }

  .user-operator{
    position: absolute;
    right: 10%;
    display: flex;
    line-height: 60px;
  }

  .user-item{
    flex: 1;
    padding: 4px 5px;
    cursor: pointer;
    color: #212220;
    font-weight: 400;
    font-size: 15px;
    text-shadow: 0 1px 0 rgba(255,255,255,.2);
  }

  .user-item:hover{
    color: dodgerblue;
  }
  .login-user{
    position: absolute;
    right: 30px;
    line-height: 60px;
    font-size: 15px;
  }
  .login-user>span:hover{
    color: #6CE26C;
    cursor: pointer;
  }
  .login-user>span{
    padding-right: 10px;
  }
  .login-avatar{
    position: absolute;
    top: 10px;
    right: 185px;
  }
  .user-username{
    color: dodgerblue;
  }
</style>
