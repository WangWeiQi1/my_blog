<template>
  <el-main>
    <Card title="全部随笔">
      <div class="essay-table">
        <el-table
          :data="data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="user.username"
            label="作者"
            width="200">
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="时间"
            width="230">
          </el-table-column>
          <el-table-column
            prop="content"
            width="400"
            label="内容">
          </el-table-column>
          <el-table-column
            fixed="right"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="showConfirm(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="fenye-essay">
        <FenYe :data="data" :count="count" :limit="limit" :currentPage="currentPage" @prevClick="prev" @nextClick="next" @currentChange="currentChange"></FenYe>
      </div>
    </Card>
    <Dialog title="确定要删除该条随笔吗?" :showFlag="showFlag" @confirm="confirm" @cancel="cancel"></Dialog>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  import {normalizeTime} from 'common/js/essays'
  import Dialog from 'base/dialog/dialog'
  import FenYe from 'base/fenye/fenye'
  export default {
    data(){
      return{
        data: [],
        showFlag: false,
        id: '',
        currentPage: 1,
        count: 0,
        limit: 0
      }
    },
    created(){
      this.getAllEssays(this.currentPage);
    },
    methods:{
      getAllEssays(page){
        var url = 'http://localhost:3000/admin/allEssays?page=' + page;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.count = res.data.count;
            this.limit = res.data.limit;
            this.data = this.normal(res.data.essays);
          }
        })
      },
      normal(essays){
        essays.forEach((item) => {
          item.addTime = normalizeTime(item.addTime);
        })
        return essays;
      },
      showConfirm(item){
        this.showFlag = true;
        this.id = item._id;
      },
      confirm(){
        this.showFlag = false;
        var url = 'http://localhost:3000/admin/delEssay?id=' + this.id;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.getAllEssays(1);
          }
        })
      },
      prev(){
        this.currentPage --;
        this.getAllEssays(this.currentPage);
      },
      next(){
        this.currentPage ++;
        this.getAllEssays(this.currentPage);
      },
      currentChange(current){
        this.currentPage = current;
        this.getAllEssays(this.currentPage);
      },
      cancel(){
        this.showFlag = false;
      }
    },
    components:{
      Card,
      Dialog,
      FenYe
    }
  }
</script>

<style scoped>
  .el-table .cell{
    white-space: nowrap;
    text-align: center;
  }
  .fenye-essay{
    text-align: center;
    margin-top: 20px;
  }
</style>
