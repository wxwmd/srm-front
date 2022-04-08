<template>
  <div class="jz-header">
    <div class="jz-header-title">
      <span>{{this.$store.state.system.adminName}}</span>
    </div>
    <div class="jz-header-user">
      <div class="jz-header-user-name">
        <a style="">欢迎用户 ：{{this.$store.state.user.username}}</a>
      </div>
      <el-dropdown>
        <div class="jz-header-user-name">
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="dialogFormVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-input type="text" v-model="ruleForm.userId" v-if="false"></el-input>
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input type="password" v-model="ruleForm.oldPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" >
          <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  data () {
    let checkRawPwd = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    };
    let checkNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 4 || value.length > 16) {
        callback(new Error('密码长度在4到16个字符'))
      } else {
        callback()
      }
    };
    let validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      ruleForm: {
        userId: this.$store.state.user.userId,
        newPwd: '',
        checkPass: '',
        oldPwd: ''
      },
      dialogFormVisible: false,
      rules: {
        newPwd: [
          { validator: checkNewPwd, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePwd, trigger: 'blur' }
        ],
        oldPwd: [
          { validator: checkRawPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    logout () {
      this.$api.authc.logout().then(result => {
        if (result.code === 200) {
          localStorage.clear();
          this.$router.push('/login')
        } else {
          this.$router.push('/login')
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.management.system.user.updatePassword(this.ruleForm).then(res => {
            if (res.code === 200) {
              this.$message.success('密码修改成功！')
              this.dialogFormVisible = false
              this.$router.push('/login')
            } else {
              this.$message.error('密码修改失败！')
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .jz-header{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-left: 6px solid var(--greenBorder) !important;
    border-right: 6px solid var(--greenBorder) !important;
    color: #EEE;
    background: var(--headerBgColor);
  }
  .jz-header-title{
    display: inline-block;
    font-size: 18px;
    line-height: 56px;
    padding-left: 20px;
    letter-spacing: 2px;
    /*font-style: italic;*/
    /*text-shadow: 3px 3px 15px #FFF, -3px -3px 15px #FFF;*/
  }
  .jz-logo img{
    height: 90%;
  }
  .jz-header-user{
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .jz-header-user-name{
    display: inline-block;
  }
  .jz-header-user-name a{
    color: #FFF;
    font-size: 15px;
  }
  .jz-header-user-name i{
    font-size: 16px;
    color: #FFF;
    cursor: pointer;
    border: 1px solid;
    margin-left: 10px;
  }
  .jz-header-user-name i:hover{
    color: #CCC;
  }
</style>
