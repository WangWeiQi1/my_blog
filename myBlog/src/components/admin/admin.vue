<template>
  <div class="index" v-show="userInfo.isAdmin">
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <router-link tag="div" class="top-text" to="/admin_index">
          <h1 class="title">MyBlog - 管理系统</h1>
        </router-link>
        <el-menu :default-openeds="['2','3']" router background-color="#545c64" text-color="#fff">
          <el-submenu index="1">
            <template slot="title"><i class="iconfont icon-gerentouxiang"></i>用户管理</template>
            <el-menu-item index="userList">用户列表</el-menu-item>
            <el-menu-item index="addUsers">添加用户</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>文章管理</template>
            <el-menu-item index="articleList">全部文章</el-menu-item>
            <el-menu-item index="addArticles">添加文章</el-menu-item>
            <el-menu-item index="essayList">全部随笔</el-menu-item>
            <el-menu-item index="addEssays">添加随笔</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>分类管理</template>
            <el-menu-item index="categoryList">全部分类</el-menu-item>
            <el-menu-item index="addCategories">添加分类</el-menu-item>
            <el-menu-item index="linkList">全部友链</el-menu-item>
            <el-menu-item index="addLinks">添加友链</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="logout">退出系统</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>欢迎您,{{userInfo.username}}</span>
        </el-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  axios.defaults.withCredentials=true;
  export default {
    data() {
      return {
        userInfo: {}
      }
    },
    created() {
      this.getUserInfo();
    },
    methods:{
      getUserInfo(){
        var url = 'http://localhost:3000/api/checkUser';
        axios.get(url).then(res => {
          this.userInfo = res.data;
          if(res.data.code === 0){
            if(res.data.isAdmin){
//              this.userInfo = res.data;
              this.$message({
                showClose: true,
                duration: 1000,
                message: res.data.message,
                type: 'success'
              });
            }
          }else if(res.data.code === -2){
            this.$message({
              showClose: true,
              duration: 1000,
              message: res.data.message,
              type: 'error'
            });
            setTimeout(() => {
              this.$router.push('/blog');
            },1000)
          }else if(res.data.code === -1){
            this.$message({
              showClose: true,
              duration: 1000,
              message: res.data.message,
              type: 'error'
            });
            setTimeout(() => {
              this.$router.push('/blog');
            },1000)
          }
        })
      },
      logout(){
        axios.get('http://localhost:3000/api/exit').then(res => {
          if(res.data.code === 0){
            sessionStorage.removeItem('userInfo');
            var session = {
              login: 0
            }
            sessionStorage.setItem('userInfo',JSON.stringify(session));
            this.$message.success({
              message: '慢走不送',
              duration: 1000
            })
            this.$router.push('/blog');
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  html,body,#app,.index
    height: 100%;
    .el-container
      height: 100% !important;
      .el-header
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
      .el-aside
        background-color: #545c64 !important;
        .top-text
          text-align: center;
          padding: 40px 0;
          background-color: #333;
          cursor: pointer;
          .title
            color: #fff;
            font-weight: blod;
        .el-menu
          border-right: 0;
</style>
