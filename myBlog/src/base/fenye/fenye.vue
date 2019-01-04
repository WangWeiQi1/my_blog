<template>
  <div class="fenye" v-show="data.length">
    <span class="demonstration"></span>
    <el-pagination
      layout="prev, pager, next"
      @next-click="next"
      @prev-click="prev"
      @current-change="currentChange"
      :page-size="limit"
      :current-page="currentPage"
      :total="count">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    props:{
      data:{
        type: Array,
        default: []
      },
      count:{
        type: Number,
        default: 0
      },
      limit:{
        type: Number,
        default: 0
      },
      currentPage:{
        type: Number,
        default: 1
      }
    },
    methods:{
      prev(){
        this.$emit('prevClick');
      },
      next(){
        this.$emit('nextClick');
      },
      currentChange(current){
        this.$emit('currentChange',current);
      }
    }
  }
</script>

<style>

</style>
