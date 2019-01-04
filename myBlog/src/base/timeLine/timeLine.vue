<template>
  <div>
    <transition-group name="fadeTime">
      <hzqing-vue-timeline
        timelineColor="#fff"
        timeContentColor="#484348"
        :dataList="data"
        :key="data.toString()"
      ></hzqing-vue-timeline>
    </transition-group>
  </div>
</template>

<script>
  export default {
    props:{
      data:{
        type: Array,
        default: []
      }
    },
    data(){
      return{

      }
    }
  }
</script>

<style>
  .fadeTime-enter-active,.fadeTime-leave-active{
    transition: opacity 1s;
  }
  .fadeTime-enter,.fadeTime-leave-active{
    opacity: 0;
  }
</style>
