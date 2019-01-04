<template>
  <div>
    <div id="menu" class="hover_animation menu_open" data-mark="false">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div id="navgation" class="navgation navgation_close">
      <ul class="point">
        <li><router-link to="/blog">博客</router-link></li>
        <li><router-link to="/message">留言</router-link></li>
        <li><router-link to="/about">关于</router-link></li>
      </ul>
    </div>
    <div class="section" id="section1">
      <div class="fp-tablecell">
        <div class="page1">
          <div class="nav wow zoomIn" data-wow-duration="2s">
            <h1 class="h1-title">平凡博客</h1>
            <p>虽生而平凡，不甘于平凡</p>
            <router-link tag="a" class="layui-btn layui-btn-normal" style="margin-top: 20px" to="/blog">Enter Blog</router-link>
          </div>
          <a class="next wow fadeInUp" data-wow-duration="2s" id="next"></a>
        </div>
      </div>
    </div>
    <div class="section" id="section2">
      <div class="fp-tablecell">
        <div class="page2">
          <div class="warp-box">
            <div class="new-article">
              <div class="inner wow fadeInDown" data-wow-delay=".2s">
                <h1>热门文章</h1>
                <p>
                  很想给你写封信,告诉你这里的天气.
                  <br>昨夜的那场电影,还有我的心情.
                </p>
              </div>
            </div>
            <div class="layui-row">
              <div class="layui-col-xs12 layui-col-sm4 layui-col-md4  wow fadeInUp" style="padding: 0 10px;" v-for="item in hotArr">
                <div class="single-news">
                  <div class="news-head">
                    <img :src="`${coverImgUrl}${item.coverImg}`" alt="">
                    <a style="cursor: pointer;" @click="toBlogDetail(item)" class="link"><i class="fa fa-link"></i></a>
                  </div>
                  <div class="news-content">
                    <h4>
                      <a style="cursor: pointer;" @click="toBlogDetail(item)">
                        {{item.title}}
                      </a>
                    </h4>
                    <div class="date">
                      {{item.addTime}}
                    </div>
                    <p>
                      {{item.description}}
                    </p>
                    <a style="cursor: pointer;" class="btn" @click="toBlogDetail(item)">
                      阅读更多
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section" id="section3">
      <div class="fp-tablecell">
        <div class="page3">
          <div class="warp-box">
            <div class="warp">
              <div class="inner">
                <div class="links">
                  <ul>
                    <li class="wow fadeInLeft">
                      <router-link tag="a" to="/about">关于</router-link>
                    </li>
                    <li class="wow fadeInRight">
                      <router-link tag="a" to="/links">友情链接</router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section" id="section4">
      <div class="fp-tablecell">
        <div class="page4">
          <div class="warp-box">
            <div class="about">
              <div class="inner">
                <h1 class="wow fadeInLeft">次元使者</h1>
                <p class="wow fadeInRight">
                  爱好游戏，音乐。闲来无事喜欢在一些不健康的场所虚度光阴，撸起代码就会废寝忘食。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer wow fadeInUp" id="contact">
      <div class="footer-top">
        <div class="container">
          <div class="layui-row">
            <div class="layui-col-xs12 layui-col-sm6 layui-col-md4">
              <div class="single-widget about">
                <div class="footer-logo">
                  <h2>平凡博客</h2>
                </div>
                <p>虽生而平凡，不甘于平凡</p>
                <div class="button">
                </div>
              </div>
            </div>
            <div class="layui-col-xs12 layui-col-sm6 layui-col-md4">
              <div class="single-widget">
                <h2>相关链接</h2>
                <ul class="social-icon">
                  <li class="active"><router-link to="/blog"><i class="fa fa-book"></i>博文</router-link></li>
                  <li class="active"><router-link to="/message"><i class="fa fa-comments"></i>留言</router-link></li>
                  <li class="active"><router-link to="/about"><i class="fa fa-share"></i>关于</router-link></li>
                  <li class="active"><router-link to="/essay"><i class="fa fa-snowflake-o"></i>随笔</router-link></li>
                </ul>
              </div>
            </div>
            <div class="layui-col-xs12 layui-col-sm12 layui-col-md4">
              <div class="single-widget contact">
                <h2>联系我</h2>
                <ul class="list">
                  <li><i class="fa fa-map"></i>地址: 黑龙江省哈尔滨市</li>
                  <li><i class="fa fa-qq"></i>QQ: 1755592727 </li>
                  <li><i class="fa fa-envelope"></i>邮箱: 1755592727@qq.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import axios from 'axios'
  axios.defaults.withCredentials=true;
  import {normalizeTime} from 'common/js/essays'
  export default {
    data(){
      return{
        hotArr: [],
        coverImgUrl: 'http://localhost:3000/cover/'
      }
    },
    created(){
      this.getHotArticles();
    },
    methods:{
      getHotArticles(){
        var url = 'http://localhost:3000/getHotArticles';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.hotArr = this.formatTime(res.data.blogs.slice(0,3));
          }
        })
      },
      toBlogDetail(item){
        this.$router.push({
          path: `/blog/${item._id}`
        })
      },
      formatTime(blogs){
        blogs.forEach((item) => {
          item.addTime = normalizeTime(item.addTime);
        })
        return blogs;
      }
    }
  }
</script>

<style scoped lang="stylus">
  .h1-title
    font-size: 30px
</style>
