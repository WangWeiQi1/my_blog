<template>
  <el-main v-loading="loading">
    <card title="全部分类">
      <el-table
        :data="categories"
        stripe
        style="width: 100%">
        <el-table-column
          prop="_id"
          label="ID"
          width="300">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="editCate(scope.row)" type="text" size="small">修改</el-button>
            <el-button type="text" size="small" @click="delCate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="EL-block" v-show="categories.length">
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
    </card>
    <Dialog title="确定要删除该分类吗?" :showFlag="showFlag" @confirm="confirm" @cancel="cancel"></Dialog>
    <router-view></router-view>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  import Dialog from 'base/dialog/dialog'
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        categories: [],
        showFlag: false,
        currentId: 0,
        currentPage: 1,
        count: 0,
        limit: 0,
        pages: 0,
        loading: true
      }
    },
    created(){
      this.getAllCategories(this.currentPage);
    },
    methods:{
      editCate(item){
        this.$router.push({
          path: `/categoryList/${item._id}`,
          query: {cateName: item.name}
        })
      },
      delCate(item){
        this.currentId = item._id;
        this.showFlag = true;
      },
      getAllCategories(page){
        var url = 'http://localhost:3000/admin/allCategories?page=' + page;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.loading = false;
            this.count = res.data.count;
            this.limit = res.data.limit;
            this.pages = res.data.pages;
            this.categories = this.normalizeTime(res.data.categories);
          }
        })
      },
      normalizeTime(categories){
        for(var i=0;i<categories.length;i++){
          var num = Number(categories[i].addTime);
          var date = new Date(num);
          var y = date.getFullYear();
          var mon = date.getMonth() + 1;
          var d = date.getDate();
          var h = this._pad(date.getHours());
          var m = this._pad(date.getMinutes());
          var s = this._pad(date.getSeconds());
          var res = y + '-' + mon + '-' + d + ' ' + h + ':' + m + ':' + s;
          categories[i].addTime = res;
        }
        return categories;
      },
      _pad(time){
        var len = time.toString().length;
        let n = 2;
        if(len < n){
          time = '0' + time;
          len++;
        }
        return time;
      },
      currentChange(current){
        this.currentPage = current;
        this.getAllCategories(this.currentPage);
      },
      prev(){
        this.currentPage --;
        this.getAllCategories(this.currentPage);
      },
      next(){
        this.currentPage ++;
        this.getAllCategories(this.currentPage);
      },
      confirm(){
        var url = 'http://localhost:3000/admin/deleteCate?id=' + this.currentId;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'success'
            });
            this.showFlag = false;
            this.currentChange(this.currentPage);
          }
        })
      },
      cancel(){
        this.showFlag = false;
      }
    },
    components:{
      Card,
      Dialog
    }
  }
</script>

<style>
  .EL-block{
    text-align: center;
    margin-top: 20px;
  }
</style>
