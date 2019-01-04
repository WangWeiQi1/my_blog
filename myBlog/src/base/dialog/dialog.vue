<template>
  <el-dialog
    title="提示"
    :visible.sync="showFlag"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
    center>
    <span>{{title}}</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelBtnClick">取 消</el-button>
    <el-button type="primary" @click="confirmBtnClick">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      title:{
        type: String,
        default: ''
      },
      showFlag:{
        type: Boolean,
        default: false
      }
    },
    methods:{
      cancelBtnClick(){
        this.$emit('cancel');
      },
      confirmBtnClick(){
        this.$emit('confirm');
      }
    }
  };
</script>

<style>

</style>
