<template>
  <div class="jz-sub-menu-bj">
    <el-menu unique-opened class="jz-sub-menu"
             :default-active="currentMenu"
             text-color="#666"
             active-text-color="#fff"
             background-color="#fff">
      <div v-for="menu in subMenus" :key="menu.id" class="jz-sub-list">
        <el-submenu v-if="menu.children !== undefined && menu.children.length > 0" :index="menu.id + ''">
          <template slot="title">
            <i class="el-icon-folder-add"></i>
            <span>{{menu.menuName}}</span>
          </template>
          <el-menu-item :index="menu.id + '-' + subMenu.id" v-for="subMenu in menu.children" :key="subMenu.id"
                        class="jz-menu-item">
            <router-link class="jz-submenu" :to="{path: '' + subMenu.menuPath}"
                         @click.native="changeMenu(menu.id, subMenu.id)">
              <i class="el-icon-folder-remove"></i>
              <span>{{subMenu.menuName}}</span>
            </router-link>
<!--            <i v-if="subMenu.menuName === '采购订单确认'" class="jz-total">{{total}}</i>-->
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="menu.id + ''" class="jz-menu-item">
          <router-link class="jz-submenu" @click.native="changeMenu(menu.id, '')" :to="{path: '' + menu.menuPath}">
            <i class="el-icon-folder-remove"></i>
            <span>{{menu.menuName}}</span>
          </router-link>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SubMenu',
  data() {
    return {
      path: '',
      currentMenu: this.$store.state.user.currentMenu,
      subMenus: this.$store.state.user.currentSubMenu,
      menus: [],
      // total:0
    }
  },
  created() {
    // this.getUnconfirmed()
  },
  watch: {
    '$route': {
      handler(to) {
        this.path = to.path;
      },
      immediate: true
    }
  },
  mounted() {
    this.$bus.$on('refresh', () => {
      this.currentMenu = this.$store.state.user.currentMenu
      this.subMenus = this.$store.state.user.currentSubMenu
    })
  },
  methods: {
    changeMenu(menuId, subMenuId) {
      if (subMenuId !== '') {
        let currentMenu = menuId + '-' + subMenuId
        this.$store.dispatch('setCurrentMenu', currentMenu)
      } else {
        let currentMenu = menuId + subMenuId
        this.$store.dispatch('setCurrentMenu', currentMenu)
      }
    }
  }
}
</script>

<style scoped>
  .jz-sub-menu-bj{
    width: 260px;
    min-height: calc(100% - 110px);
    height: auto;
    position: fixed;
    left: 0;
    top: 110px;
    z-index: 9;
    box-shadow: 0 0 5px #ddd;
    overflow-y: scroll;
    background: #fff;
  }
  .jz-sub-menu-bj::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  .jz-sub-menu-bj::-webkit-scrollbar-track {
    background-color: #e6e6e6;
  }
  .jz-sub-menu-bj::-webkit-scrollbar-thumb {
    border-radius: 10px;
    width: 50%;
    background: rgba(0, 0, 0, 0.4);
  }
  .jz-sub-menu {
    width: 100%;
    /*min-height: calc(100% - 110px);*/
    height: 500px;
    background: #fff;
    /*box-shadow: 0 0 5px #ddd;*/
    padding: 40px 0;
    /*border-radius: 6px;*/
    /*position: fixed;*/
    /*left: 0;*/
    /*top: 110px;*/
    /*z-index: 9;*/
  }
  /deep/ .el-menu-item, /deep/ .el-submenu__title{
    height: 45px;
    line-height: 45px;
  }
  .jz-sub-list{
    margin: 2px auto;
  }
  .jz-sub-menu a {
    display: flex;
    width: 100%;
  }
  .jz-sub-menu a i {
    /*display: none;*/
    line-height: 40px;
    margin-right: 5px;
  }
  /deep/ .el-submenu .el-menu-item{
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-menu-item.is-active a{
    color: #fff;
  }
  /deep/ .el-menu-item:hover a{
    color: #fff;
  }
  /deep/ .el-submenu .el-menu-item:hover i{
    color: #fff;
  }
  .jz-sub-menu .jz-submenu-active {
    background: #0b84d5;
    color: #fff;
    padding-left: 10px;
  }
  .jz-sub-menu .jz-submenu-active i {
    display: block;
  }
  /deep/ .el-submenu__title:hover {
    background: #409EFF !important;
    color: #fff !important;
  }
  /deep/ .el-submenu__title:hover i {
    color: #fff !important;
  }
  /deep/ .el-menu-item:hover {
    background: #409EFF !important;
    color: #fff !important;
  }
  /deep/ .el-menu-item.is-active {
    background: #409EFF !important;
  }
  /deep/ .el-menu-item:hover i{
    color: #fff !important;
  }
  /deep/ .el-submenu .el-menu-item{
    margin: 2px auto;
  }
  .jz-total{
    display: block;
    height: 20px;
    line-height: 20px !important;
    border-radius: 50%;
    padding: 0 3px;
    background: red;
    color: #fff;
    font-size: 12px;
    position: absolute;
    right: 10px;
    top: 10px;
  }
</style>
