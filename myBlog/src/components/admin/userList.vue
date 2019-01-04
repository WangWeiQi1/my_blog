<template>
  <el-main v-loading="loading">
    <Card title="用户列表" :showIt="true" @operator="operator">
      <el-table
        v-loading="loading"
        :data="usersData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="_id"
          label="ID"
          width="300">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="220">
        </el-table-column>
        <el-table-column
          prop="isAdmin"
          label="是否为管理员"
          width="220">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="注册日期"
          width="220">
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="_id"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-show="usersData.length">
        <span class="demonstration"></span>
        <el-pagination
          layout="prev, pager, next"
          @next-click="next"
          @prev-click="prev"
          @current-change="currentChange"
          :page-size="limit"
          :current-page="currentPage"
          :total="count">
        </el-pagination>
        <!--page-size 表示每页显示条数-->
        <!--total 表示数据总数-->
      </div>
    </Card>
    <Dialog title="确定要删除该用户吗?" :showFlag="showFlag" @confirm="confirm" @cancel="cancel"></Dialog>
  </el-main>
</template>

<script>
  import axios from 'axios'
  import Dialog from 'base/dialog/dialog'
  import Card from 'base/card/card'
  axios.defaults.withCredentials = true;
  export default {
    data() {
      return {
        usersData: [],
        currentPage: 1,
        count: 0,
        limit: 0,
        pages: 0,
        currentId: 0,
        showFlag: false,
        loading: true
      }
    },
    created(){
      this.getAllUsers(this.currentPage);
    },
    methods:{
      getAllUsers(page){
        var url = 'http://localhost:3000/admin/allUsers?page=' + page;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.loading = false;
            this.count = res.data.count;
            this.limit = res.data.limit;
            this.pages = res.data.pages;
            this.usersData = this.normalizeUsers(res.data.users);
          }
        })
      },
      handleDel(item){
        this.currentId = item._id;
        this.showFlag = true;
      },
      cancel(){
        this.showFlag = false;
      },
      confirm(){
        var url = 'http://localhost:3000/admin/deleteUser?id=' + this.currentId;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.showFlag = false;
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'success'
            });
            this.currentChange(this.currentPage);
          }
        })
      },
      prev(){
        this.currentPage --;
        this.getAllUsers(this.currentPage);
      },
      next(){
        this.currentPage ++;
        this.getAllUsers(this.currentPage);
      },
      currentChange(current){
        this.currentPage = current;
        this.getAllUsers(this.currentPage);
      },
      operator(){
        this.$router.push('/addUsers');
      },
      normalizeUsers(users){
        var userList = users;
        for(var i=0;i<userList.length;i++){
          if(userList[i].isAdmin){
            userList[i].isAdmin = '是';
          }else{
            userList[i].isAdmin = '否';
          }
          var num = Number(userList[i].addTime);
          var date = new Date(num);
          var y = date.getFullYear();
          var M = date.getMonth() + 1;
          var d = date.getDate();
          var da = y + '-' + M + '-' + d;
          userList[i].addTime = da;
        }
        return userList;
      }
    },
    components:{
      Dialog,
      Card
    }
  }
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .block{
    text-align: center;
    margin-top: 20px;
  }
</style>
