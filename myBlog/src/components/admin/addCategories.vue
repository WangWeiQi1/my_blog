<template>
  <el-main>
    <card title="添加分类">
      <div class="cateName">
        <el-input
          placeholder="请输入分类名称"
          v-model="value"
          clearable>
        </el-input>
        <div class="cateBtn">
          <el-row>
            <el-button @click="addCate" size="small" type="success" icon="el-icon-check" circle></el-button>
          </el-row>
        </div>
      </div>
    </card>
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
        value: ''
      }
    },
    methods:{
      addCate(){
        if(this.value === ''){
          this.$message({
            message: '分类名称不能为空',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        var url = 'http://localhost:3000/admin/addCategory';
        var data = {
          cateName: this.value,
          addTime: Date.now()
        }
        axios.post(url,qs.stringify(data)).then(res => {
            if(res.data.code === 0){
              this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'success'
              });
              this.value = '';
            }else if(res.data.code === -1){
              this.$message({
                message: res.data.message,
                duration: 1000,
                type: 'error'
              });
            }
        })
      }
    },
    components:{
      Card
    }
  }
</script>

<style lang="stylus">
  .cateName
    width: 30%;
  .el-row
    bottom: 36px;
    left: 360px;
</style>
