<template>
  <div>
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from './header/header'
  export default {
    components:{
      Header
    }
  }
</script>

<style lang="stylus">

</style>
