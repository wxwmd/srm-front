<!--寄售物资开票管理-->

<template>
  <div class="jz-form">
    <el-dialog title="寄售物资开票" :close-on-click-modal="false" :visible.sync="combinedTicket.isCombined" width="1200px" destroy-on-close>
      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="100px">
<!--        <el-form :model="form.model" ref="form" :rules='formRules' label-width="100px">-->
        <el-form-item class="jz-from-flex" label-width="0">
          <el-form-item label="发票代码" prop="invoiceCode" style="width: 50%">
            <el-input class="jz-input" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="form.model.invoiceCode"/>
          </el-form-item>
          <el-form-item label="发票号" prop="invoiceNumber" style="width: 25%">
            <el-input class="jz-input" onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')" v-model="form.model.invoiceNumber"/>
          </el-form-item>
          <el-form-item label="发票日期" prop="invoiceDate" style="width: 25%">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="form.model.invoiceDate"
              type="date"
              placeholder="发票日期">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="jz-from-flex" label-width="0">
          <el-form-item label="不含税金额" prop="amount" style="width: 25%">
            <el-input class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')" @change="calculate0()" v-model="form.model.resultList.amount"/>
          </el-form-item>
          <el-form-item label="税率(%)" prop="taxRate" style="width: 25%">
            <el-input class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')" @change="calculate1()" v-model="form.model.resultList.taxRate"/>
          </el-form-item>
          <el-form-item label="税额" prop="taxAmount" style="width: 25%">
            <el-input class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')" @change="calculate2()" v-model="form.model.resultList.taxAmount"/>
          </el-form-item>
          <el-form-item label="税价合计" prop="taxPriceTotal" style="width: 25%">
            <el-input class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')" v-model="form.model.resultList.taxPriceTotal"/>
          </el-form-item>
        </el-form-item>
<!--        -->
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
      </el-form>
      <div class="jz-form-btn">
        <el-button type="primary" plain @click="save('form')">确 定</el-button>
      </div>

      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="100px" style="margin-top: 20px">
        <el-form-item>
          <el-table size="small" border
                    row-class-name="jz-table-row"
                    cell-class-name="jz-table-cell"
                    :data="form.model.combinedData"
                    :header-cell-style="{background:'#f6f6f6'}"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column prop="purchaseOrder" label="订单号">
              <template slot-scope="scope">
                <span>{{scope.row.purchaseOrder}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="materialNumber" label="物料">
              <template slot-scope="scope">
                <span>{{scope.row.materialNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="materialDescribe" label="物料描述">
              <template slot-scope="scope">
                <span>{{scope.row.materialDescribe}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量">
              <template slot-scope="scope">
                <span>{{scope.row.quantity}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
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
          resultList:{
            amount:0,
            taxRate:0.,
            taxAmount:0,
            taxPriceTotal:0
          },
          combinedData: [],
        },
        formRules: {
          invoiceCode:[
            {required: true, message: '发票代码不能为空', trigger: 'blur'}
          ],
          invoiceNumber:[
            {required: true, message: '发票号不能为空', trigger: 'blur'}
          ],
          invoiceDate:[
            {required: true, message: '发票日期不能为空', trigger: 'blur'}
          ],
          amount:[
            // {required: true, message: '不含税总金额不能为空', trigger: 'blur'}
          ],
          taxRate:[
            // {required: true, message: '税率不能为空', trigger: 'blur'}
          ],
          taxAmount:[
            // {required: true, message: '税额不能为空', trigger: 'blur'}
          ],
          taxPriceTotal:[
            // {required: true, message: '税价合计不能为空', trigger: 'blur'}
          ]
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
      this.combinedTicket.combinedList.forEach(item => {
        this.idList.push(item.id)
        this.form.model.combinedData.push({id:item.id,purchaseOrder:item.purchaseOrder,materialNumber:item.materialNumber,materialDescribe:item.materialDescribe,quantity:item.quantity})
      })

      //计算选中数据的总额
      this.$api.supplier.procurement.finance.consignmentInvoicing.getTotal({ids: this.idList}).then(res => {
        if (res.code === 200){
          this.form.model.resultList.amount = res.data[0]
          this.form.model.resultList.taxAmount = res.data[1]
          this.form.model.resultList.taxPriceTotal = res.data[2]
          this.form.model.resultList.taxRate=res.data[3]
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    //计算
    calculate0(){
      if (this.form.model.resultList.amount!=null && this.form.model.resultList.amount!==''){
        if (this.form.model.resultList.taxRate!=null && this.form.model.resultList.taxRate!==''){
          this.form.model.resultList.taxAmount = parseFloat(this.form.model.resultList.amount) * parseFloat(this.form.model.resultList.taxRate) / 100
          this.form.model.resultList.taxPriceTotal = parseFloat(this.form.model.resultList.amount) + parseFloat(this.form.model.resultList.taxAmount)
        }
      }
    },
    calculate1(){
      if (this.form.model.resultList.amount!=null && this.form.model.resultList.amount!==''){
        if (this.form.model.resultList.taxRate!=null && this.form.model.resultList.taxRate!==''){
          this.form.model.resultList.taxAmount = parseFloat(this.form.model.resultList.amount) * parseFloat(this.form.model.resultList.taxRate) / 100
          this.form.model.resultList.taxPriceTotal = parseFloat(this.form.model.resultList.amount) + parseFloat(this.form.model.resultList.taxAmount)
        }
      }
    },
    calculate2(){
      if (this.form.model.resultList.amount!=null && this.form.model.resultList.amount!==''){
        if (this.form.model.resultList.taxAmount!=null && this.form.model.resultList.taxAmount!==''){
          this.form.model.resultList.taxRate=  parseFloat(this.form.model.resultList.taxAmount) *100 / parseFloat(this.form.model.resultList.amount)
          this.form.model.resultList.taxPriceTotal = parseFloat(this.form.model.resultList.amount) + parseFloat(this.form.model.resultList.taxAmount)
        }
      }
    },
    save(formName){
      if (this.form.model.invoiceCode==null || this.form.model.invoiceCode===''){
        this.$message.error('发票代码不能为空')
      } else if (this.form.model.invoiceNumber==null || this.form.model.invoiceNumber===''){
        this.$message.error('发票号码不能为空')
      } else if (this.form.model.invoiceDate==null || this.form.model.invoiceDate===''){
        this.$message.error('发票日期不能为空')
      } else if (this.form.model.resultList.amount==null || this.form.model.resultList.amount===''){
        this.$message.error('不含税金额不能为空')
      } else if (this.form.model.resultList.taxRate==null || this.form.model.resultList.taxRate===''){
        this.$message.error('税率不能为空')
      } else if (this.form.model.resultList.taxAmount==null || this.form.model.resultList.taxAmount===''){
        this.$message.error('税额不能为空')
      } else if (this.form.model.resultList.taxPriceTotal==null || this.form.model.resultList.taxPriceTotal===''){
        this.$message.error('税价合计不能为空')
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //传开票区间
            this.form.model.outInvoicePeriod = this.combinedTicket.combinedList[0].outInvoicePeriod
            //开票
            this.$api.supplier.procurement.finance.consignmentInvoicing.consignmentCombined(this.form.model).then(res => {
              if (res.code === 200){
                this.$parent.doSearch()
                this.combinedTicket.isCombined = false
              } else {
                this.$message.error(res.code + ':' + res.msg)
              }
            })
          }
        })
      }
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
