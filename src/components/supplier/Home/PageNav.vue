<template>
  <div class="jz-nav">
    <ul>
      <li v-for="menu in menus" :key="menu.id">
        <router-link :to="menu.menuPath" v-if="menu.menuPath != undefined" @click.native="getMenu(menu)" :class="{'jz-menu-active': path.startsWith(menu.menuPath)}">{{menu.menuName}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Nav",
  data() {
    return {
      menus: [],
      path: '',
      menuName:'',
      currentMenuName:this.$store.state.user.currentMenuName
    }
  },
  created() {
    this.path = this.$route.path;
    if (this.$store.state.user.userId !== '' && this.$store.state.user.userId !== undefined && this.$store.state.user.menus.length === 0){
      this.initMenu();
    } else {
      this.menus = this.$store.state.user.menus
    }
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
          this.$store.dispatch('setMenus', self.menus)
          if (self.$store.state.user.type === 0 || self.$store.state.user.type === 3){
            self.$store.state.user.menus.forEach(menu => {
              if (menu.menuPath === '/procurement' || menu.menuPath === '/news/management'){
                this.getMenu(menu)
              }
            })
          }
        }
      })
    },
  }
}
</script>

<style scoped>
  .jz-nav ul {
    display: flex;
    line-height: 80px;
    color: #fff;
    margin: 0;
  }
  .jz-nav ul li {
    margin: 0 2px;
  }
  .jz-nav ul li a{
    display: block;
    padding: 0 20px;
    font-size: 16px;
    color: #EEEEEE;
  }
  .jz-nav ul li a:hover{
    background: #0b84d5;
    font-weight: bold;
  }
  .jz-menu-active{
    background: #0b84d5;
    font-weight: bold;
  }
</style>
