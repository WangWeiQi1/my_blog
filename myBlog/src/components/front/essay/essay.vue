<template>
  <div class="timeLine-body">
    <div class="timeLine-container">
      <div class="sz">
        <i class="iconfont icon-shizhong"></i>
        <p class="timeLineCon">TIME LINE</p>
      </div>
      <div class="timeLine">
        <TimeLine :data="data"></TimeLine>
      </div>
      <div class="timeLine-footer">
        <div class="shaLouAndEnd">
          <i class="iconfont icon-shalou"></i>
          <i class="theEND">THE END</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TimeLine from 'base/timeLine/timeLine'
  import axios from 'axios'
  import {createEssay} from '../../../common/js/essays'
  export default {
    data(){
      return{
        data: []
      }
    },
    created(){
      this.getAllEssays();
    },
    methods:{
      getAllEssays(){
        var url = 'http://localhost:3000/admin/allEssays';
        axios.get(url).then(res => {
          if(res.data.code === 0){
            this.data = this.normalizeEssays(res.data.essays);
//            console.log(this.data)
          }
        })
      },
      normalizeEssays(essays){
        var res = [];
        essays.forEach((item) => {
          let essayList = item;
          res.push(createEssay(essayList))
        })
        return res;
      }
    },
    components:{
      TimeLine
    }
  }
</script>

<style scoped>
  .timeLine-body{
    position: fixed;
    width: 100%;
    height: 100%;
    min-height: 601px;
    background-image: url('../../../common/image/bg2.jpg');
    background-repeat: no-repeat;
    overflow: scroll;
    background-size: 100% 100%;
    margin-top: 61px;
  }
  .timeLine-container{
    width: 90%;
    margin: 0 auto;
    background: #fff;
    min-height: 601px;
    position: relative;
    top: 20px;
    height: 100%;
  }
  .timeLine{
    position: relative;
    top: 60px;
  }
  .sz{
    text-align: center;
    padding-top: 30px;
  }
  .timeLineCon{
    font-size: 30px;
    padding-top: 10px;
  }
  .icon-shizhong{
    font-size: 30px;
  }
  .timeLine-footer{
    padding-bottom: 100px;
  }
  .shaLouAndEnd{
    position: relative;
    top: 80px;
  }
  .icon-shalou{
    font-size: 30px;
    position: relative;
    left: 48%;
  }
  .theEND{
    position: relative;
    left: 48%;
    font-size: 25px;
    padding-bottom: 100px;
  }
  .timeLine >>> #hzqing .timeline-row .timeline-content .content-body{
    font-size: 16px;
    margin-bottom: 15px;
    margin-top: 0;
    line-height: 15px;
    font-weight: 600;
    color: #fff;
  }
  .timeLine >>> #hzqing .timeline-row .timeline-content .content-body p{
    line-height: 35px;
  }
  .timeLine >>> #hzqing .timeline-row .timeline-time{
    color: #484348;
    font-size: 14px;
  }
</style>
