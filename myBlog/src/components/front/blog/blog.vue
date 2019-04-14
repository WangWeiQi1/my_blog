<template>
  <div class="x-body" ref="blogBody">
    <div class="container">
      <div class="leftFiled">
        <transition-group name="fade" appear mode="out-in" tag="ul">
          <li class="blogList" v-for="blog in blogList" v-loading="loading" :key="blog._id">
            <span class="topList-flag" v-show="blog.isTop">置顶</span>
            <div class="blog-title">
              <span class="typeBlog">【{{blog.blogType}}】</span>
              <span class="spanToDetail" @click="goDetail(blog)">{{blog.title}}</span>
            </div>
            <div class="blog-description">
              <div class="coverImage">
                <img style="border:1px solid #ccc;border-radius: 4px;" width="302" height="220" v-lazy="`${coverImgUrl}${blog.coverImg}`" alt="">
              </div>
              <div class="coverDesc">{{blog.description}}</div>
            </div>
            <div class="blog-time">
              {{blog.addTime}}
            </div>
            <div class="continueRead">
              <span class="readMore" @click="goDetail(blog)">继续阅读</span>
            </div>
            <div class="blog-footer">
              <div class="bl">
                <span class="iconfont icon-biaoqiantags3"></span>
                <a class="blog-category">{{blog.category.name}}</a>
              </div>
              <div class="fr">
                <span class="views">
                  <i class="el-icon-view"></i>
                  <span class="num">{{blog.views}}</span>
                </span>
                <span class="comments">
                  <i class="iconfont icon-chat"></i>
                  <span class="cnum">{{blog.comments.length}}</span>
                </span>
              </div>
            </div>
          </li>
        </transition-group>
        <div class="fenye">
          <FenYe :data="blogList"
                 @prevClick="prev"
                 @nextClick="next"
                 @currentChange="currentChange"
                 :currentPage="currentPage"
                 :count="count"
                 :limit="limit"></FenYe>
        </div>
      </div>
      <div class="rightFiled">
        <div class="search-box">
          <div class="search">
            <input v-model="query" style="border:none;outline:none;font-size:16px;color:#787977;" type="text" placeholder="输入文章标题关键字">
            <i class="searchIcon el-icon-search"></i>
          </div>
        </div>
        <ul class="searchResList" v-show="searchRes.length">
          <p class="searchResDesc">搜索结果</p>
          <transition-group name="fadeSearch">
            <li @click="toItemLink(blog)" class="searchResItem" v-for="blog in searchRes" :key="blog._id">{{blog.title}}</li>
          </transition-group>
        </ul>
        <div v-show="!query">
          <ul class="categoryList">
            <li @click="showAll" :class="showItem">全部文章</li>
            <li @click="showCategory(item,index)" v-for="(item,index) in categories" :key="item._id" :class="{'current': currentIndex === index}">{{item.name}}</li>
          </ul>
          <div class="hot-rank-list" v-show="hotArr.length">
            <div class="hot-blog-title-filed">
              <h1 class="hot-blog-title">热门文章</h1>
              <RankList :data="hotArr" @select="selectItem"></RankList>
            </div>
          </div>
          <div class="top-rank-list" v-show="topArr.length">
            <div class="top-blog-title-filed">
              <h1 class="top-blog-title">置顶推荐</h1>
              <RankList :data="topArr" @select="selectItem"></RankList>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="slowFade">
      <div class="nothing-container" v-show="showNothing">
        <div class="nothing-box">
          <img class="nothing-img" src="../../../common/image/erha.jpg" alt="">
          <p class="nothing-desc">该分类下暂时还没发表过文章~</p>
        </div>
      </div>
    </transition>
    <GoTop :showFlag="showFlag" @goToTop="goToTop"></GoTop>
    <router-view></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import {formatTime} from 'common/js/utils'
  axios.defaults.withCredentials = true;
  import FenYe from 'base/fenye/fenye'
  import RankList from 'base/rankList/rankList'
  import GoTop from 'base/goTop/goTop'
  export default {
    data(){
      return {
        blogList: [],
        categories: [],
        currentPage: 1,
        cover: '',
        coverImgUrl: 'http://localhost:3000/cover/',
        currentIndex: -1,
        count: 0,
        limit: 0,
        value: '',
        loading: true,
        hotArr: [],
        topArr: [],
        showFlag: false,
        scrollTop: 0,
        showNothing: false,
        query: '',
        searchRes: []
      }
    },
    created(){
      this.getAllArticles('',1);
      this.getAllCategories();
      this.getHotArticles();
      this.getTopArticles();
    },
    mounted(){
      window.addEventListener('scroll', this.handleScroll, true);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll, true);   //  在事件捕获阶段就清除掉
    },
    computed:{
      showItem(){
        return this.currentIndex === -1 ? 'current' : '';
      }
    },
    watch:{
      currentPage(newPage){
        this.$refs.blogBody.scrollTop = 0;
      },
      currentIndex(newIndex){
        this.$refs.blogBody.scrollTop = 0;
      },
      query(newQuery) {
        if(newQuery) {
          this.searchItemByQuery(newQuery);
        }
        if(newQuery === '') {
          this.searchRes = [];
        }
      }
    },
    methods:{
      getAllArticles(item,page){
        this.loading = true;
        var url = '';
        if(this.currentIndex === -1){
          url = 'http://localhost:3000/admin/selectCate?page=' + page;
        }else{
          url = 'http://localhost:3000/admin/selectCate?cateName=' + item.name + '&page=' + page;
        }
        axios.get(url).then(res => {
          if(res.data.code === 0){
            if(!res.data.blogs.length) {
              this.showNothing = true;
            } else {
              this.showNothing = false;
            }
            this.count = res.data.count;
            this.limit = res.data.limit;
            this.loading = false;
            this.blogList = this.normalizeTime(res.data.blogs);
          }
        })
      },
      normalizeTime(blogs){
        let isTopArr = [];
        let isNormalArr = [];
        blogs.forEach((item) => {
          if(item.isTop) {
            isTopArr.push(item);
          } else {
            isNormalArr.push(item);
          }
        })
        isTopArr.sort((a, b) => {
          return b.addTime - a.addTime;
        })
        isNormalArr.sort((a, b) => {
          return b.addTime - a.addTime;
        })
        blogs = isTopArr.concat(isNormalArr);
        blogs.forEach((item) => {
          var res = formatTime(Number(item.addTime));
          item.addTime = res;
        })
        return blogs;
      },
      getAllCategories(){
        var url = 'http://localhost:3000/admin/categories';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.categories = res.data.categories;
          }
        })
      },
      showCategory(item,index){
        this.currentIndex = index;
        this.currentPage = 1;
        this.value = item;
        this.getAllArticles(item,this.currentPage)
      },
      showAll(){
        this.currentIndex = -1;
        this.getAllArticles('',1);
      },
      prev(){
        this.currentPage --;
        if(this.currentPage === -1){
          this.getAllArticles('',this.currentPage);
        }else{
          this.getAllArticles(this.value,this.currentPage)
        }
      },
      next(){
        this.currentPage ++;
        if(this.currentPage === -1){
          this.getAllArticles('',this.currentPage);
        }else{
          this.getAllArticles(this.value,this.currentPage)
        }
      },
      currentChange(current){
        this.currentPage = current;
        if(this.currentPage === -1){
          this.getAllArticles('',this.currentPage);
        }else{
          this.getAllArticles(this.value,this.currentPage)
        }
      },
      goDetail(blog){
        this.$router.push({
          path: `/blog/${blog._id}`
        })
      },
      getHotArticles(){
        var url = 'http://localhost:3000/getHotArticles';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.hotArr = res.data.blogs;
          }
        })
      },
      getTopArticles(){
        var url = 'http://localhost:3000/getTopArticles';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.topArr = res.data.blogs;
          }
        })
      },
      selectItem(item){
        this.goDetail(item);
      },
      handleScroll(e){
        this.scrollTop = this.$refs.blogBody.scrollTop;
        if(this.scrollTop <= 0) {
          clearInterval(this.timer);
        }
        const client_height = document.body.clientHeight || document.documentElement.clientHeight;
        if(this.scrollTop > client_height){
          this.showFlag = true;
        }else {
          this.showFlag = false;
        }
      },
      goToTop(){
        if(this.$refs.blogBody.scrollTop > 0) {
          this.timer = setInterval(() => {
            this.$refs.blogBody.scrollTop -= 100;
          }, 20)
        }
      },
      searchItemByQuery(newQuery) {
        var url = 'http://localhost:3000/searchLikeIt?search=' + newQuery;
        axios.get(url).then(res => {
          if(res.data.code === 0) {
            this.searchRes = res.data.data;
          }
        })
      },
      toItemLink(blog) {
        this.$router.push(`/blog/${blog._id}`);
      }
    },
    components:{
      FenYe,
      RankList,
      GoTop
    }
  }
