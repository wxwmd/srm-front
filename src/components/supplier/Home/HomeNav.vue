<template>
  <div class="jz-home-nav">
    <ul v-if="type === 0 || type === 3" >
      <li v-for="homeNav in homeNavList" :key="homeNav.id">
        <router-link :to="{path:homeNav.url,query: homeNav.query}"
                     :class="{'jz-homeNav-active': path === homeNav.url}">
          {{homeNav.navName}}
        </router-link>
      </li>
    </ul>
    <ul v-else>
      <li v-for="homeNav in homeNavs" :key="homeNav.id">
        <router-link :to="{path:homeNav.url,query: homeNav.query}"
                     :class="{'jz-homeNav-active': path === homeNav.url}">
          {{homeNav.navName}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "homeNav",
  data(){
    return{
      path: '',
      type:this.$store.state.user.type,
      homeNavs:[
        {
          id:1,
          navName:'公告浏览',
          url:'/home',
          query:{}
        },{
          id:2,
          navName:'注册信息修改',
          url:'/register',
          query:{title: '修改注册信息', show: true}
        },{
          id:3,
          navName:'准入原则',
          url:'/admittance/principle',
          query:{}
        },{
          id:4,
          navName:'准入流程',
          url:'/admittance/process',
          query:{}
        }
      ],
      homeNavList:[
        {
          id:1,
          navName:'公告浏览',
          url:'/home',
          query:{}
        }
      ]
    }
  },
  watch: {
    '$route': {
      handler(to) {
        this.path = to.path;
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
  .jz-home-nav {
    width: 20%;
    height: auto;
    background: #fff;
    box-shadow: 0 0 10px #ddd;
    border-radius: 6px;
    /*padding: 20px;*/
  }
  .jz-home-nav ul{
    margin: 40px auto 80px;
  }
  .jz-home-nav a{
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    border-bottom: 1px dashed #ddd;
  }
  .jz-home-nav .jz-homeNav-active{
    background: #4499ff;
    color: #fff;
  }
</style>
