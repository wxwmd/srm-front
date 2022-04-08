<template>
  <div class="jz-password">
    <div class="jz-password-title">修改密码</div>
    <!--  Form  -->
    <div class="jz-form">
      <el-form :model="user.model" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input size="small" type="password" v-model="user.model.oldPwd" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input size="small" type="password" v-model="user.model.newPwd" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordAgain">
          <el-input size="small" type="password" v-model="user.model.passwordAgain" show-password/>
        </el-form-item>
      </el-form>
      <div class="jz-pwd">
        <button class="jz-btn jz-btn-submit" @click="submitForm('ruleForm')">提交</button>
        <button class="jz-btn" @click="resetForm('ruleForm')">重置</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Password",
  data(){
    let checkRawPwd = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    };
    let validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.model.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return{
      userName: this.$store.state.user.userName,
      user: {
        model:{
          userId: this.$store.state.user.userId,
        },
      },
      rules: {
        oldPwd: [
          {required: true, validator: checkRawPwd, trigger: 'blur'}
        ],
        newPwd: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          { min: 6, max: 20, message: '密码为6-20位', trigger: 'blur' }
        ],
        passwordAgain: [
          {required: true, validator: validatePwd, trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.supplier.system.updatePassword(this.user.model).then((result) => {
            if (result.code === 200) {
              this.$message.success('密码修改成功！请重新登陆！');
              let timer = setTimeout(function () {
                self.$router.push('/login');
                clearTimeout(timer)
              }, 3000)
            } else {
              this.$message.error(result.msg)
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
  .jz-password {
    width: 60%;
    height: 500px;
    margin: 200px auto;
    padding: 0;
    background: #fff;
    box-shadow: 0 0 10px #999;
    border-radius: 10px;
  }
  .jz-password-title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #333;
    background: #ddd;
    border-radius: 10px 10px 0 0;
  }
  .jz-form{
    width: 60%;
    margin: 50px auto 0;
  }
  .jz-pwd{
    display: flex;
    justify-content: flex-end;
  }
  .jz-btn{
    padding: 0 20px;
    margin-right: 0;
    margin-left: 20px;
  }
</style>
