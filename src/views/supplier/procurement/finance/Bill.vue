<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
<!--        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.status" placeholder="发票状态"/>-->
        <el-select size="mini" clearable v-model="tableUtil.filter.invoiceStatus" placeholder="请选择发票状态">
          <el-option label="已暂存" value="0"></el-option>
          <el-option label="已提交" value="1"></el-option>
          <el-option label="已挂账" value="2"></el-option>
        </el-select>
<!--        <el-select size="mini" clearable v-model="tableUtil.filter.invoiceType" placeholder="请选择发票类型">-->
<!--          <el-option label="标准物资发票" value="0"></el-option>-->
<!--          <el-option label="返利红字发票" value="1"></el-option>-->
<!--        </el-select>-->
<!--        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.interimInvoiceNumber"-->
<!--                  placeholder="临时发票号"/>-->
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.invoiceNumber" placeholder="发票号"/>
        <el-date-picker
          size="mini"
          value-format="yyyy-MM-dd"
          v-model="tableUtil.filter.invoiceDate"
          type="date"
          placeholder="发票日期">
        </el-date-picker>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%"
                @row-dblclick="detail">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
<!--        <el-table-column prop="interimInvoiceNumber" label="临时发票号"/>-->
        <el-table-column prop="supplierCode" label="供应商编码"/>
        <el-table-column prop="supplierName" label="供应商名称"/>
        <el-table-column prop="invoiceCode" label="发票代码"/>
        <el-table-column prop="invoiceNumber" label="发票号码"/>
        <el-table-column prop="invoiceDate" label="发票日期"/>
        <el-table-column prop="withoutTaxAmount" label="不含税金额"/>
        <el-table-column prop="taxAmount" label="税额"/>
        <el-table-column prop="taxRate" label="税率"/>
        <el-table-column prop="totalAmount" label="税价合计"/>
        <el-table-column prop="invoiceStatus" label="状态">
          <template slot-scope="scope">
            {{scope.row.invoiceStatus === 0 ? "已暂存" : (scope.row.invoiceStatus === 1 ? "已提交" : (scope.row.invoiceStatus === 2 ? "已挂账" : ""))}}
          </template>
        </el-table-column>
        <el-table-column prop="onAccountDate" label="挂账日期"/>
<!--        <el-table-column prop="auditStatus" label="审核状态" v-if="type === 1" width="170">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.auditStatus === 0 ? "未审核" : (scope.row.auditStatus === 1 ? "审核不通过，请废弃此发票" : (scope.row.auditStatus === 2 ? "审核通过" : ""))}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="invoiceStatus" label="发票类型">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.invoiceType === 0 ? "标准物资发票" : (scope.row.invoiceType === 1 ? "返利红字发票" : "")}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" width="180" v-if="type===1">
          <template slot-scope="scope">
<!--            <el-button size="mini" type="primary" title="审核通过" icon="el-icon-check" :disabled="scope.row.auditStatus !== 0" circle @click="audit(scope.row)" v-if="type !== 1"></el-button>-->
<!--            <el-button size="mini" type="primary" title="审核不通过" icon="el-icon-close" :disabled="scope.row.auditStatus !== 0" circle @click="auditError(scope.row)" v-if="type !== 1"></el-button>-->
            <el-button size="mini" type="primary" title="查看发票" icon="el-icon-view" circle @click="detail(scope.row)" ></el-button>
            <el-button size="mini" type="primary" title="维护发票" icon="el-icon-edit" circle @click="update(scope.row)" v-if="scope.row.invoiceType !== 1"></el-button>
            <el-button size="mini" type="danger" title="废弃" icon="el-icon-delete" circle @click="remove(scope.row)" v-if="type === 1"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination">
      <el-pagination @size-change="pageSizeChange"
                     @current-change="pageCurrentChange"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="tableUtil.table.total">
      </el-pagination>
    </div>
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="form.title" :close-on-click-modal="false" :visible.sync="form.visible" width="1200px" destroy-on-close>
        <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="110px">
          <el-form-item class="jz-from-flex" label-width="0">
            <el-form-item label="临时发票号" prop="interimInvoiceNumber" style="width: 50%">
              <el-input class="jz-input" v-model="form.model.interimInvoiceNumber" disabled/>
            </el-form-item>



            <el-form-item label="发票号" prop="invoiceNumber" style="width: 50%">
              <el-input class="jz-input" v-model="form.model.invoiceNumber"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-from-flex" label-width="0">
            <el-form-item label="发票代码" prop="invoiceCode" style="width: 50%">
              <el-input class="jz-input" v-model="form.model.invoiceCode" />
            </el-form-item>
            <el-form-item label="开票日期" prop="invoiceDate" style="width: 50%">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="form.model.invoiceDate"
                type="date"
                placeholder="发票日期">
              </el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-from-flex" label-width="0">
            <el-form-item label="不含税总金额" prop="withoutTaxAmount" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.withoutTaxAmount" @change="calculate0"/>
            </el-form-item>
            <el-form-item label="税率" prop="taxRate" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.taxRate" @change="calculate1" >
                <template slot="append" >%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="税额" prop="taxAmount" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.taxAmount" @change="calculate2"/>
            </el-form-item>
            <el-form-item label="税价合计" prop="totalAmount" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.totalAmount" @change="calculate3"/>
            </el-form-item>
          </el-form-item>
