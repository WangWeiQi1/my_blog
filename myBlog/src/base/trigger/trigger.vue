<template>
  <el-dialog
    title="提示"
    :visible.sync="showFlag1"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
    center>
    <slot></slot>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelReply">取 消</el-button>
    <el-button type="primary" @click="confirmReply">回 复</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      showFlag1:{
        type: Boolean,
        default: false
      }
    },
    methods:{
      cancelReply(){
        this.$emit('cancelReply');
      },
      confirmReply(){
        this.$emit('confirmReply');
      }
    }
  }
</script>

<style scoped>

</style>
