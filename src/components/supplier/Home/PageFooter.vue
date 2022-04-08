<template>
  <footer>
    <div class="foot">
      <div class="jz-link">
        <h4><span>||</span>网站链接</h4>
        <div class="jz-link-con">
          <ul>
            <li v-for="menu in menus" :key="menu.id">
              <router-link :to="menu.menuPath" @click.native="getMenu(menu)" :class="{'jz-menu-active': path.startsWith(menu.menuPath)}">{{menu.menuName}}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "PageFooter",
  data(){
    return{
      menus: [],
      path: '',
      menuName:'',
      currentMenuName:this.$store.state.user.currentMenuName
    }
  },
  created() {
    this.path = this.$route.path;
    this.initMenu();
  },
  watch: {
    '$route': {
      handler(to) {
        this.path = to.path;
      },
      immediate: true
    }
  },
  methods:{
    getMenu(menu){
      let currentSubMenu = menu.children
      this.$store.dispatch('setCurrentSubMenu', currentSubMenu)
      let currentMenu = '';
      if (menu.children.length !== 0){
        if (menu.children[0].children.length === 0){
          currentMenu = menu.children[0].id + ''
          this.$store.dispatch('setCurrentMenu', currentMenu)
        } else {
          currentMenu = menu.children[0].id + '-' + menu.children[0].children[0].id
          this.$store.dispatch('setCurrentMenu', currentMenu)
        }
      }
      this.$bus.$emit('refresh')
    },
    initMenu () {
      let self = this;
      this.$api.management.system.menu.getMenuTreeForRole(this.$store.state.user.roleId).then((result) => {
        if (result.code === 200) {
          self.menus = result.data
        }
      })
    },
  }
}
</script>

<style scoped>
  footer{
    width: 100%;
    min-height: 200px;
    height: auto;
    background: #333;
  }
  .foot{
    width: 1200px;
    min-height: 200px;
    height: auto;
    margin: auto;
  }
</style>
