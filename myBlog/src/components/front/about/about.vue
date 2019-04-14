<template>
  <div class="about-me">
    <div class="about-container">
      <div class="about-me-header">
        <div class="about-me-desc-content">
          <h1 class="about-me-title">关于</h1>
          <p class="about-me-description">青春如此短暂，可却还没学会珍惜。</p>
        </div>
      </div>
      <div class="about-me-content">
        <div class="about-me-info">
          <h1 class="about-me-me">关于我</h1>
        </div>
        <p class="now-status">2019年6月毕业于黑龙江大学，现在在北京从事前端开发</p>
        <p class="concat-me-about">可以通过以下方式，联系到我：</p>
        <p class="concat-type-item">企鹅：1755592727<br>
           邮箱：1755592727@qq.com<br>
           Github：https://github.com/WangWeiQi1<br>
           微信：
        </p>
        <img class="wechat-img" width="300" height="300" src="../../../common/image/wechat.png" alt="">
        <div class="about-website-info">
          <div class="about-me-info">
            <h1 class="about-me-me">关于本站</h1>
          </div>
          <p class="now-status">本站建于2019年初，主要有两点初衷</p>
          <p class="because-item">1.起初源于毕业论文选题为博客系统。<br>
             2.今后主要用于记录学习笔记，技术分享、交流。
          </p>
          <p class="jishu-info">构建本站所用到的技术：<br>
                                前端：Vue + ElementUI + Layui<br>
                                后端：NodeJs + Express<br>
                                数据库：MongoDB<br>
                                </p>
        </div>
        <div class="about-website-info">
          <div class="about-me-info">
            <h1 class="about-me-me">关于版权</h1>
          </div>
          <p class="now-status">您可以可以对本站所有原创内容进行转载、节选、二次创作，但是您不得对其用于商业目的。</p>
        </div>
        <div class="about-website-info">
          <div class="about-me-info">
            <h1 class="about-me-me">特别说明</h1>
          </div>
          <p class="now-status-xx">本站文章仅代表个人观点，和任何组织或个人无关。<br>
            本站前端开发代码没有考虑对移动端和IE浏览器的兼容。<br></p>
        </div>
        <div>
          <img class="footer-image" src="../../../common/image/bg2.jpg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  .about-me{
    width: 100%;
    height: 100%;
  }
  .about-container{
    position: fixed;
    width: 100%;
    height: 100%;
    margin-top: 61px;
    background-image: url('../../../common/image/bg2.jpg');
    background-repeat: no-repeat;
    overflow: scroll;
    background-size: 100% 100%;
    color: #515250;
  }
  .about-me-header{
    width: 100%;
    height: 261px;
    background: #9AC0CD;
    text-align: center;
  }
  .about-me-desc-content{
    position: relative;
    top: 30%;
    color: #fff;
  }
  .about-me-title{
    font-size: 35px;
    font-weight: 500;
  }
  .about-me-description{
    font-size: 20px;
    padding-top: 20px;
  }
  .about-me-content{
    width: 90%;
    background: #ffffff;
    margin: 20px auto 200px auto;
    padding-top: 20px;
    padding-bottom: 40px;
  }
  .about-me-info{
    border-left: 4px solid #6CE26C;
    height: 25px;
    margin: 20px 0 0 20px;
  }
  .about-me-me{
    line-height: 25px;
    padding-left: 20px;
    font-size: 20px;
    font-weight: 700;
  }
  .now-status{
    position: relative;
    left: 43px;
    top: 20px;
    padding: 20px 0;
    font-size: 14px;
  }
  .concat-me-about{
    padding: 30px 0 20px 43px;
    font-size: 14px;
  }
  .concat-type-item{
    font-size: 14px;
    padding: 0 0 10px 43px;
    line-height: 35px;
  }
  .wechat-img{
    padding: 0 0 20px 43px;
  }
  .about-website-info{
    width: 100%;
    /*height: 100%;*/
    margin: 20px auto 0 auto;
    padding-top: 20px;
    background: #ffffff;
  }
  .because-item{
    padding: 20px 0 20px 43px;
    font-size: 14px;
    line-height: 35px;
  }
  .jishu-info{
    padding-left: 43px;
    font-size: 14px;
    line-height: 35px;
  }

  .now-status-xx{
    position: relative;
    left: 43px;
    padding: 20px 0;
    font-size: 14px;
    line-height: 35px;
  }
  .footer-image{
    width: 1215px;
    margin: 0 auto;
    height: 330px;
    /* padding: 0 20px; */
    display: block;
  }
</style>
