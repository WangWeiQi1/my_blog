<template>
  <el-main>
    <Card title="全部友链">
      <el-table
        :data="linkList"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
          width="300">
        </el-table-column>
        <el-table-column
          prop="link"
          label="链接"
          width="300">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="delClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="fenye-item-item">
        <FenYe :data="linkList"
               :count="count"
               :limit="limit"
               :currentPage="currentPage"
               @nextClick="next"
               @currentChange="currentChange"
               @prevClick="prev"></FenYe>
      </div>
    </Card>
    <Dialog title="确认删除该条友链吗?" :showFlag="showFlag" @confirm="confirm" @cancel="cancel"></Dialog>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  import Dialog from 'base/dialog/dialog'
  import FenYe from 'base/fenye/fenye'
  export default {
    data(){
      return{
        linkList: [],
        showFlag: false,
        itemId: [],
        currentPage: 1,
        count: 0,
        limit: 0
      }
    },
    created(){
      this.getAllLinks(1);
    },
    methods:{
      getAllLinks(page){
        var url = 'http://localhost:3000/getLinks?page=' + page;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.count = res.data.count;
            this.limit = res.data.limit;
            this.linkList = res.data.links;
          }
        })
      },
      delClick(item){
        this.showFlag = true;
        this.itemId = item._id;
      },
      cancel(){
        this.showFlag = false;
      },
      confirm(){
        this.showFlag = false;
        var url = 'http://localhost:3000/delLinks?id=' + this.itemId;
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            })
            this.getAllLinks(1);
          }
        })
      },
      prev(){
        this.currentPage --;
        this.getAllLinks(this.currentPage);
      },
      next(){
        this.currentPage ++;
        this.getAllLinks(this.currentPage);
      },
      currentChange(current){
        this.currentPage = current;
        this.getAllLinks(this.currentPage);
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
  .fenye-item-item{
    text-align: center;
    padding: 30px 0 20px 0;
  }
</style>
