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

            <el-table-column prop="unitPrice" label="单价">
              <template slot-scope="scope">
                <span>{{scope.row.unitPrice}}</span>
              </template>
            </el-table-column>

            <el-table-column prop="notOutInvoiceNumber" label="数量">
              <template slot-scope="scope">
                <span>{{scope.row.notOutInvoiceNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="aggregateAmount" label="不含税总金额">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.aggregateAmount"/>
              </template>
            </el-table-column>

            <el-table-column prop="taxAmount" label="税额">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxAmount"/>
              </template>
            </el-table-column>

            <el-table-column prop="totalAmount" label="税额">
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
      visible: true,
      isAdd: false,
      form: {
        model: {
          splitData: [],
        },
        formRules: {},
      }
    }
  },
  created() {
    this.combinedTicket.combinedTicket.forEach(item => {
      this.form.model.splitData.push({unitPrice:item.unitPrice,purchaseOrder: item.purchaseOrder,material:item.material,hongProject:item.hongProject,notOutInvoiceNumber:item.notOutInvoiceNumber,aggregateAmount:'',taxAmount:'',totalAmount:'',supplierCode:this.$store.state.user.username})
    })
  },
  methods:{
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let aggregateAmountShow = true
          this.form.model.splitData.forEach(item => {
            //总金额是否填写
            item.notOutInvoiceNumber = parseFloat(item.notOutInvoiceNumber).toFixed(3)
            if(item.aggregateAmount === ''){
              aggregateAmountShow = false
            } else {
              item.aggregateAmount = parseFloat(item.aggregateAmount).toFixed(2)
            }
          })
          //总金额填写才可以合票
          if (aggregateAmountShow === true){
            this.$api.supplier.procurement.finance.invoicing.combined(this.form.model.splitData).then(res => {
              if (res.code === 200){
                if (res.data === null){
                  this.$parent.tableUtil.initTable()
                  this.combinedTicket.combinedShow = false
                  this.$message.success('开票成功')
                } else {
                  this.$message.error('订单号为：' + res.data[0].purchaseOrder + '，物料号为：' + res.data[0].material + '，行项目为：' + res.data[0].hongProject + '的不含税总金额错误')
                }
              } else {
                this.$message.error(res.code + ":" + res.msg)
              }
            })
          }
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
    }
  }
}
</script>

<style scoped>

</style>
