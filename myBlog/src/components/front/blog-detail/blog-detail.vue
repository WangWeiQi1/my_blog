<template>
  <div class="blog-detail" ref="deCon">
    <div class="detail-container">
      <div class="detail-content">
        <div class="detail-header">
          <h1 class="detail-title">{{title}}</h1>
          <div class="detail-xxx">
            <ul class="detail-msg">
              <li>作者：
                <span>{{author}}</span>
              </li>
              <li>围观群众：{{views}}</li>
              <li>更新于：{{addTime}}</li>
              <li>所属分类：{{category}}</li>
            </ul>
            <div class="detail-time">{{addTime}}</div>
          </div>
        </div>
        <div class="blog-detail-content">
          <Markdown :content="content"></Markdown>
        </div>
        <div class="detail-footer">
          <p class="footer-item1">非特殊说明，本文版权归 {{author}} 所有，转载请注明出处.</p>
          <p class="footer-item2">本文标题： <span>{{title}}</span></p>
          <p class="footer-item3">本文网址： <a :href="`${blogUrl}${this.$route.params.id}`">{{`${blogUrl}${this.$route.params.id}`}}</a></p>
        </div>
        <h6 class="yanshen-h6">延伸阅读</h6>
        <ul class="prev-next-show">
          <li>
            ◈
            <a style="cursor: pointer;" @click="prevClick">{{prevTitleC}}</a>
          </li>
          <li>
            ◈
            <a style="cursor: pointer;" @click="nextClick">{{nextTitleC}}</a>
          </li>
        </ul>
        <div class="comment-fabiao">
          <h1 class="comment-h1">发表评论</h1>
          <div class="comment-editor">
            <div class="comment-header">
              <i class="iconfont icon-emoji" @click="toggleEmojis"></i>
              <Emojis :showEmojis="showEmojis" @selectEmoji="selectEmoji"></Emojis>
            </div>
            <div class="comment-content">
              <!--<textarea style="border: 0;outline: none;" cols="30" rows="10"></textarea>-->
              <el-input
                type="textarea"
                :rows="2"
                @focus="hideEmojis"
                placeholder="既然来了，那就说点什么呗!"
                v-model="textarea">
              </el-input>
            </div>
          </div>
          <el-button type="primary" @click="sendComment">提交评论</el-button>
        </div>
        <div class="comment-user-filed" :class="{'active': comments.length}">
          <ul class="comment-container-filed">
            <li class="comment-user-info-filed" v-for="comment in comments">
              <div class="comment-info-filed">
                <img width="50" height="50" style="border-radius: 50%;" :src="`${avatarUrl}${comment.UserAvatar}`" alt="">
                <div class="user-comment-info-comment">
                  <p class="item-comment-username">{{comment.UserName}}</p>
                  <p class="item-comment-content-info" v-html="comment.commentCon"></p>
                </div>
              </div>
              <div class="comment-add-time">
                <p :class="{'current': comment.replies.length}">评论于：{{comment.commentTime}}</p>
              </div>
              <div class="replay-comment-1">
                <p @click.stop.prevent="showTip(comment)">{{tipCon(comment)}}</p>
              </div>
              <div class="reReply-comment-info">
                <ul>
                  <li class="reReply-comment-item" v-for="item in comment.replies">
                    <div class="reReply-comment-flex">
                      <img width="50" height="50" style="border-radius: 50%;" :src="`${avatarUrl}${item.avatar}`" alt="">
                      <div class="reReply-comment-flex-right">
                        <span class="reReply-comment-username">
                          <span class="reReply-reReply-fromName">{{item.fromName}}</span>
                          <span class="reReply-reReply-reReply">回复</span>
                          <span class="reReply-reReply-toName">{{item.toName}}</span>
                        </span>
                        <span class="reReply-comment-content-info">{{item.content}}</span>
                        <div class="reReply-comment-add-time">
                          <p>回复于：{{item.addTime}}</p>
                        </div>
                      </div>
                    </div>
                    <span class="reReplay-item-info-reply" @click="togglereReply(item)">{{reShowReply(item)}}</span>
                    <div class="reReplay-btn-content-info-reply" v-show="item.show">
                      <div class="reReply-content-box-reply">
                        <el-input
                          type="textarea"
                          :rows="2"
                          :placeholder="showToReplyUser(item)"
                          v-model="textarea2">
                        </el-input>
                        <div class="reReplay-btn-info-reply" @click.stop.prevent="reSendReply(comment,item)">提交</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="replay-textarea-content" v-show="comment.show">
                <el-input
                  type="textarea"
                  :rows="2"
                  :placeholder="showToUser(comment)"
                  v-model="textarea1">
                </el-input>
                <div class="comment-btn-info" @click.stop.prevent="sendReplies(comment)">提交</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  axios.defaults.withCredentials = true;
  import {normalizeTime,Guid} from 'common/js/essays'
  import {formatTime} from 'common/js/utils'
  import Markdown from 'base/markdown/markdown'
  import Emojis from 'base/emojis/emojis'
  export default {
    data(){
      return{
        avatarUrl: 'http://localhost:3000/avatar/',
        blogUrl: 'http://localhost:8080/blog/',
        author: '',
        views: 0,
        addTime: '',
        content: '',
        title: '',
        category: '',
        prevBlog: [],
        nextBlog: [],
        textarea: '',
        textarea1: '',
        textarea2: '',
        comments: [],
        showEmojis: false
      }
    },
    created(){
      this.getArticleDetail();
      this.getAllComments();
    },
    computed:{
      prevTitleC(){
        if(!this.prevBlog.length){
          return '没有上一篇了哦...'
        }else{
          return this.prevBlog[0].title;
        }
      },
      nextTitleC(){
        if(!this.nextBlog.length){
          return '没有下一篇了哦...'
        }else{
          return this.nextBlog[0].title;
        }
      }
    },
    watch:{
      "$route": ["getArticleDetail","getAllComments","goToTop"]

    },
    methods:{
      getArticleDetail(){
        var url = 'http://localhost:3000/getDetail?id=' + this.$route.params.id;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.title = res.data.blog.title;
            this.author = res.data.blog.user.username;
            this.views = res.data.blog.views;
            this.addTime = formatTime(Number(res.data.blog.addTime));
            this.content = res.data.blog.content;
            this.category = res.data.blog.category.name;
            this.prevBlog = res.data.prevBlog;
            this.nextBlog = res.data.nextBlog;
          }
        })
      },
      goToTop(){
        this.$refs.deCon.scrollTop = 0;
      },
      sendComment(){
        if(this.textarea === ''){
          this.$message.warning({
            message: '评论不能为空哦~',
            duration: 1000
          })
          return;
        }
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        if(!session || session.login === 0){
          this.$message.warning({
            message: '登录后才可以评论哦~',
            duration: 1000
          });
          this.textarea = '';
          return;
        }
        var url = 'http://localhost:3000/sendComments';
        let res = this.textarea.replace(/\[(.+?)\]/g, (item) => {
          let word = item.replace(/\[|\]/g, "");
          return `<img src="http://localhost:3000/emojis/${word}.gif" alt="emojis" />`;
        })
        var data = {
          id: Guid(),
          content: res,
          addTime: Date.now(),
          blogId: this.$route.params.id
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.textarea = '';
            this.getAllComments();
          }
        })
      },
      getAllComments(){
        var url = 'http://localhost:3000/getComments?id=' + this.$route.params.id;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.comments = this.format(res.data.comments);
          }
        })
      },
      sendReplies(comment){
        if(this.textarea1 === ''){
          this.$message.warning({
            message: '回复不能为空哦~',
            duration: 1000
          });
          return;
        }
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        if(!session || session.login === 0){
          this.$message.warning({
            message: '登录后才可以回复哦~',
            duration: 1000
          });
          this.textarea1 = '';
          return;
        }
        if(session.username === comment.UserName){
          this.$message.warning({
            message: '不要自言自语哦~',
            duration: 1000
          });
          return;
        }
        var url = 'http://localhost:3000/sendReplies';
        var data = {
          id: comment.id,
          content: this.textarea1,
          addTime: Date.now(),
          blogId: this.$route.params.id,
          toUser: comment.UserName
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.textarea1 = '';
            this.getAllComments();
          }
        })
      },
      reSendReply(comment,item){
        if(this.textarea2 === ''){
          this.$message.warning({
            message: '回复不能为空哦~',
            duration: 1000
          });
          return;
        }
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        if(!session || session.login === 0){
          this.$message.warning({
            message: '登录后才可以回复哦~',
            duration: 1000
          });
          this.textarea2 = '';
          return;
        }
        if(session.username === item.fromName){
          this.$message.warning({
            message: '不要自言自语哦~',
            duration: 1000
          });
          return;
        }
        var url = 'http://localhost:3000/sendReplies';
        var data = {
          id: comment.id,
          content: this.textarea2,
          addTime: Date.now(),
          blogId: this.$route.params.id,
          toUser: item.fromName
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.textarea2 = '';
            this.getAllComments();
          }
        })
      },
      format(comments){
        comments.forEach((item) => {
          item.commentTime = normalizeTime(item.commentTime);
          item.show = false;
          item.replies.forEach((reply) => {
            reply.addTime = normalizeTime(reply.addTime);
            reply.show = false;
          })
        })
        return comments;
      },
      prevClick(){
        if(!this.prevBlog.length){
          return 'javascript:void(0)';
        }else{
  //          return `http://localhost:8080/Blog/${this.prevBlog[0]._id}`;
          this.$router.push(`/blog/${this.prevBlog[0]._id}`);
        }
      },
      nextClick(){
        if(!this.nextBlog.length){
          return 'javascript:void(0)';
        }else{
  //          return `http://localhost:8080/Blog/${this.nextBlog[0]._id}`;
          return this.$router.push(`/blog/${this.nextBlog[0]._id}`);
        }
      },
      showTip(comment){
        comment.show = !comment.show;
      },
      tipCon(comment){
        return comment.show === true ? '收起' : '回复';
      },
      showToUser(comment){
        return `回复『${comment.UserName}』`;
      },
      togglereReply(item){
        item.show = !item.show;
      },
      reShowReply(item){
        return item.show === true ? '收起' : '回复';
      },
      showToReplyUser(item){
        return `回复『${item.fromName}』`;
      },
      toggleEmojis() {
        this.showEmojis = !this.showEmojis;
      },
      selectEmoji(item) {
        let emoji = `[${item}]`;
        this.textarea += emoji;
      },
      hideEmojis() {
        this.showEmojis = false;
      }
    },
    components:{
      Markdown,
      Emojis
    }
  }
