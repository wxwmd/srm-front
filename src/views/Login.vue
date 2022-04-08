<template>
  <div class="jz-login">
    <div class="jz-login-main">
      <div class="jz-login-left">
        <h1><i>{{webName}}</i></h1>
        <div class="jz-logo">
          <img :src="logoUrl" alt="">
        </div>
        <div class="jz-welcome"><i>welcome</i></div>
      </div>
      <div class="jz-login-right">
        <div class="jz-login-title">Login</div>
        <el-form class="jz-login-form" :model="user" ref="form" :rules='rules'>
          <el-form-item prop="username" class="jz-login-input">
            <span class="jz-login-label">Username</span>
            <el-input v-model="user.username" placeholder="Username"/>
          </el-form-item>
          <el-form-item prop="password" class="jz-login-input">
            <span class="jz-login-label">Password</span>
            <el-input type="password" v-model="user.password" placeholder="Password" show-password/>
          </el-form-item>
<!--          <el-form-item prop="type" class="jz-login-input">-->
<!--            <span class="jz-login-label">Type</span>-->
<!--            <el-select v-model="user.userType" placeholder="Type">-->
<!--              <el-option-->
<!--                v-for="item in typeList"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </el-form>
        <div class="jz-login-box-submit">
          <button class="jz-login-btn" @click="login('form')">登录</button>
        </div>
        <div class="jz-login-bot">
          <span @click="forget">忘记密码？</span>
          <span @click="register">注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from "element-ui/packages/message";

export default {
  name: 'Login',
  data() {
    return {
      user: {
        username: '',
        password: '',
        // userType: ''
      },
      webName:this.$store.state.system.webName,
      logoUrl:this.$store.state.system.logoUrl,
      // typeList: [
      //   {
      //     value: 0,
      //     label: '采购员'
      //   }, {
      //     value: 1,
      //     label: '供应商'
      //   }, {
      //     value: 2,
      //     label: '后台管理员'
      //   }, {
      //     value: 3,
      //     label: '企业用户'
      //   }
      // ],
      rules: {
        username: [
          {required: true, trigger: 'blur'}
        ],
        password: [
          {required: true, trigger: 'blur'}
        ],
        // userType: [
        //   {required: true, trigger: 'blur'}
        // ]
      }
    }
  },
  created() {
    this.$store.dispatch('cleanUser');
  },
  methods: {
    login(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.authc.login(this.user).then(result => {
            if(this.user.password === 'qy123456') {
              Message.error('密码安全性过低,建议修改密码！');
            }
            if (result.code === 200) {
              this.getSyetem()
              self.$store.dispatch('cleanUser');
              self.$store.dispatch('setUser', result.data);
              if (self.$store.state.user.roleType === '1'){
                this.initMenu()
              } else if (self.$store.state.user.roleType === '2') {
                self.$router.push('/home')
              } else if (self.$store.state.user.roleType === '4' || self.$store.state.user.roleType === '5') {
                self.$router.push('/procurement/plan/overview')
              } else if (self.$store.state.user.roleType === '6') {
                self.$router.push('/news/management')
              }
            } else {
              self.$message.error(result.msg)
            }
          })
        }
      })
    },
    initMenu () {
      let self = this;
      this.$api.management.system.menu.getMenuTreeForRole(this.$store.state.user.roleId).then((result) => {
        if (result.code === 200) {
          self.menuList = result.data
          let menuHome = result.data[0].menuPath
          self.$router.push(menuHome)
        }
      })
    },
    getSyetem(){
      this.$api.management.system.resource.getAll().then(res => {
        if (res.code === 200){
          let data = ''
          data = res.data.records[0].config
          this.system = JSON.parse(data)
          this.$store.dispatch('setSystem', this.system);
        }
      })
    },
    forget() {
      this.$router.push('/forgetPassword')
    },
    register() {
      this.$router.push('/registerArtical')
    }
  }
}
</script>

<style scoped>
  /*/deep/ body {*/
  /*  height: 100% !important;*/
  /*  overflow-y: scroll;*/
  /*}*/
  .jz-login {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .jz-login-main {
    width: 50%;
    height: 600px;
    background: #fff;
    box-shadow: 0 0 3px #000 inset;
    display: flex;
    -webkit-animation-name: comeIn; /*动画名称*/
    -webkit-animation-duration: 2s; /*动画持续时间*/
    -webkit-animation-iteration-count: 1; /*动画次数*/
    -webkit-animation-delay: 0s;
  }
  .jz-login-left {
    width: 50%;
    height: 100%;
    background: linear-gradient(45deg, #000, #999);
  }
  h1 {
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #fff;
    font-size: 20px;
    padding-left: 20px;
  }
  .jz-logo {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: center;
    margin: 80px auto 130px;
  }
  .jz-logo img {
    height: 100%;
  }
  .jz-welcome {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 60px;
    font-weight: bold;
    color: #fff;
  }
  .jz-login-right {
    width: 50%;
    padding: 30px 50px;
  }
  .jz-login-title {
    color: #000;
    font-size: 24px;
    font-weight: bold;
    margin-top: 30px;
  }
  .jz-login-form {
    margin-top: 30px;
  }
  .jz-login-label {
    display: block;
    line-height: 30px;
    height: 30px;
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
  /deep/ .el-input__inner {
    border: none;
    border-bottom: 1px solid #999;
    border-radius: 0;
    padding: 0;
    font-size: 16px;
  }
  /deep/ .el-select {
    width: 100%;
  }
  .jz-login-box-submit {
    margin: 50px auto 0;
  }
  .jz-login-btn {
    width: 100%;
    height: 50px;
    background: #333;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 8px;
  }
  .jz-login-bot {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .jz-login-bot span {
    color: #999;
    font-size: 14px;
  }
  @-webkit-keyframes comeIn {
    0% {
      opacity: .3;
      transform: translate(0, 150px);
      -webkit-transform: translate(0, 150px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
      -webkit-transform: translate(0, 0);
    }
  }
</style>
