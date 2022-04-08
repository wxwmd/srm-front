<template>
  <div class="jz-password">
    <div class="jz-password-title">忘记密码</div>
    <!--  Form  -->
    <div class="jz-form">
      <el-form :model="user.model" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input size="small" v-model="user.model.username"/>
        </el-form-item>
        <el-form-item label="提示问题" prop="problem">
          <el-select size="small" v-model="user.model.problem" placeholder="请选择问题">
            <el-option
              v-for="(item,index) in problemList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input size="small" v-model="user.model.answer"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input size="small" type="password" v-model="user.model.newPwd" show-password/>
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
    return{
      user: {
        model:{},
      },
      problemList:[],
      rules: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
        ],
        problem: [
          {required: true, message: '问题不能为空', trigger: 'blur'},
        ],
        answer: [
          {required: true, message: '答案不能为空', trigger: 'blur'},
        ],
        newPwd: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          { min: 6, max: 20, message: '密码为6-20位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDict()
  },
  methods:{
    getDict(){
      this.$api.supplier.system.dict('problem').then(res => {
        if (res.code === 200){
          this.problemList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.supplier.system.forgetPassword(this.user.model).then((result) => {
            if (result.code === 200) {
              this.$message.success('密码重置成功！请重新登陆！');
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
    margin: 30px auto;
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
    padding: 5px 15px;
    margin-right: 0;
    margin-left: 20px;
    background: #0b84d5;
    color: #fff;
    border: none;
    border-radius: 4px;
  }
  /deep/ .el-select{
    width: 100%;
  }
</style>