</script>

<style scoped>
  .blog-detail{
    width: 100%;
    height: 100%;
    /*min-height: 601px;*/
    margin-top: 61px;
    position: fixed;
    background-image: url('../../../common/image/bg2.jpg');
    background-repeat: no-repeat;
    overflow: scroll;
    background-size: 100% 100%;
  }
  .detail-container{
    width: 90%;
    /*height: 100%;*/
    /*min-height: 601px;*/
    position: relative;
    background: #ffffff;
    margin: 0 auto 100px auto;
    top: 20px;
    padding-bottom: 100px;
  }
  .detail-content{
    width: 95%;
    /*height: 100%;*/
    /*min-height: 200px;*/
    margin: 0 auto;
    position: relative;
    top: 30px;
    color: #787977;
  }
  .detail-title{
    font-size: 20px;
    margin-top: 5px;
    padding-bottom: 10px;
  }
  .detail-xxx{
    width: 100%;
    height: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .detail-msg{
    display: flex;
    width: 60%;
    height: 40px;
    line-height: 40px;
    float: left;
    font-size: 14px;
  }
  .detail-msg>li{
    padding-right: 20px;
  }
  .detail-msg>li>span{
    color: #3e8bc7;
  }
  .detail-msg>li>span:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  .detail-time{
    float: right;
    font-size: 25px;
    color: #6bc30d;
  }
  .blog-detail-content{
    margin-top: 30px;
  }
  .detail-footer{
    width: 100%;
    height: 80px;
    color: #787977;
    padding-top: 60px;
  }
  .footer-item1,.footer-item2,.footer-item3{
    clear: both;
    padding: 0 20px;
    line-height: 22px;
    font-size: 12px;
  }
  .footer-item2>span,.footer-item3>a{
    color: #3e8bc7;
    cursor: pointer;
  }
  .footer-item2>span:hover,.footer-item3>a:hover{
    color: #6bc30d;
    text-decoration: underline;
  }
  .yanshen-h6{
    margin: 20px 0 0 20px;
    border-left: 3px solid #6bc30d;
    min-height: 26px;
    line-height: 26px;
    padding: 5px 20px;
    background-color: #f8f9f7;
    font-size: 16px;
    font-weight: 400;
    color: #585957;
    text-shadow: 0 1px 0 rgba(255,255,255,.5);
    clear: both;
  }
  .prev-next-show{
    padding: 20px 0 50px 30px;
    font-size: 14px;
  }
  .prev-next-show>li{
    padding: 5px 0;
  }
  .prev-next-show>li>a{
    padding-left: 5px;
    color: #3e8bc7;
  }
  .prev-next-show>li>a:hover{
    color: #6bc30d;
    text-decoration: underline;
  }
  .comment-fabiao{
    border-top: 1px solid #ccc;
    width: 98%;
    margin: 0 auto;
    height: 100%;
  }
  .comment-h1{
    padding: 50px 0 50px 20px;
    font-size: 20px;
    font-weight: 700;
  }
  .comment-editor{
    width: 100%;
    /*height: 100%;*/
    height: 220px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    /*overflow: hidden;*/
  }
  .comment-header{
    height: 45px;
    border-bottom: 1px solid #ccc;
  }
  .comment-content >>> .el-textarea__inner{
    min-height: 0 !important;
    height: 175px !important;
  }
  .icon-emoji{
    font-size: 30px;
    line-height: 45px;
    margin-left: 10px;
  }
  .comment-user-filed{
    width: 98%;
    height: 100%;
    margin: 50px auto 0 auto;
  }
  .comment-user-filed.active{
    border-top: 1px dashed #ccc;
  }
  .comment-user-info-filed{
    height: 100%;
    padding-bottom: 10px;
    border-bottom: 1px dashed #ccc;
  }
  .comment-user-info-filed:last-child{
    border: none;
  }
  .comment-info-filed{
    display: flex;
    margin-top: 20px;
  }
  .user-comment-info-comment{
    padding: 3px 0 0 15px;
    font-size: 14px;
  }
  .item-comment-username{
    padding-bottom: 12px;
    color: #01aaed;
    font-size: 16px;
  }
  .item-comment-content-info{
    padding: 5px 0;
    white-space: pre-wrap;
    line-height: 23px;
  }
  .comment-add-time{
    padding: 0 0 0 65px
  }
  .comment-add-time>p{
    font-size: 12px;
    padding: 15px 0;
    /*border-bottom: 1px dashed #ccc;*/
  }
  .comment-add-time>p.current{
    border-bottom: 1px dashed #ccc;
  }
  .replay-comment-1{
    color: #01aaed;
    position: relative;
    left: 225px;
    font-size: 12px;
    bottom: 27px;
    cursor: pointer;
  }
  .replay-textarea-content{
    width: 90%;
    padding: 0 0 15px 60px;
  }
  .replay-textarea-content >>> .el-textarea__inner{
    min-height: 0 !important;
    height: 74px !important;
  }
  .comment-btn-info{
    margin: 10px 0 0 0;
    width: 45px;
    background: #009688;
    color: #fff;
    text-align: center;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    cursor: pointer;
  }
  .reReply-comment-info{
    width: 95%;
    padding-left: 60px;
    margin-top: 15px;
  }
  .reReply-comment-item{
    height: 100%;
  }
  .reReply-comment-flex{
    display: flex;
  }
  .reReply-comment-username{
    padding-left: 20px;
  }
  .reReply-reReply-fromName{
    font-size: 14px;
    color: #01aaed;
  }
  .reReply-reReply-reReply{
    font-size: 16px;
  }
  .reReply-reReply-toName{
    font-size: 14px;
    color: #01aaed;
  }
  .reReply-comment-content-info{
    padding-left: 10px;
    font-size: 14px;
  }
  .reReply-comment-add-time{
    font-size: 12px;
    padding: 20px 0 20px 20px;
  }
  .reReplay-item-info-reply{
    position: relative;
    bottom: 35px;
    font-size: 12px;
    left: 230px;
    color: #01aaed;
    cursor: pointer;
  }
  .reReplay-btn-content-info-reply{
    position: relative;
    height: 20px;
    width: 95%;
    margin-top: 10px;
    padding-bottom: 110px;
  }
  .reReply-content-box-reply >>> .el-textarea__inner{
    min-height: 0 !important;
    height: 74px !important;
  }
  .reReplay-btn-info-reply{
    margin: 10px 0 0 0;
    width: 45px;
    background: #009688;
    color: #fff;
    text-align: center;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
    cursor: pointer;
  }
</style>
