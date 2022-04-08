<template>
  <div class="jz-supplier-container">
    <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="150px">
      <el-form-item label="发票号" prop="invoiceNumber">
        <el-input class="jz-input" oninput="value=value.replace(/[^\d.]/g, '')" v-model="form.model.invoiceNumber"/>
      </el-form-item>
      <el-form-item label="发票代码" prop="invoiceCode">
        <el-input class="jz-input" v-model="form.model.invoiceCode"/>
      </el-form-item>
      <el-form-item label="发票日期" prop="invoiceDate">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="form.model.invoiceDate"
          type="date"
          placeholder="发票日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="工厂" prop="plant">
        <el-select v-model="form.model.plant" filterable placeholder="请选择">
          <el-option
            v-for="item in plantList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="不含税金额" prop="taxExclusivePrice">
        <el-input class="jz-input" oninput="value=value.replace(/[^\d.]/g, '')" v-model="form.model.taxExclusivePrice"/>
      </el-form-item>
      <el-form-item label="税率" prop="taxRate">
        <el-input class="jz-input" oninput="value=value.replace(/[^\d.]/g, '')" v-model="form.model.taxRate">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="税额" prop="taxAmount">
        <el-input class="jz-input" oninput="value=value.replace(/[^\d.]/g, '')" v-model="form.model.taxAmount"/>
      </el-form-item>
      <el-form-item label="税价合计" prop="taxPriceTotal">
        <el-input class="jz-input" oninput="value=value.replace(/[^\d.]/g, '')" v-model="form.model.taxPriceTotal"/>
      </el-form-item>
<!--      <el-form-item label="是否折扣" prop="invoiceCode">-->
<!--        <el-radio v-model="form.model.radio" label="0">是</el-radio>-->
<!--        <el-radio v-model="form.model.radio" label="1">否</el-radio>-->
<!--      </el-form-item>-->
      <el-form-item label="折扣原因" prop="discountReason">
        <el-select v-model="form.model.discountReason" placeholder="请选择折扣原因">
          <el-option
            v-for="(item,index) in discountList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="红字发票信息表编码" prop="redInvoiceInformationCode">
        <el-input type="textarea" class="jz-input" v-model="form.model.redInvoiceInformationCode"/>
      </el-form-item>
    </el-form>
    <div class="jz-form-btn">
      <el-button type="primary" plain @click="save('form')">提 交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rebate",
  data(){
    return{
      form:{
          formRules:{
            invoiceNumber: [
              {required: true, message: '发票号不能为空', trigger: 'blur'}
            ],
            invoiceCode: [
              {required: true, message: '发票代码不能为空', trigger: 'blur'}
            ],
            invoiceDate: [
              {required: true, message: '开票日期不能为空', trigger: 'blur'}
            ],
            plant: [
              {required: true, message: '工厂不能为空', trigger: 'blur'}
            ],
            taxExclusivePrice: [
              {required: true, message: '不含税金额不能为空', trigger: 'blur'}
            ],
            taxRate: [
              {required: true, message: '税率不能为空', trigger: 'blur'}
            ],
            taxAmount: [
              {required: true, message: '税额不能为空', trigger: 'blur'}
            ],
            taxPriceTotal: [
              {required: true, message: '税价合计不能为空', trigger: 'blur'}
            ],
            redInvoiceInformationCode: [
              {required: true, message: '红字发票信息表编码不能为空', trigger: 'blur'}
            ],
            discountReason: [
              {required: true, message: '折扣原因不能为空', trigger: 'blur'}
            ]
        },
        model:{}
      },
      discountList:[],
      plantList:[]
    }
  },
  created() {
    this.getDict('plant')
    this.getDict('discountReason')
  },
  methods: {
    getDict(typeName) {
      this.$api.supplier.system.dict(typeName).then(res => {
        if (res.code === 200) {
          if (typeName === 'discountReason'){
            this.discountList = res.data
          } else if (typeName === 'plant') {
            this.plantList = res.data
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.model.taxExclusivePrice = parseFloat(this.form.model.taxExclusivePrice).toFixed(2)
          this.form.model.taxRate = parseFloat(this.form.model.taxRate) / 100
          this.form.model.taxAmount = parseFloat(this.form.model.taxAmount).toFixed(2)
          this.form.model.taxPriceTotal = parseFloat(this.form.model.taxPriceTotal).toFixed(2)
          this.$api.supplier.procurement.finance.rebate.add(this.form.model).then(res => {
            if (res.code === 200){
              this.$router.push({path: '/procurement/finance/bill'});
            } else {
              this.$message.error(res.code + ":" + res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  /deep/ .jz-input{
    width: 50%;
  }
  /deep/ .jz-form-btn {
    display: flex;
    justify-content: flex-start;
    margin-left: 150px;
  }
  /deep/ .el-select{
    width: 50%;
  }
</style>
