<!--寄售物资开票管理-->

<template>
  <div class="jz-form">
    <el-dialog title="寄售物资开票" :close-on-click-modal="false" :visible.sync="combinedTicket.isCombined" width="1250px" destroy-on-close>

        <div v-for="(item,index) in this.form.model.resultList" :key="index" style="margin-top: 10px;margin-bottom: 10px">

          <el-form :model="form.model" ref="form"  label-width="100px"  style="border:1px solid #CBD0CC;border-radius:2px;margin-top:20px;padding-top: 10px;padding-right: 10px">

            <el-form-item class="jz-from-flex" label-width="0">

              <el-form-item label="开票区间" style="width: 25%">
                <el-input class="jz-input" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="item.outInvoicePeriod" :disabled="true"/>
              </el-form-item>

              <el-form-item label="发票代码" prop="invoiceCode" style="width: 25%">
                <el-input class="jz-input" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="item.invoiceCode"/>
              </el-form-item>

              <el-form-item label="发票号" prop="invoiceNumber" style="width: 25%">
                <el-input class="jz-input" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="item.invoiceNumber"/>
              </el-form-item>

              <el-form-item label="发票日期" prop="invoiceDate" style="width: 25%">
                <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="item.invoiceDate"
                    type="date"
                    placeholder="发票日期">
                </el-date-picker>
              </el-form-item>
            </el-form-item>

            <el-form-item class="jz-from-flex" label-width="0">
              <el-form-item label="不含税金额" prop="amount" style="width: 25%">
                <el-input class="jz-input" v-model="item.inputAmount"/>
              </el-form-item>

              <el-form-item label="税率(%)" prop="taxRate" style="width: 25%">
                <el-input class="jz-input"   v-model="item.inputTaxRate"/>
              </el-form-item>
              <el-form-item label="税额" prop="taxAmount" style="width: 25%">
                <el-input class="jz-input"   v-model="item.inputTaxAmount"/>
              </el-form-item>
              <el-form-item label="税价合计" prop="taxPriceTotal" style="width: 25%">
                <el-input class="jz-input"  v-model="item.inputTaxPriceTotal"/>
              </el-form-item>
            </el-form-item>
          </el-form>

        </div>


      <div class="jz-form-btn">
        <el-button type="primary" plain @click="save('form')">确 定</el-button>
      </div>

<!--      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="100px" style="margin-top: 20px">-->
<!--        <el-form-item>-->
<!--          <el-table size="small" border-->
<!--                    row-class-name="jz-table-row"-->
<!--                    cell-class-name="jz-table-cell"-->
<!--                    :data="form.model.combinedData"-->
<!--                    :header-cell-style="{background:'#f6f6f6'}"-->
<!--                    style="width:100%">-->
<!--            <el-table-column type="index" width="50"/>-->
<!--            <el-table-column prop="purchaseOrder" label="订单号">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.purchaseOrder}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="materialNumber" label="物料">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.materialNumber}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="materialDescribe" label="物料描述">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.materialDescribe}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column prop="quantity" label="数量">-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.quantity}}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </el-form-item>-->
<!--      </el-form>-->


    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ConsignmentCombined",
  props:{
    combinedTicket:Object
  },
  data(){
    return{
      visible: true,
      isAdd: false,
      form: {
        model: {
          resultList:[],
          invoiceOuts: [],
        },
      },
      idList:[]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    //获取选中数据
    getData(){
      // 得到有几张发票，每张发票对应的钱
      this.combinedTicket.combinedList.forEach(item => {
        this.idList.push(item.id)
        this.form.model.invoiceOuts.push(item)
        console.log(item)
      })

      //计算选中数据的总额
      this.$api.supplier.procurement.finance.consignmentInvoicing.getTotal({ids: this.idList}).then(res => {
        if (res.code === 200){
          // this.form.model.resultList.truthAmount = res.data[0]
          // this.form.model.resultList.truthTaxAmount = res.data[1]
          // this.form.model.resultList.truthTaxPriceTotal = res.data[2]
          // this.form.model.resultList.truthTaxRate=res.data[3]
          this.form.model.resultList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    save(formName){
      this.form.model.resultList.forEach(item=>{
        console.log(formName)
        if (item.invoiceCode==null || item.invoiceCode===''){
          this.$message.error('发票代码不能为空')
        } else if (item.invoiceNumber==null || item.invoiceNumber===''){
          this.$message.error('发票号码不能为空')
        } else if (item.invoiceDate==null || item.invoiceDate===''){
          this.$message.error('发票日期不能为空')
        } else if (item.inputAmount==null || item.inputAmount===''){
          this.$message.error('不含税金额不能为空')
        } else if (item.inputTaxRate==null || item.inputTaxRate===''){
          this.$message.error('税率不能为空')
        } else if (item.inputTaxAmount==null || item.inputTaxAmount===''){
          this.$message.error('税额不能为空')
        } else if (item.inputTaxPriceTotal==null || item.inputTaxPriceTotal===''){
          this.$message.error('税价合计不能为空')
        } else if (Math.abs(item.amount-item.inputAmount).toFixed(2)>=0.01){
          this.$message.error('不含税金额与实际不符')
        } else if (Math.abs(item.taxAmount-item.inputTaxAmount).toFixed(2)>=0.01){
          this.$message.error('税额与实际不符')
        } else if (Math.abs(item.taxPriceTotal-item.inputTaxPriceTotal).toFixed(2)>=0.01){
          this.$message.error('总额与实际不符')
        }
        else {
          var combinedData = this.form.model.invoiceOuts.filter(function (invoice){
            return invoice.outInvoicePeriod===item.outInvoicePeriod
          })
          var resultList = {
            "amount":item.amount,
            "taxRate":item.inputTaxRate,
            "taxAmount":item.taxAmount,
            "taxPriceTotal":item.taxPriceTotal
          }
          item.resultList = resultList
          item.combinedData  = combinedData
          this.$api.supplier.procurement.finance.consignmentInvoicing.consignmentCombined(item).then(res => {
            if (res.code === 200){
              this.$parent.doSearch()
              this.combinedTicket.isCombined = false
            } else {
              this.$message.error(res.code + ':' + res.msg)
            }
          })
        }
      })


    },
    beforeClose() {
      this.combinedTicket.isCombined = false
      this.$emit('getIsCombined', false)
    }
  }
}
</script>

<style scoped>
  .jz-from-flex /deep/ .el-form-item__content{
    display: flex;
  }
  .jz-from-flex /deep/ .el-form-item__content .jz-input{
    margin-right: 0;
  }
  .jz-from-flex .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
    margin-right: 0 !important;
  }
</style>
