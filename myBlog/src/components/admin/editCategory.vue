<template>
  <el-main>
    <card title="修改分类">
      <div class="editName">
        <el-input
          placeholder="请输入要修改的分类名称"
          v-model="value"
          clearable>
        </el-input>
        <div class="editBtn">
          <el-row>
            <el-button @click="editCate" size="small" type="success" icon="el-icon-check" circle></el-button>
          </el-row>
        </div>
      </div>
    </card>
  </el-main>
</template>

<script>
  import Card from 'base/card/card'
  import qs from 'qs'
  import axios from 'axios'
  axios.defaults.withCredentials = true;
  export default {
    data(){
      return{
        value: ''
      }
    },
    created(){
      this.value = this.$route.query.cateName;
    },
    methods:{
      editCate(){
        const oldValue = this.$route.query.cateName;
        if(this.value === ''){
          this.$message({
            message: '修改的值不能为空',
            duration: 1000,
            type: 'warning'
          });
          return;
        }
        if(this.value === oldValue){
          this.$message({
            message: '您并未做任何修改',
            duration: 1000,
            type: 'error'
          });
          setTimeout(() => {
            this.$router.push('/categoryList');
          },1000)
          return;
        }
        var url = 'http://localhost:3000/admin/editCategory';
        var data = {
          id: this.$route.params.id,
          name: this.value,
          addTime: Date.now()
        }
        axios.post(url,qs.stringify(data)).then(res => {
          if(res.data.code === -1){
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'error'
            })
          }else if(res.data.code === 0){
            this.$message({
              message: res.data.message,
              duration: 1000,
              type: 'success'
            })
            setTimeout(() => {
              this.$router.push('/categoryList');
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

<style lang="stylus">
  .editName
    width: 30%;
  .el-row
    bottom: 36px;
    left: 360px;
</style>