<!--          <el-form-item label="折扣原因" prop="discountCause" style="width: 50%">-->
<!--            <el-input class="jz-input" v-model="form.model.discountCause"/>-->
<!--          </el-form-item>-->
        </el-form>
        <div class="jz-form-btn" v-if="!form.check">
          <el-button type="primary" plain @click="save('form')">提 交</el-button>
        </div>
        <!--  Table  -->
        <div class="jz-module-table">
          <el-table highlight-current-row
                    border
                    size="mini"
                    :header-cell-style="{background:'#f9f9f9'}"
                    :data="InvoicingData"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column prop="interimInvoiceNumber" label="临时发票号"/>
            <el-table-column prop="purchaseOrder" label="采购订单"/>
            <el-table-column prop="materialVoucher" label="物料凭证"/>
            <el-table-column prop="voucherProject" label="凭证项目"/>
            <el-table-column prop="material" label="物料"/>
            <el-table-column prop="materialDescribe" label="物料描述"/>
            <el-table-column prop="hongProject" label="行项目"/>
<!--            <el-table-column prop="notOutInvoiceNumber" label="未开票数量"/>-->
          </el-table>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
export default {
  name: "Bill",
  data() {
    return {
      type:this.$store.state.user.type,
      form:{
        title: '发票信息维护',
        check:false,
        visible: false,
        model: {},
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
          withoutTaxAmount: [
            {required: true, message: '不含税金额不能为空', trigger: 'blur'}
          ],
          taxRate: [
            {required: true, message: '税率不能为空', trigger: 'blur'}
          ],
          taxAmount: [
            {required: true, message: '税额不能为空', trigger: 'blur'}
          ],
          totalAmount: [
            {required: true, message: '税价合计不能为空', trigger: 'blur'}
          ]
        }
      },
      tableUtil: {},
      InvoicingData:[]
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.finance.bill, {}, '标准物资发票查询');
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    doSearch() {
      this.tableUtil.initTable()
    },
    update(data){
      //状态为‘暂存’和‘已提交’才可以修改
      this.form.title="发票信息维护"
      this.form.check=false
      if (data.invoiceStatus == 0 || data.invoiceStatus == 1){
        this.form.model = Object.assign({}, data)
        this.$api.supplier.procurement.finance.bill.getInvoicing({interimInvoiceNumber:data.interimInvoiceNumber}).then(res => {
          if (res.code === 200){
            this.InvoicingData = res.data.records
            this.form.visible = true
          } else {
            this.$message.error(res.code + ':' + res.msg)
          }
        })
      } else {
        this.$message.warning("已挂账的信息不能维护")
      }
    },
    detail(data){
      //查看数据明细
      this.form.title="发票信息查看"
      this.form.check=true
      this.form.formRules=null
      this.form.model = Object.assign({}, data)
      this.$api.supplier.procurement.finance.bill.getInvoicing({interimInvoiceNumber:data.interimInvoiceNumber}).then(res => {
        if (res.code === 200){
          this.InvoicingData = res.data.records
          this.form.visible = true
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },

    remove(data){
      //状态为‘暂存’和‘已提交’才可以废弃
      if (data.invoiceStatus === 0 || data.invoiceStatus===1){
        this.$confirm('确认操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.supplier.procurement.finance.bill.remove(data.id).then(res => {
            if (res.code === 200){
              if (this.tableUtil.table.total % 10 === 1) {
                this.tableUtil.filter.page = this.tableUtil.filter.page > 1 ? this.tableUtil.filter.page - 1 : 1;
              }
              this.tableUtil.initTable();
              this.$message.success("废弃成功")
            } else {
              this.$message.error(res.code + ':' + res.msg)
            }
          })
        }).catch(() => {});
      } else {
        this.$message.warning("已挂帐的发票不可以废弃!")
      }
    },
    audit(data){
      //状态为‘暂存’才可以审核通过
      if (data.invoiceStatus === 0){
        let params = {
          id:data.id,
          auditStatus:2,
          invoiceStatus:1
        }
        this.submitStatus(params)
      } else {
        this.$message.warning("只有暂存的发票才可以审核通过!")
      }
    },
    auditError(data){
      //状态为‘暂存’的发票才可以审核不通过
      if (data.invoiceStatus === 0){
        let params = {
          id:data.id,
          auditStatus:1,
          invoiceStatus:0
        }
        this.submitStatus(params)
      } else {
        this.$message.warning("只有暂存的发票才可以审核不通过!")
      }
    },
    updateStatus(data){
      //状态为‘已维护’的发票才可以修改为已挂账
      if (data.invoiceStatus === 1 || data.invoiceStatus === 2){
        let params = {
          id:data.id,
          invoiceStatus:3
        }
        this.account(params)
      } else {
        this.$message.warning("只有已提交和已维护的发票才可以挂账!")
      }
    },
    account(params){
      this.$api.supplier.procurement.finance.bill.update(params).then(res => {
        if (res.code === 200){
          this.$message.success("已挂账成功")
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ":" + res.msg)
        }
      })
    },
    submitStatus(params){
      this.$api.supplier.procurement.finance.bill.audit(params).then(res => {
        if (res.code === 200){
          if (params.auditStatus === 2){
            this.$message.success("审核通过")
          } else {
            this.$message.success("审核不通过")
          }
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ":" + res.msg)
        }
      })
    },
    // save(formName) {
    //   if (this.type === 1){
    //     console.log(this.form.model.invoiceStatus)
    //     if (this.form.model.invoiceStatus === 1 || this.form.model.invoiceStatus === 2){
    //       this.$refs[formName].validate((valid) => {
    //         if (valid) {
    //           //修改数据格式
    //           this.form.model.withoutTaxAmount = parseFloat(this.form.model.withoutTaxAmount).toFixed(2)
    //           this.form.model.taxRate = parseFloat(this.form.model.taxRate) / 100
    //           this.form.model.taxAmount = parseFloat(this.form.model.taxAmount).toFixed(2)
    //           this.form.model.totalAmount = parseFloat(this.form.model.totalAmount).toFixed(2)
    //           this.$api.supplier.procurement.finance.bill.update(this.form.model).then(res => {
    //             if (res.code === 200){
    //               this.tableUtil.initTable()
    //               this.form.visible = false
    //             } else {
    //               this.$message.error(res.code + ":" + res.msg)
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       this.$message.warning("暂存的发票不能维护，请等待管理员审核为‘已提交’状态")
    //     }
    //   } else {
    //     this.$message.warning("只有供应商才可以维护发票，企业人员只能查看")
    //   }
    // },
    save(formName) {
      if (this.type === 1){
        if (this.form.model.invoiceStatus === 0 || this.form.model.invoiceStatus === 1){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //修改数据格式
              this.form.model.withoutTaxAmount = parseFloat(this.form.model.withoutTaxAmount).toFixed(2)

              this.form.model.taxAmount = parseFloat(this.form.model.taxAmount).toFixed(2)
              this.form.model.totalAmount = parseFloat(this.form.model.totalAmount).toFixed(2)
              this.$api.supplier.procurement.finance.bill.update(this.form.model).then(res => {
                if (res.code === 200){
                  this.tableUtil.initTable()
                  this.form.visible = false
                } else {
                  this.$message.error(res.code + ":" + res.msg)
                }
              })
            }
          })
        } else {
          this.$message.warning("当前发票状态不可修改")
        }
      } else {
        this.$message.warning("只有供应商才可以维护发票，企业人员只能查看")
      }
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
    calculate0(){
      if (this.form.model.taxRate!==''){
        this.form.model.taxAmount=parseFloat(this.form.model.withoutTaxAmount) * parseFloat(this.form.model.taxRate) /100
        this.form.model.totalAmount=parseFloat(this.form.model.withoutTaxAmount) + parseFloat(this.form.model.taxAmount)
      }
    },
    calculate1(){
      this.form.model.taxAmount=parseFloat(this.form.model.withoutTaxAmount) * parseFloat(this.form.model.taxRate) /100
      this.form.model.totalAmount=parseFloat(this.form.model.withoutTaxAmount) + parseFloat(this.form.model.taxAmount)
    },
    calculate2(){
      this.form.model.taxRate=parseFloat(this.form.model.taxAmount) / parseFloat(this.form.model.withoutTaxAmount) *100
      this.form.model.totalAmount=parseFloat(this.form.model.withoutTaxAmount) + parseFloat(this.form.model.taxAmount)
    },
    calculate3(event,param){
      this.form.model.taxAmount=parseFloat(this.form.model.totalAmount) - parseFloat(this.form.model.withoutTaxAmount)
      this.form.model.taxRate=parseFloat(this.form.model.taxAmount) / parseFloat(this.form.model.withoutTaxAmount) *100
    }

}
}
</script>




<style scoped>
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
    margin-right: 10px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
  /deep/ .el-button--mini.is-circle {
    padding: 0 7px;
  }
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
  .jz-form-btn{
    margin-bottom: 20px;
  }
</style>
