<template>
  <div class="message-body" ref="messageBody">
    <div class="message-container">
      <div class="message-header">
        <h1 class="liuyanban-title">留言板</h1>
        <p class="liuyanban-description">沟通交流,拉近你我!</p>
        <div class="liuyanban-editor">
          <div class="editor-header">
            <i class="iconfont icon-emoji" @click="showEmoji"></i>
            <Emojis :showEmojis="showEmojis" @selectEmoji="selectEmoji"></Emojis>
          </div>
          <div class="editor-content">
            <el-input
              type="textarea"
              placeholder="想和我说点啥呢?"
              @focus="hideEmoji"
              :rows="2"
              v-model="textarea">
            </el-input>
          </div>
        </div>
        <el-button type="primary" @click="sendMessage">提交留言</el-button>
      </div>
      <div class="message-content">
        <h1 class="message-count-info">共有{{count}}条留言</h1>
        <ul class="content-container">
          <transition-group name="scaleFade">
            <li class="info-content" v-for="(item,index) in messages" :key="item._id">
              <div class="info-flex-item">
                <div class="info-left">
                  <img width="50" height="50" style="border-radius: 50%;" v-lazy="`${avatarUrl}${item.user.avatar}`" alt="">
                </div>
                <div class="info-right">
                  <div class="info-user-name">
                    {{item.user.username}}
                  </div>
                  <div class="info-user-content">
                    <p class="info-user-p" v-html="item.content"></p>
                  </div>
                </div>
              </div>
              <div class="info-add-time" :class="{'current': item.replies.length}">提交于：{{item.addTime}}</div>
              <span class="replay-item-info" @click="toggleReply(item,index)">{{showTip(item)}}</span>
              <div class="reply-info-container">
                <ul>
                  <li class="reply-info-items" v-for="reply in item.replies" :key="reply._id">
                    <div class="reply-info-flex">
                      <div class="reply-info-avatar">
                        <img width="50" height="50" style="border-radius: 50%;" v-lazy="`${avatarUrl}${reply.replyAvatar}`" alt="">
                      </div>
                      <div class="reply-user-info">
                        <span class="reply-fromusername">{{reply.fromName}}</span>
                        <span class="onlyspan">回复</span>
                        <span class="reply-tousername">{{reply.toName}}</span>
                        <span class="reply-info-content" v-html="reply.replyContent"></span>
                      </div>
                    </div>
                    <div class="reply-info-replytime">
                      回复于：{{reply.replyTime}}
                    </div>
                    <span class="replay-item-info-reply" @click="toggleReReply(reply,index)">{{ReshowTip(reply)}}</span>
                    <div class="replay-btn-content-info-reply" v-show="reply.show">
                      <div class="reply-content-box-reply">
                        <el-input
                          type="textarea"
                          :rows="2"
                          @focus="hideEmoji"
                          :placeholder="showPlaceHolder1(reply)"
                          v-model="textarea2">
                        </el-input>
                        <div class="replay-btn-info-reply" @click.stop.prevent="reSendReply(reply)">提交</div>
                      </div>
                      <i class="iconfont icon-emoji emoji-reply1" @click="showEmoji"></i>
                      <div class="emojis-container-message">
                        <Emojis :showEmojis="showEmojis" @selectEmoji="selectEmoji2"></Emojis>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="replay-btn-content-info" v-show="item.show">
                <div class="reply-content-box">
                  <el-input
                    type="textarea"
                    :rows="3"
                    :placeholder="showPlaceHolder(item)"
                    @focus="hideEmoji"
                    v-model="textarea1">
                  </el-input>
                  <div class="replay-btn-info" @click.stop.prevent="sendReply(item)">提交</div>
                </div>
                <i class="iconfont icon-emoji emoji-reply1" @click="showEmoji"></i>
                <div class="emojis-container-message">
                  <Emojis :showEmojis="showEmojis" @selectEmoji="selectEmoji1"></Emojis>
                </div>
              </div>
            </li>
          </transition-group>
          <div class="loading-container" v-show="hasMore">
            <Loading></Loading>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import Loading from 'base/loading/loading'
  axios.defaults.withCredentials = true;
  import {normalizeTime} from 'common/js/essays'
  import Emojis from 'base/emojis/emojis'
  export default {
    data(){
      return{
        textarea: '',
        textarea1: '',
        textarea2: '',
        messages: [],
        avatarUrl: 'http://localhost:3000/avatar/',
        count: 0,
        currentIndex: -1,
        currentPage: 1,
        hasMore: false,
        limit: 0,
        showEmojis: false
      }
    },
    created(){
      this.getAllMessages(1);
    },
    mounted(){
      window.addEventListener('scroll', this.handleScroll, true);
    },
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll, true);   //  在事件捕获阶段就清除掉
    },
    methods:{
      sendMessage(){
        var url = 'http://localhost:3000/sendMessage';
        var data = {
          content: this.formatMessage(this.textarea),
          addTime: Date.now()
        }
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        if(!session || session.login === 0){
          this.$message.warning({
            message: '登录后才可以留言哦~',
            duration: 2000
          });
          this.textarea = '';
          return;
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.textarea = '';
            this.getAllMessages(1);
          }
        })
      },
      getAllMessages(){
        this.currentPage = 1;
        this.hasMore = true;
        var url = 'http://localhost:3000/allMessages?page=' + this.currentPage;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.messages = this.formatTime(res.data.messages);
            this.count = res.data.count;
            this.limit = res.data.limit;
            this._checkMore(res.data.messages);
          }
        })
      },
      _checkMore(messages){
        if(!messages.length || (messages.length + (this.currentPage - 1) * 5) >= this.count){
          this.hasMore = false;
        }
      },
      searchMore(){
        if(!this.hasMore){
          return;
        }
        this.currentPage ++;
//        this.hasMore = true;
        var url = 'http://localhost:3000/allMessages?page=' + this.currentPage;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.messages = this.messages.concat(this.formatTime(res.data.messages));
            console.log(this.messages)
            this._checkMore(res.data.messages);
          }
        })
      },
      formatTime(messages){
        messages.forEach((item) => {
          item.addTime = normalizeTime(item.addTime);
          item.show = false;
          item.replies.forEach((reply) => {
            reply.replyTime = normalizeTime(reply.replyTime);
            reply.show = false;
          })
        })
        return messages;
      },
      toggleReply(item,index){
        item.show = !item.show;
      },
      showTip(item){
        return item.show ? '收起' : '回复';
      },
      showPlaceHolder(item){
        return `回复『${item.user.username}』`;
      },
      sendReply(item){
        if(this.textarea1 === ''){
          this.$message.warning({
            message: '回复不能为空哦!',
            duration: 1000
          });
          return;
        }
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        if(!session || session.login === 0) {
          this.$message.warning({
            message: '登录后才可以回复哦~',
            duration: 2000
          })
          this.textarea1 = '';
          return;
        } else if(item.user.username === session.username) {
          this.$message.warning({
            message: '不要自言自语哦!嘿嘿',
            duration: 1000
          });
          this.textarea1 = '';
          return;
        }
        var url = 'http://localhost:3000/replayMessage';
        var data = {
          messageId: item._id,
          toUserName: item.user.username,
          replyTime: Date.now(),
          replyContent: this.formatMessage(this.textarea1)
        };
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: '回复成功',
              duration: 1000
            });
            this.textarea1 = '';
            this.getAllMessages(this.currentPage);
          }
        })
      },
      showPlaceHolder1(reply){
        return `回复『${reply.fromName}』`;
      },
      reSendReply(reply){
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
            duration: 2000
          })
          this.textarea2 = '';
          return;
        }
        if(reply.fromName === session.username){
          this.$message.warning({
            message: '不要自言自语哦!嘿嘿',
            duration: 1000
          });
          this.textarea2 = '';
          return;
        }
        var url = 'http://localhost:3000/replayMessage';
        var data = {
          messageId: reply.msgId,
          toUserName: reply.fromName,
          replyTime: Date.now(),
          replyContent: this.formatMessage(this.textarea2)
        };
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: '回复成功',
              duration: 1000
            });
            this.textarea2 = '';
            this.getAllMessages(this.currentPage);
          }
        })
      },
      toggleReReply(reply,index){
        reply.show = !reply.show;
      },
      ReshowTip(reply){
        return reply.show ? '收起' : '回复';
      },
      handleScroll(e){
        var scrollTop = this.$refs.messageBody.scrollTop;
        var windowHeight = this.$refs.messageBody.clientHeight;
        var scrollHeight = this.$refs.messageBody.scrollHeight;
        if(scrollTop + windowHeight == scrollHeight){
          this.searchMore();
        }
      },
      showEmoji() {
        this.showEmojis = !this.showEmojis;
      },
      hideEmoji() {
        this.showEmojis = false;
      },
      selectEmoji(item) {
        let emoji = `[${item}]`;
        this.textarea += emoji;
      },
      selectEmoji1(item) {
        let emoji = `[${item}]`;
        this.textarea1 += emoji;
      },
      selectEmoji2(item) {
        let emoji = `[${item}]`;
        this.textarea2 += emoji;
      },
      formatMessage(msg) {
        return msg.replace(/\[(.+?)\]/g, (item) => {
          let word = item.replace(/\[|\]/g,'');
          return `<img src="http://localhost:3000/emojis/${word}.gif" alt="" />`
        });
      }
    },
    components:{
      Loading,
      Emojis
    }
  }
