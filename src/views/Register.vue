<template>
  <div class="jz-register">
    <page-header v-if="title !== '注册'"></page-header>
    <div class="jz-register-title" v-if="title === '注册'">{{ title }}</div>
    <div class="jz-register-title" style="margin-top: 110px" v-else>{{ title }}</div>
    <div class="jz-register-form">
      <el-form ref="form" :model="form.model" :rules="form.formRules" label-width="170px">
        <el-form-item class="jz-form-split" v-if="!form.show" label-width="0px">
          <el-form-item label="账号" prop="username">
            <el-input placeholder="请输入注册账号" v-model="form.model.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" show-password placeholder="请输入密码" v-model="form.model.password"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="提示问题" prop="problem">
            <el-select v-model="form.model.problem" placeholder="请选择问题">
              <el-option
                  v-for="(item,index) in problemList"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="答案" prop="answer">
            <el-input placeholder="请输入答案" v-model="form.model.answer"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="公司名称" prop="companyName">
            <el-input placeholder="请输入公司名称" v-model="form.model.companyName"></el-input>
          </el-form-item>
          <el-form-item label="公司地址" prop="companyAddress">
            <el-input placeholder="请输入公司地址" v-model="form.model.companyAddress"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="电子邮箱" prop="companyEmail">
            <el-input placeholder="请输入电子邮箱" v-model="form.model.companyEmail"></el-input>
          </el-form-item>
          <el-form-item label="公司网址" prop="companyWebsite">
            <el-input placeholder="请输入公司网址" v-model="form.model.companyWebsite"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="电话号码" prop="phone">
            <el-input placeholder="请输入电话号码" v-model="form.model.phone"></el-input>
          </el-form-item>
          <el-form-item label="传真" prop="companyFax">
            <el-input placeholder="请输入传真" v-model="form.model.companyFax"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="技术负责人" prop="technicalDirector">
            <el-input placeholder="请输入技术负责人" v-model="form.model.technicalDirector"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="technicalDirectorPhone">
            <el-input placeholder="请输入联系方式" v-model="form.model.technicalDirectorPhone"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="财务负责人" prop="financeDirector">
            <el-input placeholder="请输入财务负责人" v-model="form.model.financeDirector"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="financeDirectorPhone">
            <el-input placeholder="请输入联系方式" v-model="form.model.financeDirectorPhone"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="销售负责人" prop="saleDirector">
            <el-input placeholder="请输入销售负责人" v-model="form.model.saleDirector"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="saleDirectorPhone">
            <el-input placeholder="请输入联系方式" v-model="form.model.saleDirectorPhone"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="行业经验（年）" prop="industryExperience" style="width: 50%">
            <el-input-number v-model="form.model.industryExperience"></el-input-number>
          </el-form-item>
          <el-form-item label="拟供物资排名" prop="proposedSuppliesTop" style="width: 50%">
            <el-input-number v-model="form.model.proposedSuppliesTop"></el-input-number>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-form-split">
          <el-form-item label="发票限额" prop="quota" style="width: 50%">
<!--            <el-input-number v-model="form.model.quota" auto-complete="off" :precision="2"-->
<!--                             :controls="false"></el-input-number>-->
            <el-input v-model="form.model.quota" onkeyup="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="运输周期" prop="supplierHaulCycle" style="width: 50%">
            <el-input placeholder="请输入运输周期" onkeyup="value=value.replace(/[^\d]/g,'')" v-model="form.model.supplierHaulCycle">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="主营物资" prop="mainMaterials">
          <el-select v-model="form.model.mainMaterials" placeholder="请选择主营物资">
            <el-option
                v-for="(item,index) in mainList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他主营物资" prop="otherMainMaterials">
          <el-input type="textarea" placeholder="请输入其他主营物资" v-model="form.model.otherMainMaterials"></el-input>
        </el-form-item>
        <el-form-item label="拟供物资" prop="proposedSupplies">
          <el-select v-model="form.model.proposedSupplies" placeholder="请选择拟供物资">
            <el-option
                v-for="(item,index) in supplieList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他拟供物资" prop="otherProposedSupplies">
          <el-input type="textarea" placeholder="请输入其他拟供物资" v-model="form.model.otherProposedSupplies"></el-input>
        </el-form-item>
        <el-form-item label="现行质量体系" prop="currentQualitySystem">
          <el-input type="textarea" placeholder="请输入现行质量体系" v-model="form.model.currentQualitySystem"></el-input>
        </el-form-item>
        <el-form-item label="主要竞争对手" prop="mainCompetitors">
          <el-input type="textarea" placeholder="请输入主要竞争对手" v-model="form.model.mainCompetitors"></el-input>
        </el-form-item>
        <el-form-item label="目前公司主要用户" prop="nowCompanyMainCustomers">
          <el-input type="textarea" placeholder="请输入目前公司主要用户" v-model="form.model.nowCompanyMainCustomers"></el-input>
        </el-form-item>
        <el-form-item label="拟供物资行业前六名列举" prop="topSix">
          <el-input type="textarea" placeholder="请输入拟供物资行业前六名列举" v-model="form.model.topSix"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/supplier/Home/PageHeader";

