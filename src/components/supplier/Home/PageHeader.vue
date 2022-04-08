<template>
  <div class="jz-home-head">
    <div class="jz-head-top">
      <div class="jz-top-con">
        <span>当前用户：{{ username }}</span>
        <span>上次登录时间：{{ formatTime(lastLoginTime) }}</span>
        <span v-if="roleId !== 29">
          <el-badge :value="confirmTotal" :max="99" class="jz-item" style="cursor: pointer;"
                    @click.native="linkConfirm">采购订单待确认</el-badge>
        </span>
        <span v-if="userType === 3" @click="refresh" style="cursor: pointer;">数据更新</span>
        <span v-if="userType != 0" @click="password" style="cursor: pointer;">修改密码</span>
        <span @click="logout" style="cursor: pointer;">退出登录</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-badge :value="infoSize" :max="99" class="item" @click.native="dropdownItem('','列表')">
              <i class="el-icon-bell"></i>
            </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div v-if="infoList.length != 0">
              <el-dropdown-item @click.native="dropdownItem(info,'详情')" v-for="(info,index) in infoList" :key="index">
                {{ info.title }}
              </el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="jz-head-bot">
      <div class="jz-bot-con">
        <div class="jz-head-logo">
          <img :src="logoUrl" alt="">
          <strong>{{ webName }}</strong>
        </div>
        <page-nav></page-nav>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
import PageNav from "./PageNav";

export default {
  name: "PageHeader",
  components: {PageNav},
  data() {
    return {
      userType: this.$store.state.user.type,
      roleId: this.$store.state.user.roleId,
      username: this.$store.state.user.username,
      lastLoginTime: this.$store.state.user.lastLoginTime,
      infoList: [],
      infoSize: 0,
      confirmTotal: 0,
      webName: this.$store.state.system.webName,
      logoUrl: this.$store.state.system.logoUrl,
    }
  },
  created() {
    if (this.$store.state.user.userId !== '' && this.$store.state.user.userId !== undefined) {
      this.getInfoTitle();
      this.getUnconfirmed();
    }
  },
  methods: {
    getUnconfirmed() {
      this.$api.supplier.procurement.infoMaintenance.orderStatus.getUnconfirmed().then(res => {
        if (res.code === 200) {
          this.confirmTotal = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    linkConfirm() {
      this.$router.push('/procurement/infoMaintenance/orderConfirm')
    },
    password() {
      this.$router.push('/password')
    },
    logout() {
      let self = this;
      self.$api.authc.logout().then(result => {
        if (result.code === 200) {
          self.$store.dispatch('cleanUser');
          self.$router.push('/login')
        } else {
          self.$router.push('/login')
        }
      })
    },
    formatTime(value) {
      return formatDateTime(value)
    },
    getInfoTitle() {
      let filter = {};
      filter.infoStateType = 1;
      filter.limit = 5;
      filter.page = 1;
      filter.type = 1;
      this.$api.supplier.information.getAll(filter).then(res => {
        if (res.code === 200) {
          this.infoList = res.data.records;
          this.infoSize = res.data.total;
        }
      })
    },
    dropdownItem(data, type) {
      let self = this;
      let menus = []
      self.$api.management.system.menu.getMenuTreeForRole(this.$store.state.user.roleId).then((result) => {
        if (result.code === 200) {
          menus = result.data
          menus.forEach(menu => {
            if (menu.menuName === '信息交流') {
              let currentSubMenu = menu.children
              this.$store.dispatch('setCurrentSubMenu', currentSubMenu)
              menu.children.forEach(sub => {
                if (sub.menuName === '待回复信息') {
                  let currentMenu = sub.id + ''
                  this.$store.dispatch('setCurrentMenu', currentMenu)
                }
              })
            }
          })
          this.$bus.$emit('refresh')
          if (type === '列表') {
            this.$router.push({path: '/information/reply'})
          } else if (type === '详情') {
            this.$router.push({path: '/information/' + data.id})
          }
        }
      })
    },
    refresh() {
      this.$api.supplier.system.dataRefresh().then(res => {
        if (res.code === 200) {
          this.$message.success('定时任务触发成功，数据正在导入中')
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.jz-home-head {
  width: 100%;
  min-width: 1200px;
  height: 110px;
  position: fixed;
  /*left: 0;*/
  top: 0;
  z-index: 9;
}

.jz-head-top {
  width: 100%;
  min-width: 1200px;
  height: 30px;
  background: #f9f9f9;
}

.jz-top-con {
  width: 100%;
  min-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: flex-end;
}

.jz-top-con > span {
  margin-left: 20px;
  font-size: 14px;
  line-height: 30px;
  color: #666;
}

.jz-top-con > span:nth-child(3):hover, .jz-top-con > span:nth-child(4):hover, .jz-top-con > span:nth-child(5):hover {
  color: #0b84d5;
  text-decoration: underline;
}

.jz-head-bot {
  width: 100%;
  min-width: 1200px;
  height: 80px;
  background: #272c30;
}

.jz-bot-con {
  width: 100%;
  min-width: 1200px;
  margin: auto;
  display: flex;
}

.jz-head-logo {
  width: 300px;
  height: 80px;
  line-height: 80px;
  font-size: 18px;
  color: #fff;
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.jz-head-logo img {
  height: 50px;
  margin-right: 20px;
}

.item {
  margin-left: 10px;
  margin-right: 30px;
  line-height: 30px;
  font-size: 20px;
}

.item:hover {
  cursor: pointer;
}

/deep/ .el-badge__content.is-fixed {
  top: -1px;
  right: -10px;
  transform: scale(0.9, 0.9)
}

/*/deep/ .el-dropdown-menu{*/
/*  width: 200px !important;*/
/*}*/
</style>