</script>

<style scoped>
  .x-body{
    margin-top: 61px;
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url('../../../common/image/bg2.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: scroll;
  }
  .container{
    width: 90%;
    margin: 0 auto;
    position: relative;
    padding-bottom: 100px;
  }
  .leftFiled{
    width: 850px;
  }
  .blogList{
    width: 850px;
    height: 355px;
    padding: 20px 20px;
    position: relative;
    background: #fff;
    top: 20px;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .blog-title{
    line-height: 30px;
    padding: 5px 130px 5px 0;
    border-bottom: 1px solid #e8e9e7;
    font-size: 18px;
    font-weight: 400;
  }
  .spanToDetail{
    color: #212220;
  }
  .spanToDetail:hover{
    color: #6bc30d;
    text-decoration: underline;
    cursor: pointer;
  }
  .blog-time{
    position: absolute;
    right: 10px;
    top: 40px;
    background-color: #fff;
    padding: 0 20px 5px 20px;
    line-height: 32px;
    color: #6bc30d;
  }
  .blog-description{
    margin: 20px 0 0 0;
    line-height: 28px;
    position: relative;
    min-height: 220px;
    display: flex;
    color: #787977;
    font-size: 16px;
  }
  .blog-description .coverDesc{
    padding-left: 20px;
    width: 100%;
  }
  .continueRead{
    height: 40px;
    line-height: 40px;
    position: relative;
    width: 100%;
  }
  .continueRead:before{
    content: " ";
    display: inline-block;
    height: 1px;
    top: 20px;
    left: 100px;
    right: 0;
    position: absolute;
    background-color: #d0d0d0;
  }
  .bl{
    float: left;
  }
  .blog-category{
    display: inline-block;
    font-size: 12px;
    padding: 5px 5px;
    background-color: #f1f2f0;
    color: #787977;
    margin: 2px;
    text-decoration: none;
    -webkit-transition: all .2s;
    transition: all .2s;
  }
  .blog-category:hover{
    background: #6bc30d;
    color: #fff;
  }
  .fr{
    float: right;
    width: 100px;
    margin-top: 6px;
  }
  .num{
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 4px;
    padding-right: 10px;
    font-size: 12px;
    color: #787977;
  }
  .cnum{
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 4px;
    font-size: 12px;
    color: #787977;
  }
  .typeBlog{
    font-size: 16px;
    font-weight: 400;
    color: #2ea7e0;
    vertical-align: bottom;
  }
  .icon-biaoqiantags3{
    font-size: 20px;
    color: #787977;
  }
  .rightFiled{
    width: 303px;
    /*background: #ffffff;*/
    position: absolute;
    top: 20px;
    right: 0;
  }
  .search-box{
    width: 100%;
    height: 80px;
    background: #787977;
  }
  .searchResList {
    width: 100%;
    height: 100%;
    background: rgb(255,255,255);
    border-radius: 10px;
    cursor: pointer;
    margin: 10px 0;
    padding-bottom: 15px;
  }
  .searchResItem {
    color: #787977;
    text-align: center;
    padding: 10px 0;
  }
  .searchResDesc {
    color: #787977;
    padding: 18px 0 0 18px;
  }
  .searchResItem:nth-child(1) {
    padding-top: 20px;
  }
  .searchResItem:nth-last-child(1) {
    padding-bottom: 20px;
  }
  .searchResItem:hover {
    text-decoration: underline;
    color: #6bc30d;
  }
  .fadeSearch-enter-active {
    transition: all 0.4s;
  }
  .fadeSearch-enter {
    opacity: 0;
    transform: translateY(-10px);
  }
  .search{
    width: 260px;
    height: 40px;
    border-radius: 20px;
    background: #ffffff;
    margin: 0 auto;
    position: relative;
    top: 20px;
    text-align: center;
    line-height: 40px;
  }
  .searchIcon{
    cursor: pointer;
  }
  .searchIcon:hover{
    color: #6bc30d;
  }
  .categoryList{
    /*margin-top: 10px;*/
    overflow: hidden;
    background: #ffff; /*111*/
  }
  .categoryList li{
    height: 40px;
    width: 200px;
    line-height: 40px;
    padding: 0 50px;
    color: #787977;
    font-size: 15px;
    cursor: pointer;
  }
  .categoryList li.current{
    background: #F2F2F2;
    border-right: 4px solid #000;
  }
  .categoryList li:hover{
    background: #F2F2F2;
    border-right: 4px solid #000;
  }
  .categoryList li:last-child{
    margin-bottom: 10px;
  }
  .fenye{
    padding-top: 20px;
    text-align: center;
  }
  .readMore{
    font-size: 14px;
    font-weight: bold;
  }
  .readMore:hover{
    color: #6bc30d;
    cursor: pointer;
  }
  .fade-enter-active{
    transition: all 1s;
  }
  .fade-leave-active {
    transition: all 1s;
  }
  .fade-enter{
    opacity: 0;
    display: block;
    transform: translateY(20px);
  }
  .fade-leave-to{
    opacity: 0;
    display: none;
  }
  .hot-rank-list{
    width: 303px;
    background: #fff;
    /*position: absolute;*/
    /*bottom: 1245px;*/
    /*right: 0;*/
    position: relative;
    top: 10px;
    height: 320px;
  }
  .hot-blog-title-filed{
    width: 90%;
    height: 30px;
    margin: 0 auto;
  }
  .hot-blog-title{
    margin: 10px 20px;
    padding: 5px;
    line-height: 30px;
    font-weight: 400;
    border-bottom: 1px solid #e8e9e7;
    color: #383937;
    position: relative;
    font-size: 18px;
  }

  .top-rank-list{
    width: 303px;
    background: #fff;
    position: relative;
    /*bottom: 902px;*/
    /*right: 0;*/
    top: 20px;
    height: 320px;
    /*height: 100%;*/
  }
  .top-blog-title-filed{
    width: 90%;
    height: 30px;
    margin: 0 auto;
  }
  .top-blog-title{
    margin: 10px 20px;
    padding: 5px;
    line-height: 30px;
    font-weight: 400;
    border-bottom: 1px solid #e8e9e7;
    color: #383937;
    position: relative;
    font-size: 18px;
  }
  .topList-flag{
    position: absolute;
    height: 20px;
    line-height: 20px;
    text-align: center;
    width: 74px;
    background-color: #ff5722;
    color: #fff;
    transform: rotate(-45deg);
    left: -18px;
    top: 9px;
  }
  .nothing-container {
    width: 90%;
    margin: 0 auto;
  }
  .nothing-box {
    width: 890px;
    height: 375px;
    background: #fff;
    position: relative;
    top: -100px;
    text-align: center;
  }
  .nothing-img {
    width: 400px;
    height: 250px;
    margin-top: 40px;
  }
  .nothing-desc {
    opacity: .5;
    margin-top: 30px;
  }
  .slowFade-enter-active{
    transition: all 1s;
  }
  .slowFade-enter{
    opacity: 0;
    transform: translateY(20px);
  }
  
</style>
