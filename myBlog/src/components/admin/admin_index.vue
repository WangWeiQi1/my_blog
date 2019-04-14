<template>
  <el-main>
    <Card :title="'欢迎您,管理员' + username">
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane label="新增留言">
          <el-table
            :data="newsMessages"
            stripe
            style="width: 100%">
            <el-table-column
              prop="addTime"
              label="提交时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="user.username"
              label="用户名"
              width="200">
            </el-table-column>
            <el-table-column
              prop="content"
              label="留言内容">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="reply1(scope.row)" type="text" slot="reference" size="small">回复</el-button>
                <el-button @click="del1(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="全部留言">
          <el-table
            :data="messages"
            stripe
            style="width: 100%">
            <el-table-column
              prop="addTime"
              label="提交时间"
              width="200">
            </el-table-column>
            <el-table-column
              prop="user.username"
              label="用户名"
              width="200">
            </el-table-column>
            <el-table-column
              prop="content"
              label="留言内容">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="reply1(scope.row)" type="text" slot="reference" size="small">回复</el-button>
                <el-button @click="del1(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="fenye-page" v-if="currentIndex === 1">
        <FenYe :data="messages"
               :count="count"
               @prevClick="prev1"
               @nextClick="next1"
               @currentChange="currentChange1"
               :limit="limit"></FenYe>
      </div>
      <Dialog title="确定要删除该条留言吗?"
              :showFlag="showFlag"
              @confirm="confirm"
              @cancel="cancel"></Dialog>
      <Trigger :showFlag1="showFlag1" @cancelReply="cancelReply" @confirmReply="confirmReply">
        <div class="reply-container">
          <div class="reply-header">
            <i class="iconfont icon-emoji"></i>
          </div>
          <div class="reply-content">
            <el-input
              type="textarea"
              :placeholder="replayTo"
              :rows="2"
              v-model="textarea">
            </el-input>
          </div>
        </div>
      </Trigger>
    </Card>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  import qs from 'qs'
  import {normalizeTime} from 'common/js/essays'
  import FenYe from 'base/fenye/fenye'
  import Dialog from 'base/dialog/dialog'
  import Trigger from 'base/trigger/trigger'
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        username: '',
        currentIndex: 0,
        count: 0,
        messages: [],
        newsMessages: [],
        currentPage: 1,
        limit: 0,
        showFlag: false,
        messageId: '',
        showFlag1: false,
        textarea: '',
        replyToName: ''
      }
    },
    computed:{
      replayTo(){
        return `回复『${this.replyToName}』`;
      }
    },
    created(){
      var session = JSON.parse(sessionStorage.getItem('userInfo'));
      this.username = session.username;
      this.getAllMessages(1);
      this.getnewsMessages(1);
    },
    watch:{
      currentIndex(newIndex){
        if(newIndex === 1){
          this.getAllMessages(1);
        } else {
          this.getnewsMessages(1);
        }
      }
    },
    methods:{
      getAllMessages(page){
        var url = 'http://localhost:3000/allMessages?page=' + page;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.messages = this.formatTime(res.data.messages);
            this.count = res.data.count;
            this.limit = res.data.limit;
          }
        })
      },
      getnewsMessages(page){
        var url = 'http://localhost:3000/allMessages?page=' + page;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.newsMessages = this.formatTime(res.data.messages);
          }
        })
      },
      formatTime(messages){
        messages.forEach((item) => {
          item.addTime = normalizeTime(item.addTime);
        });
        return messages;
      },
      reply1(item){
        this.replyToName = item.user.username;
        this.messageId = item._id;
        var session = JSON.parse(sessionStorage.getItem('userInfo'));
        if(this.replyToName === session.username){
          this.$message.warning({
            message: '不要自言自语哦~',
            duration: 1000
          })
          return;
        }
        this.showFlag1 = true;
      },
      del1(item){
        this.showFlag = true;
        this.messageId = item._id;
      },
      confirm(){
        this.showFlag = false;
        var url = 'http://localhost:3000/admin/delMessage?id=' + this.messageId;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.currentIndex === 0 ? this.getnewsMessages(1) : this.getAllMessages(1);
          }
        })
      },
      confirmReply(){
        if(this.textarea === ''){
          this.$message.warning({
            message: '不要回复空内容哦~',
            duration: 1000
          })
          return;
        }
        var url = 'http://localhost:3000/replayMessage';
        var data = {
          messageId: this.messageId,
          toUserName: this.replyToName,
          replyContent: this.textarea,
          replyTime: Date.now()
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.textarea = '';
            this.showFlag1 = false;
          }
        })
      },
      cancel(){
        this.showFlag = false;
      },
      cancelReply(){
        this.showFlag1 = false;
        this.textarea = '';
      },
      prev1(){
        this.currentPage --;
        this.getAllMessages(this.currentPage);
      },
      next1(){
        this.currentPage ++;
        this.getAllMessages(this.currentPage);
      },
      currentChange1(current){
        this.currentPage = current;
        this.getAllMessages(this.currentPage);
      },
      tabClick(item){
        if(item.label === '全部留言'){
          this.currentIndex = 1;
        }else if(item.label === '新增留言'){
          this.currentIndex = 0;
        }
      }
    },
    components:{
      Card,
      FenYe,
      Dialog,
      Trigger
    }
  }
</script>

<style scoped>
  .fenye-page{
    text-align: center;
    margin-top: 30px;
  }
  .icon-emoji{
    font-size: 30px;
  }
</style>
