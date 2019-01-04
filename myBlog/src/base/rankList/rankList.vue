<template>
  <div class="rankList">
    <ul class="list-content">
      <li class="list-item" v-for="(item,index) in data">
        <span :class="getRankCls(index)">
          <span class="qunima">{{getRankText(index)}}</span>
        </span>
        <a class="list-title-nima" @click="selectItem(item)">
          {{item.title}}
        </a>
      </li>
    </ul>
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
    methods:{
      getRankCls(index){
        if(index === 0){
          return 'current0'
        }else if(index === 1){
          return 'current1'
        }else if(index === 2){
          return 'current2'
        }
      },
      getRankText(index){
        return index + 1;
      },
      selectItem(item){
        this.$emit('select',item);
      }
    }
  }
</script>

<style scoped>
  .list-item{
    height: 40px;
    line-height: 40px;
    padding-left: 40px;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
  }
  .list-title-nima{
    color: #787977;
  }
  .list-title-nima:hover{
    color: #6bc30d;
    text-decoration: underline;
  }
  .list-content>li>span{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #D4D4D4;
    display: inline-block;
    position: relative;
    left: -20px;
    top: 9px;
  }
  .list-content>li>span.current0{
    background: #e24d46;
  }
  .list-content>li>span.current1{
    background: #2ea7e0;
  }
  .list-content>li>span.current2{
    background: #6bc30d;
  }
  .qunima{
    position: relative;
    top: -8px;
    left: 7px;
    color: #fff;
  }
</style>
