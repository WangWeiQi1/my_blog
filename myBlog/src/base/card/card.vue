<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
      <span class="countx" v-show="showCount">{{count}}</span>
      <el-button v-show="showIt" style="float: right; padding: 3px 0" type="text" @click="operator" class="el-icon-circle-plus-outline"></el-button>
    </div>
    <div class="text item">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
  export default {
    props:{
      title: {
        type: String,
        default: ''
      },
      showIt: {
        type: Boolean,
        default: false
      },
      showCount: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 0
      }
    },
    methods:{
      operator(){
        this.$emit('operator');
      }
    }
  }
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .countx{
    background: #f56c6c;
    color: #fff;
    border-radius: 25%;
    font-size: 12px;
    padding: 3px 5px;
  }
</style>
