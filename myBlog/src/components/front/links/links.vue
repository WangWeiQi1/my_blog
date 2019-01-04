<template>
  <div class="friends-links">
    <div class="links-container">
      <div class="links-header">
        <div class="links-desc-content">
          <h1 class="links-title">友情链接</h1>
          <p class="links-description">做一个简单的人，踏实而务实。不沉溺幻想。不庸人自扰。</p>
        </div>
      </div>
      <div class="links-content-info">
        <div class="links-content-header">
          <div class="links-content-title">
            <h1 class="links-apply-intro">链接申请说明</h1>
          </div>
          <div class="links-content-content">
            <p class="links-desc-top">
              <span>
                <i class="iconfont icon-cuowu"></i>
                经常宕机
              </span>
              <span>
                <i class="iconfont icon-cuowu"></i>
                不合法规
              </span>
              <span>
                <i class="iconfont icon-cuowu"></i>
                插边球站
              </span>
              <span>
                <i class="iconfont icon-cuowu"></i>
                红标报毒
              </span>
              <span>
                <i class="iconfont icon-zhengque"></i>
                原创优先
              </span>
              <span>
                <i class="iconfont icon-zhengque"></i>
                技术优先
              </span>
            </p>
            <p class="links-desc-content-content">交换友链可在留言板留言.本站信息如下<br>
               名称：套你猴子<br>
               网址：https://www.taonihouzi.cn<br>
               图标：https://www.taonihouzi.cn/logo.png<br>
               描述：套你猴子·套你猴子昂~</p>
            <p class="links-desc-shenhe">申请提交后若无其它原因将在24小时内审核</p>
          </div>
        </div>
      </div>
      <div class="link-list-content">
        <ul class="link-list">
          <li v-for="item in linkList">
            <a :href="`${item.link}`">
              <div class="item-content-avatar">
                <img width="50" height="50" style="border-radius: 50%;" v-lazy="`${tubiaoUrl}${item.logo}`" alt="">
                <span class="item-content-name-name">{{item.name}}</span>
              </div>
              <p class="item-content-desc-name">{{item.desc}}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data(){
      return{
        tubiaoUrl: 'http://localhost:3000/link/',
        linkList: []
      }
    },
    created(){
      this.getAllLinks();
    },
    methods:{
      getAllLinks(){
        var url = 'http://localhost:3000/getLinks';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.linkList = res.data.links;
          }
        })
      }
    }
  }
</script>

<style scoped>
  .friends-links{
    width: 100%;
    height: 100%;
  }
  .links-container{
    position: fixed;
    width: 100%;
    height: 100%;
    min-height: 601px;
    margin-top: 61px;
    background-image: url('../../../common/image/bg2.jpg');
    background-repeat: no-repeat;
    overflow: scroll;
    background-size: 100% 601px;
    color: #515250;
    /*overflow: hidden;*/
  }
  .links-header{
    width: 100%;
    height: 261px;
    background: #9AC0CD;
    text-align: center;
  }
  .links-desc-content{
    position: relative;
    top: 30%;
    color: #fff;
  }
  .links-title{
    font-size: 35px;
    font-weight: 500;
  }
  .links-description{
    font-size: 20px;
    padding-top: 20px;
  }
  .links-content-info{
    width: 90%;
    background: #ffffff;
    padding: 20px;
    margin: 20px auto 0 auto;
  }
  .links-content-title{
    width: 100%;
    height: 20px;
    border-left: 4px solid #6CE26C;
  }
  .links-apply-intro{
    font-size: 18px;
    font-weight: 600;
    padding-left: 20px;
  }
  .links-desc-top{
    padding: 20px 0;
  }
  .links-desc-top>span{
    padding-right: 10px;
    font-size: 14px;
  }
  .links-desc-top>span:first-child{
    padding-left: 25px;
  }
  .icon-cuowu,.icon-zhengque{
    font-size: 14px;
  }
  .links-desc-content-content{
    padding-left: 25px;
    line-height: 30px;
    font-size: 14px;
  }
  .links-desc-shenhe{
    font-size: 14px;
    padding: 20px 0 20px 25px;
  }
  .link-list-content{
    width: 1280px;
    height: 100%;
    min-height: 500px;
    margin: 20px auto 0 auto;
    padding-left: 24px;
  }
  .link-list{
    width: 1280px;
    height: 100%;
  }
  .link-list>li{
    width: 299px;
    height: 180px;
    background: #ffffff;
    margin-bottom: 20px;
    margin-right: 20px;
    float: left;
  }
  .link-list>li>a{
    width: 100%;
    height: 100%;
    display: inline-block;
    color: #111111;
  }
  .link-list>li:hover{
    transform: translate3d(0,-2px,0);
    transition: all 0.3s;
    box-shadow: 2px 5px 14px #303030;
  }
  .item-content-avatar{
    padding: 30px 30px;
  }
  .item-content-name-name{
    position: relative;
    bottom: 20px;
    padding-left: 12px;
    font-size: 18px;
    color: #01aaed;
  }
  .item-content-desc-name{
    position: relative;
    left: 40px;
    font-size: 14px;
    color: #515250;
  }
</style>