export default {
  name: "RegisterForm",
  components: {PageHeader},
  data() {
    let checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/
      if (value === '' || value === undefined) {
        return callback(new Error('邮箱不能为空'))
      } else if (mailReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱格式'))
      }
    };
    let phoneRules = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (value === '' || value === undefined) {
        callback(new Error('联系电话不能为空'))
      } else if (!Number.isInteger(+value)) {
        callback(new Error('请输入数字值'))
      } else if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话号码格式不正确'))
      }
    };
    let technicalPhoneRules = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (value === '' || value === undefined || phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('电话号码格式不正确'))
      }
    };
    return {
      title: '注册',
      form: {
        show: false,
        model: {
          userId: '',
          supplierId: '',
          problem: '',
          mainMaterials: '',
          proposedSupplies: ''
        },
        formRules: {
          username: [{required: true, message: '账号不能为空', trigger: 'blur'}],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 6, max: 20, message: '密码为6-20位', trigger: 'blur'}
          ],
          problem: [{required: true, message: '提示问题不能为空', trigger: 'blur'}],
          answer: [{required: true, message: '答案不能为空', trigger: 'blur'}],
          companyName: [{required: true, message: '公司名称不能为空', trigger: 'blur'}],
          companyAddress: [{required: true, message: '公司地址不能为空', trigger: 'blur'}],
          companyEmail: [{required: true, validator: checkEmail, trigger: 'blur'}],
          phone: [{required: true, validator: phoneRules, trigger: 'blur'}],
          technicalDirectorPhone: [{required: false, validator: technicalPhoneRules, trigger: 'blur'}],
          financeDirectorPhone: [{required: false, validator: technicalPhoneRules, trigger: 'blur'}],
          saleDirectorPhone: [{required: false, validator: technicalPhoneRules, trigger: 'blur'}],
          industryExperience: [{required: true, message: '行业经验不能为空', trigger: 'blur'}],
          mainMaterials: [{required: true, message: '主营物资不能为空', trigger: 'blur'}],
          proposedSupplies: [{required: true, message: '拟供物资不能为空', trigger: 'blur'}],
          quota: [{required: true, message: '发票限额不能为空', trigger: 'blur'}],
          supplierHaulCycle: [{required: true, message: '运输周期不能为空', trigger: 'blur'}]
        }
      },
      problemList: [],
      mainList: [],
      supplieList: []
    }
  },
  created() {
    this.getDict('problem')
    this.getDict('mainMaterials')
    this.getDict('proposedSupplies')
    this.title = this.$route.query.title
    this.form.show = JSON.parse(this.$route.query.show)
    let id = this.$store.state.user.userId
    if (id !== undefined && id !== '') {
      this.getMessage(id)
    }
  },
  methods: {
    getMessage(id) {
      this.$api.supplier.system.getSupplier(id).then(res => {
        if (res.code === 200) {
          if (res.data !== undefined) {
            this.form.model = res.data
            this.form.model.userId = id
            this.form.model.supplierId = res.data.supplierId
            this.form.model.problem = String(res.data.problem)
            this.form.model.mainMaterials = String(res.data.mainMaterials)
            this.form.model.proposedSupplies = String(res.data.proposedSupplies)
          }
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.show === false) {
            this.$api.authc.register(this.form.model).then(res => {
              if (res.code === 200) {
                let msg;
                if (res.data) {
                  msg = '您已注册成功,进入备选池';
                } else {
                  msg = '您已注册成功,请登录';
                }
                this.$message.success(msg)
                // 清空表单验证信息
                this.$nextTick(() => {
                  this.$refs['form'].resetFields()
                })
                this.$router.push('/login')
              } else {
                this.$message.error(res.code + ':' + res.msg)
              }
            })
          } else {
            this.$api.supplier.system.updateSupplier(this.form.model).then(res => {
              if (res.code === 200) {
                this.$message.success(this.title + '成功')
                this.$router.push('/home')
              } else {
                this.$message.error(res.code + ':' + res.msg)
              }
            })
          }
        }
      })
    },
    getDict(type) {
      this.$api.supplier.system.dict(type).then(res => {
        if (res.code === 200) {
          if (type === 'problem') {
            this.problemList = res.data
          } else if (type === 'mainMaterials') {
            this.mainList = res.data
          } else if (type === 'proposedSupplies') {
            this.supplieList = res.data
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.jz-register {
  width: 100%;
  height: auto;
  /*margin: 110px auto;*/
}

.jz-register-title {
  width: 100%;
  height: 120px;
  line-height: 120px;
  font-size: 28px;
  text-align: center;
  font-weight: bold;
}

.jz-register-form {
  width: 1200px;
  height: auto;
  margin: auto;
  padding: 40px 80px 40px 40px;
  border: 1px solid #999;
}

.jz-form-split > /deep/ .el-form-item__content {
  display: flex;
  justify-content: space-between;
  margin-left: 0 !important;
}

.jz-form-split > /deep/ .el-form-item__content > div {
  width: 50%;
}

/deep/ .el-select {
  width: 100%;
}

/deep/ .el-textarea textarea::placeholder {
  font-family: "Microsoft YaHei UI";
}

/deep/ .jz-quota.el-input-number .el-input__inner {
  text-align: left;
}
</style>
