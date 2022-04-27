<!--标准物资开票详情页面-->

<template>
  <div class="jz-form">
    <el-dialog title="开票" :close-on-click-modal="false" :visible.sync="combinedTicket.combinedShow" width="1200px" destroy-on-close>
      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="0px">
        <el-form-item>
          <el-table size="small" border
                    row-class-name="jz-table-row"
                    cell-class-name="jz-table-cell"
                    :data="form.model.splitData"
                    :header-cell-style="{background:'#f6f6f6'}"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column prop="purchaseOrder" label="订单号">
              <template slot-scope="scope">
                <span>{{scope.row.purchaseOrder}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="material" label="物料">
              <template slot-scope="scope">
                <span>{{scope.row.material}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hongProject" label="行项目">
              <template slot-scope="scope">
                <span>{{scope.row.hongProject}}</span>
              </template>
            </el-table-column>

<!--            <el-table-column prop="unitPrice" label="单价">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.unitPrice}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->

            <el-table-column prop="notOutInvoiceNumber" label="未开票数量">
              <template slot-scope="scope">
                <span>{{scope.row.notOutInvoiceNumber}}</span>
              </template>
            </el-table-column>


            <el-table-column prop="withoutTaxAmount" label="不含税金额">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.withoutTaxAmount"/>
              </template>
            </el-table-column>

            <el-table-column prop="withoutTaxAmount" label="税率(%)">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxRate" @change="caculate1($event,scope.row)"/>
              </template>
            </el-table-column>

            <el-table-column prop="taxAmount" label="税额">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxAmount" @change="caculate2($event,scope.row)"/>
              </template>
            </el-table-column>

            <el-table-column prop="totalAmount" label="价税合计">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.totalAmount" @change="caculate3($event,scope.row)"/>
              </template>
            </el-table-column>

            <el-table-column label="错误信息" v-if="!this.amountcheck">
              <template slot-scope="scope">
                <span v-if="scope.row.amountCheck===0">

                </span>
                <span v-if="scope.row.amountCheck===1" style="color: red">
                  金额不能为空
                </span>
                <span v-if="scope.row.amountCheck===2" style="color: red">
                  税价合计不等于不含税金额加税额
                </span>
              </template>
            </el-table-column>

          </el-table>
        </el-form-item>
      </el-form>
      <div class="jz-form-btn">
        <el-button type="primary" plain @click="save('form')">确 定</el-button>
      </div>


      <div class="jz-attention" v-if="fail" style="margin-top: 20px">
        <p>*您输入的金额不正确，进入单价校验环节</p>
        <p>*请输入每个项目对应的单价，系统将会对每个行项目的单价进行校验</p>
      </div>

      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="0px" v-if="fail" style="margin-top: 20px">
        <el-form-item>
          <el-table size="small" border
                    row-class-name="jz-table-row"
                    cell-class-name="jz-table-cell"
                    :data="form.model.splitData"
                    :header-cell-style="{background:'#f6f6f6'}"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column prop="purchaseOrder" label="订单号">
              <template slot-scope="scope">
                <span>{{scope.row.purchaseOrder}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="material" label="物料">
              <template slot-scope="scope">
                <span>{{scope.row.material}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="hongProject" label="行项目">
              <template slot-scope="scope">
                <span>{{scope.row.hongProject}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="inputUnitPrice" label="输入单价">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.inputUnitPrice"/>
              </template>
            </el-table-column>

            <el-table-column label="校验结果">
              <template slot-scope="scope">
                <span v-if="scope.row.unitPriceCheck===0">
                  待校验
                </span>
                <span v-if="scope.row.unitPriceCheck===-1" style="color: red">
                  错误
                </span>
                <span v-if="scope.row.unitPriceCheck===1" style="color: green">
                  正确
                </span>

              </template>
            </el-table-column>

          </el-table>
        </el-form-item>
      </el-form>
      <div class="jz-form-btn" v-if="fail">
        <el-button type="primary" plain @click="check('form')">校 验</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "InvoicingCombined",
  props:{
    combinedTicket:Object
  },
  data(){
    return{
      amountcheck:true,
      fail:false,
      visible: true,
      isAdd: false,
      form: {
        model: {
          splitData: [],
        },
        formRules:{
        },
      }
    }
  },
  created() {
    this.combinedTicket.combinedTicket.forEach(item => {
      this.form.model.splitData.push({unitPrice:item.unitPrice,purchaseOrder: item.purchaseOrder,material:item.material,hongProject:item.hongProject,notOutInvoiceNumber:item.notOutInvoiceNumber,withoutTaxAmount:"",taxAmount:"",totalAmount:"",supplierCode:this.$store.state.user.username,amountCheck:0,unitPriceCheck:0,inputUnitPrice:null})
    })
  },
  methods:{
    save(formName) {
      this.$refs[formName].validate((valid) => {
        this.amountcheck=true
        if (valid) {
          this.form.model.splitData.forEach(item => {
            //总金额是否填写
            item.notOutInvoiceNumber = parseFloat(item.notOutInvoiceNumber).toFixed(0)
            if(item.withoutTaxAmount === '' ||item.taxAmount===''||item.totalAmount===''){
              item.amountCheck = 1
              this.amountcheck=false
            } else {
              if (parseFloat(item.totalAmount)!==parseFloat(item.withoutTaxAmount)+parseFloat(item.taxAmount)){
                item.amountCheck=2
                this.amountcheck=false
              }
            }
          })
          //金额校验成功才能开票
          if (this.amountcheck){
            this.$api.supplier.procurement.finance.invoicing.combined(this.form.model.splitData).then(res => {
                if (res.code === 200){
                  if (res.data === null){
                    this.$parent.tableUtil.initTable()
                    this.combinedTicket.combinedShow = false
                    this.$message.success('开票成功')
                  } else {
                    this.$message.error('订单号为：' + res.data[0].purchaseOrder + '，物料号为：' + res.data[0].material + '，行项目为：' + res.data[0].hongProject + '的不含税总金额错误')
                    this.fail=true
                  }
                } else {
                this.fail=true
                this.$message.error(res.code + ":" + res.msg)
              }
            })
          } else{
            this.$message.error("金额填写有误，请查看每行的错误信息")
          }
        }
      })
    },
    check(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.model.splitData.forEach(item => {
            let inputUnitPrice=parseFloat(item.inputUnitPrice)
            if (item.unitPrice===inputUnitPrice){
              item.unitPriceCheck =1
            }else{
              item.unitPriceCheck =-1
            }
          })

        }
      })
    },
    beforeClose(done) {
      this.cleanVerifyMessage()
      done()
    },
    // 清空表单验证信息
    cleanVerifyMessage() {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    caculate1(event,param){
      if (param.withoutTaxAmount!==''){
        if (param.taxRate !==''){
          param.taxAmount=parseFloat(param.withoutTaxAmount) * parseFloat(param.taxRate) /100
          param.totalAmount=parseFloat(param.withoutTaxAmount) + parseFloat(param.taxAmount)
        }
      }
    },
    caculate2(event,param){
      if (param.withoutTaxAmount!==''){
        if (param.taxAmount!==''){
          param.taxRate=parseFloat(param.taxAmount) / parseFloat(param.withoutTaxAmount) *100
          param.totalAmount=parseFloat(param.withoutTaxAmount) + parseFloat(param.taxAmount)
        }
      }
    },
    caculate3(event,param){
      if (param.withoutTaxAmount!==''){
        if (param.totalAmount!==''){
            param.taxAmount=parseFloat(param.totalAmount) - parseFloat(param.withoutTaxAmount)
            param.taxRate=parseFloat(param.taxAmount) / parseFloat(param.withoutTaxAmount) *100
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
