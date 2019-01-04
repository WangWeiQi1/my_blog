<template>
  <el-main>
    <Card title="添加随笔">
      <div class="essays-content">
        <el-input style="width: 50%;"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </div>
      <div class="essay-btn">
        <el-button type="success" @click="addEssays">发表随笔</el-button>
      </div>
    </Card>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import axios from 'axios'
  import qs from 'qs'
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        textarea: ''
      }
    },
    methods:{
      addEssays(){
        var url = 'http://localhost:3000/admin/addEssay';
        var data = {
          content: this.textarea,
          addTime: Date.now()
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === 0){
            this.$message.success({
              message: res.data.message,
              duration: 1000
            });
            setTimeout(() => {
              this.$router.push('/essayList');
            },1000)
          }
        })
      }
    },
    components:{
      Card
    }
  }
</script>

<style scoped>
  .essays-content{
    margin-top: 20px;
  }
  .essay-btn{
    margin-top: 50px;
    padding-bottom: 30px;
  }
</style>
