<template>
  <ul class="layui-fixbar" v-show="showFlag">
    <li @click="goToTop" class="layui-icon layui-fixbar-top" lay-type="top" style="display: list-item;"></li>
  </ul>
</template>

<script>
  export default {
    props:{
      showFlag:{
        type: Boolean,
        default: false
      }
    },
    methods:{
      goToTop(){
        this.$emit('goToTop');
      }
    }
  }
</script>

<style scoped>
  .layui-fixbar {
    right: 110px !important;
    bottom: 50px !important;
  }
</style>
