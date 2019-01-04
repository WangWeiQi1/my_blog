<template>
  <div class="circle-box">
    <div class="big-black"></div>
    <div class="big-white"></div>
    <div class="mid-black"></div>
    <div class="mid-white"></div>
    <div class="sm-black"></div>
    <div class="sm-white"></div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        msg:'Loading...^_^'
      }
    }
  }
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .circle-box{
    width: 40px;
    height: 40px;
    margin:0 auto;
    position: relative;
    animation: 1s move infinite linear;
  }
  .big-black{
    width: 40px;
    height: 40px;
    background-color: #000;
    border-radius:50%;
  }
  .big-white{
    width: 20px;
    height: 40px;
    background-color: #fff;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    position: absolute;
    top:0;
    right:0;
  }
  .mid-black{
    width: 20px;
    height: 20px;
    background-color: #000;
    border-radius:50%;
    position: absolute;
    top:0;
    left:10px;
  }
  .mid-white{
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius:50%;
    position: absolute;
    bottom:0;
    left:10px;
  }
  .sm-white{
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius:50%;
    position: absolute;
    bottom:5px;
    left:15px;
  }
  .sm-black{
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius:50%;
    position: absolute;
    top:5px;
    left:15px;
  }
  @keyframes move {
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
</style>
