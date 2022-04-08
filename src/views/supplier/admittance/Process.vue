<template>
  <div class="jz-home">
    <div class="jz-banner">
      <img src="../../../assets/supplier/image/banner.jpg" alt="">
    </div>
    <div class="jz-home-main">
      <home-nav></home-nav>
      <div class="jz-home-con">
        <img :src="imageUrl">
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
      imageUrl: this.$store.state.system.imageUrl
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
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    border-radius: 10px;
  }
  .jz-home-con img{
    margin: 30px auto
  }
</style>

