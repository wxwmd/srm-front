<!--标准物资开票详情页面-->

<template>
  <div class="jz-form">
    <el-dialog title="标准物资开票" :close-on-click-modal="false" :visible.sync="combinedTicket.combinedShow" width="1200px" destroy-on-close>
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
                <el-input size="small" v-model="scope.row.withoutTaxAmount"  @change="caculate1($event,scope.row)"/>
              </template>
            </el-table-column>

            <el-table-column prop="taxRate" label="税率(%)">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxRate"/>
              </template>
            </el-table-column>

            <el-table-column prop="taxAmount" label="税额">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxAmount"/>
              </template>
            </el-table-column>

            <el-table-column prop="totalAmount" label="价税合计">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.totalAmount"/>
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
      notNullCheck:true,
      amountCheck:true,
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
      this.$confirm('确认操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs[formName].validate((valid) => {
          this.notNullCheck=true
          this.amountCheck=true
          if (valid) {
            this.form.model.splitData.forEach(item => {
              // 先进行校验，看看有没有填空的地方
              if (item.withoutTaxAmount === ''){
                this.$message.error("不含税金额不能为空！")
                this.notNullCheck=false
              }
              else if (item.taxRate === ''){
                this.$message.error("税率不能为空！")
                this.notNullCheck=false
              }
              else if (item.taxAmount === ''){
                this.$message.error("税额不能为空！")
                this.notNullCheck=false
              }
              else if (item.totalAmount === ''){
                this.$message.error("税价合计不能为空！")
                this.notNullCheck=false
              }
              else if (parseFloat(item.totalAmount)!==parseFloat(item.withoutTaxAmount)+parseFloat(item.taxAmount)){
                this.amountCheck=false
                this.$message.error("税价合计不等于不含税金额与税额之和！")
              }
            })

            if (this.notNullCheck && this.amountCheck) {
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
            }
          }
        })
      }).catch(() => {});
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
  }
}
</script>

<style scoped>

</style>
