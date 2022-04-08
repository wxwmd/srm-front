<template>
  <div class="jz-home">
    <div class="jz-banner">
      <img src="../../../assets/supplier/image/banner.jpg" alt="">
    </div>
    <div class="jz-home-main">
      <home-nav></home-nav>
      <div class="jz-home-con">
        <p>1、质量管理体系至少通过ISO9001:2000</p>
        <p>2、拟供物料在行业排前六名</p>
        <p>3、具备两年以上生产经验及汽车行业配套经验</p>
      </div>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/supplier/Home/HomeNav";
// import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: "Principle",
  components:{HomeNav},
  data() {
    return {
    
    }
  },
  created() {

  },
  methods: {
  
  }
}
</script>

<style scoped>
  .jz-home {
    width: 100%;
    height: auto;
    margin: auto;
  }
  .jz-banner {
    width: 100%;
    height: 400px;
  }
  .jz-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .jz-home-main {
    display: flex;
    justify-content: space-between;
    width: 1200px;
    height: auto;
    margin: 30px auto;
  }
  .jz-home-con{
    width: 78%;
    padding: 40px 30px 20px;
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    border-radius: 10px;
  }
  .jz-home-con p{
    line-height: 30px;
    text-indent: 2em;
    margin-bottom: 10px;
  }
</style>