</script>

<style scoped>
  .message-body{
    position: fixed;
    width: 100%;
    height: 100%;
    min-height: 601px;
    background-image: url('../../../common/image/bg2.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow:scroll;
    margin-top: 61px;
  }
  .message-container{
    width: 90%;
    margin: 0 auto;
    min-height: 420px;
    position: relative;
    top: 20px;
    color: #787977;
    padding-bottom: 150px;

  }
  .message-header{
    background: #ffffff;
    height: 420px;
    width: 100%;
  }
  .liuyanban-title{
    font-weight: 700;
    font-size: 2rem;
    position: relative;
    text-align: center;
    top: 20px;
  }
  .liuyanban-description{
    position: relative;
    top: 25px;
    font-size: 1.25rem;
    text-align: center;
    margin: 1rem 0;
  }
  .liuyanban-editor{
    width: 90%;
    height: 220px;
    margin: 0 auto;
    border: 1px solid #ccc;
    position: relative;
    top: 30px;
    /*overflow: hidden;*/
  }
  .editor-header{
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #ccc;
  }
  .editor-content{
    height: 100%;
  }
  .editor-content >>> .el-textarea__inner{
    min-height: 175px !important;
  }
  .icon-emoji{
    font-size: 30px;
    line-height: 45px;
    margin-left: 10px;
  }
  .emoji-reply1 {
    position: absolute;
    top: 76px;
    left: 50px;
  }
  
  .el-button{
    position: relative;
    top: 50px;
    left: 59px;
  }
  .message-content{
    width: 100%;
    height: 100%;
    background: #ffffff;
    margin: 0 auto;
    position: relative;
    top: 20px;
    padding: 40px 0;
  }
  .message-count-info{
    position: relative;
    color: #3b99fc;
    left: 58px;
    padding-bottom: 20px;
  }
  .content-container{
    width: 100%;
    height: 100%;
  }
  .info-content{
    border-bottom: 1px dashed #ccc;
    padding: 20px 54px 0 54px;
  }
  .info-content:last-child{
    border: none;
  }
  .info-flex-item{
    display: flex;
  }
  .info-left{
    padding-right: 15px;
  }
  .info-user-name{
    color: #01aaed;
    position: relative;
    top: 2px;
    font-size: 16px;
  }
  .info-user-content{
    position: relative;
    top: 10px;
    font-size: 14px;
    padding: 5px 0;
  }
  .info-user-p{
    white-space: pre-wrap;
    line-height: 23px;
  }
  .info-add-time{
    position: relative;
    top: 8px;
    font-size: 12px;
    padding: 10px 0 15px 0;
    left: 65px;
  }
  .info-add-time.current{
    border-bottom: 1px dashed #ccc;
  }
  .replay-item-info{
    color: #01aaed;
    position: relative;
    left: 225px;
    font-size: 12px;
    bottom: 22px;
    cursor: pointer;
  }
  .replay-btn-content-info{
    position: relative;
    left: 65px;
    height: 20px;
    width: 95%;
    margin-top: 10px;
    padding-bottom: 110px;
  }
  .reply-content-box >>> .el-textarea__inner{
    min-height: 0 !important;
  }
  .replay-btn-info{
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
  .reply-info-container{
    height: 100%;
    width: 100%;
    padding: 15px 0 0 0;
  }
  .reply-info-items{
    position: relative;
    left: 65px;
  }
  .reply-info-flex{
    display: flex;
  }
  .reply-info-avatar{
    padding-right: 15px;
  }
  .reply-fromusername,.reply-tousername{
    color: #01aaed;
    font-size: 14px;
  }
  .onlyspan{
    font-size: 14px;
    padding: 0 2px;
  }
  .reply-info-content{
    font-size: 14px;
    padding-left: 10px;
  }
  .reply-info-replytime{
    position: relative;
    left: 65px;
    bottom: 20px;
    font-size: 12px;
    width: 1000px;
  }
  .replay-item-info-reply{
    color: #01aaed;
    position: relative;
    left: 230px;
    font-size: 12px;
    bottom: 35px;
    cursor: pointer;
  }
  .replay-btn-content-info-reply{
    position: relative;
    height: 20px;
    width: 95%;
    margin-top: 10px;
    padding-bottom: 110px;
  }
  .reply-content-box-reply >>> .el-textarea__inner{
    min-height: 0 !important;
    height: 74px !important;
  }
  .replay-btn-info-reply{
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
  .scaleFade-enter-active{
    transition: all 1s;
  }
  .scaleFade-leave-active {
    transition: all 1s;
  }
  .scaleFade-enter{
    opacity: 0;
  }
  .scaleFade-leave-to{
    opacity: 0;
  }
  .loading-container{
    position: relative;
    top: 97px;
  }
  .emojis-container-message {
    position: relative;
    left: 95px;
    bottom: 20px;
  }
</style>
