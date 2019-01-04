<template>
  <el-main v-loading="loading">
    <div class="select">
      <el-select @change="selectIt" v-model="value" clearable placeholder="分类筛选">
        <el-option
          v-for="item in categories"
          :key="item.name"
          :label="item.label"
          :value="item.name">
        </el-option>
      </el-select>
    </div>
    <Card :title="cardVal" :showCount="true" :count="count">
      <el-table
        :data="articleList"
        stripe
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="220">
        </el-table-column>
        <el-table-column
          prop="user.username"
          label="作者"
          width="180">
        </el-table-column>
        <el-table-column
          prop="addTime"
          width="180"
          label="发表时间">
        </el-table-column>
        <el-table-column
          prop="category.name"
          label="所属分类"
          width="180">
        </el-table-column>
        <el-table-column
          prop="views"
          width="120"
          label="阅读量">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="topClick(scope.row)" type="text" size="small">置顶</el-button>
            <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="hah-block" v-show="articleList.length">
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
    <Dialog title="确定要删除该篇文章吗?" :showFlag="showFlag" @cancel="cancel" @confirm="confirm"></Dialog>
    <router-view></router-view>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  import Dialog from 'base/dialog/dialog'
  import qs from 'qs'
  axios.defaults.withCredentials = true;
  export default {
    data() {
      return {
        articleList: [],
        showFlag: false,
        currentId: 0,
        limit: 0,
        currentPage: 1,
        count: 0,
        pages: 0,
        loading: true,
        categories: [],
        value: ''
      }
    },
    computed:{
      cardVal(){
        return this.value ? this.value : '全部文章';
      }
    },
    created(){
      this.getAllCategories();
      this.selectIt('',this.currentPage);
    },
    methods:{
      normalizeTime(blogs){
        blogs.forEach((blog) => {
          var date = new Date(Number(blog.addTime));
          var y = date.getFullYear();
          var mon = date.getMonth() + 1;
          var d = date.getDate();
          var h = this._pad(date.getHours());
          var m = this._pad(date.getMinutes());
          var s = this._pad(date.getSeconds());
          var res = y + '-' + mon + '-' + d + ' ' + h + ':' + m + ':' + s;
          blog.addTime = res;
        })
        return blogs
      },
      getAllCategories(){
        var url = 'http://localhost:3000/admin/categories';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.categories = res.data.categories;
          }
        })
      },
      _pad(time){
        var len = time.toString().length;
        var n = 2;
        if(len < n){
          time = '0' + time;
          len ++;
        }
        return time;
      },
      editClick(item){
        this.$router.push({
          path: `/articleList/${item._id}`,
          query: {item: item}
        })
      },
      delClick(item){
        this.showFlag = true;
        this.currentId = item._id;
      },
      topClick(item){
        var url = 'http://localhost:3000/admin/zhiDing';
        var data = {
          addTime: Date.now(),
          id: item._id,
          isTop: true
        };
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
          }
        })
      },
      currentChange(current){
        this.currentPage = current;
        if(this.value === ''){
          this.selectIt('',this.currentPage);
        }else{
          this.selectIt(this.value,this.currentPage);
        }
      },
      prev(){
        this.currentPage --;
        if(this.value === ''){
          this.selectIt('',this.currentPage);
        }else{
          this.selectIt(this.value,this.currentPage);
        }
      },
      next(){
        this.currentPage ++;
        if(this.value === ''){
          this.selectIt('',this.currentPage);
        }else{
          this.selectIt(this.value,this.currentPage);
        }
      },
      confirm(){
        var url = 'http://localhost:3000/admin/deleteArticle?id=' + this.currentId;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.showFlag = false;
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'success'
            });
            this.currentPage = 1;
            this.selectIt('',1);
          }
        })
      },
      cancel(){
        this.showFlag = false;
      },
      selectIt(item,page){
        var url = '';
        if(item === ''){
          url = 'http://localhost:3000/admin/selectCate?page=' + page;
        }else{
          url = 'http://localhost:3000/admin/selectCate?cateName=' + item + '&page=' + page;
        }
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.loading = false;
            this.count = res.data.count;
            this.limit = res.data.limit;
            this.pages = res.data.pages;
            this.articleList = this.normalizeTime(res.data.blogs);
          }else if(res.data.code === -1){
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'warning'
            });
            return;
          }
        })
      }
    },
    components:{
      Card,
      Dialog
    }
  }
</script>

<style lang="stylus" scoped>
  .select
    position: relative;
    top: 47px;
    left: 150px;
  .el-table .cell
    white-space: nowrap
    text-align: center
  .hah-block
    text-align: center;
    margin-top: 20px;
</style>
