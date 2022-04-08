<template>
  <div class="jz-nav">
    <div class="jz-menu-list">
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse"></i>
    </div>
      <el-menu unique-opened class="jz-nav-menu"
              :default-active="currentMenu"
              text-color="#666"
              active-text-color="#F00"
              background-color="#EEF0EE"
              :collapse="isCollapse">
        <div v-for="menu in menuList" :key="menu.id">
          <el-submenu v-if="menu.children.length > 0" :index="menu.id + ''">
          <template slot="title">
            <i :class="menu.menuIcon"></i>
            <span>{{menu.menuName}}</span>
          </template>
          <el-menu-item :index="menu.id + '-' + subMenu.id" v-for="subMenu in menu.children" :key="subMenu.id" class="jz-menu-item">
            <router-link class="jz-submenu" :to="{path: '' + subMenu.menuPath}" @click.native="changeMenu(menu.id, subMenu.id)">
              <i :class="subMenu.menuIcon"></i>
              <span>{{subMenu.menuName}}</span>
            </router-link>
          </el-menu-item>
        </el-submenu>
          <el-menu-item v-else :index="menu.id + ''" class="jz-menu-item">
            <router-link class="jz-submenu" :to="{path: '' + menu.menuPath}" @click.native="changeMenu(menu.id, '')">
              <i :class="menu.menuIcon"></i>
              <span>{{menu.menuName}}</span>
            </router-link>
          </el-menu-item>
        </div>
      </el-menu>
  </div>
</template>

<script>
// import menus from '../assets/js/Menus'
export default {
  name: 'PageNav',
  data () {
    return {
      menuList: [],
      currentMenu: this.$store.state.user.currentMenu,
      isCollapse: false
    }
  },
  created () {
    let self = this;
    this.$bus.$on('triggerUpdateMenuList', function (data) {
      if (data !== undefined || data !== '') {
        self.initMenu()
      }
    });
    if (this.$store.state.user.userId !== '' && this.$store.state.user.userId !== undefined){
      this.initMenu()
    }
  },
  methods: {
    initMenu () {
      let self = this;
      this.$api.management.system.menu.getMenuTreeForRole(this.$store.state.user.roleId).then((result) => {
        if (result.code === 200) {
          self.menuList = result.data
        }
      })
    },
    changeMenu (menuId, subMenuId) {
      let currentMenu = ''
      if (subMenuId === '') {
        currentMenu = menuId + ''
      } else {
        currentMenu = menuId + '-' + subMenuId
      }
      this.$store.dispatch('setCurrentMenu', currentMenu)
    }
  }
}
</script>

<style scoped>
  .jz-nav{
    /*height: 100%;*/
    /*background-color: var(--navBgColor);*/
    background-color: #EEF0EE;
    border-left: 6px solid var(--greenBorder) !important;
  }
  .jz-nav-menu:not(.el-menu--collapse){
    width: 220px;
  }
  .jz-menu-list{
    background-color: #EEF0EE;
    height: 60px;
    font-size: 18px;
    color: #666;
    text-align: center;
    line-height: 60px;
    border-bottom: 1px solid #CDC;
  }
  .jz-menu-list i{
    padding: 15px;
    font-size: 30px;
    color: #666;
  }
  .jz-menu-list i:hover{
    cursor: pointer;
  }
  .jz-submenu{
    color: #666;
    display: block;
  }
  .jz-submenu:hover,
  .jz-submenu:hover i{
    color: #49f;
  }
  .el-menu .is-active > a{
    color: #49f;
  }
  .el-menu{
    border: none;
  }
  .el-menu--collapse .jz-submenu span,
  .el-menu--collapse .el-submenu span{
    display: none;
  }
  .jz-menu-item:hover{
    background: #e6e6e6 !important;
  }
</style>
<style>
  .el-submenu__title:hover{
    background: #e6e6e6 !important;
  }
</style>
