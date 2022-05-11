<!--寄售物资开票管理界面-->

<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
<!--        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.invoiceStatus" placeholder="发票状态"/>-->
        <el-select size="mini" clearable v-model="tableUtil.filter.invoiceStatus" placeholder="请选择发票状态">
          <el-option label="已提交" value="0"></el-option>
          <el-option label="已挂账" value="1"></el-option>
        </el-select>
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
                @row-dblclick="detail"
                style="width:100%">
        <el-table-column type="index" width="50"/>
<!--        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>-->
<!--        <el-table-column prop="invoiceCode" label="发票代码"/>-->
<!--        <el-table-column prop="invoiceNumber" label="发票号"/>-->
<!--        <el-table-column prop="invoiceDate" label="发票日期"/>-->
<!--        <el-table-column prop="amount" label="不含税金额"/>-->
<!--        <el-table-column prop="taxAmount" label="税额"/>-->
<!--        <el-table-column prop="taxRate" label="税率（%）"/>-->
<!--        <el-table-column prop="taxPriceTotal" label="税价合计"/>-->
<!--        <el-table-column prop="outInvoicePeriod" label="开票区间"/>-->
        <el-table-column prop="supplierCode" label="供应商编码" width="150"/>
        <el-table-column prop="supplierName" label="供应商名称" width="150"/>
        <el-table-column prop="invoiceCode" label="发票代码"/>
        <el-table-column prop="invoiceNumber" label="发票号码"/>
        <el-table-column prop="invoiceDate" label="发票日期"/>
        <el-table-column prop="amount" label="不含税金额"/>
        <el-table-column prop="taxAmount" label="税额"/>
        <el-table-column prop="taxRate" label="税率（%）"/>
        <el-table-column prop="taxPriceTotal" label="税价合计"/>
        <el-table-column prop="outInvoicePeriod" label="发票期间"/>

        <el-table-column prop="invoiceStatus" label="状态">
          <template slot-scope="scope">
            {{scope.row.invoiceStatus === 0 ? "已提交" : (scope.row.invoiceStatus === 1 ? "已挂账" : "")}}
          </template>
        </el-table-column>
<!--        <el-table-column label="操作" width="90" v-if="type !== 1">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button size="mini" type="primary" @click="updateStatus(scope.row)" :disabled="scope.row.invoiceStatus === 1">挂账</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" width="150" v-if="type === 1">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" title="查看发票" icon="el-icon-view" circle @click="detail(scope.row)" ></el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="update(scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="remove(scope.row)"></el-button>
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
            <el-form-item label="发票代码" prop="invoiceCode" style="width: 50%">
              <el-input class="jz-input" v-model="form.model.invoiceCode"/>
            </el-form-item>
            <el-form-item label="发票号" prop="invoiceNumber" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.invoiceNumber"/>
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
            <el-form-item label="不含税总金额" prop="aggregateAmount" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.amount"/>
            </el-form-item>
            <el-form-item label="税率（%）" prop="taxRate" style="width: 25%">
              <el-input class="jz-input" @change="calculate()" v-model="form.model.taxRate"/>
            </el-form-item>
            <el-form-item label="税额" prop="taxAmount" style="width: 25%">
              <el-input class="jz-input" @change="calculate()" v-model="form.model.taxAmount"/>
            </el-form-item>
            <el-form-item label="税价合计" prop="taxPriceTotal" style="width: 25%">
              <el-input class="jz-input" v-model="form.model.taxPriceTotal"/>
            </el-form-item>
          </el-form-item>
          <el-form-item label="折扣原因" prop="discountCause" style="width: 50%">
            <el-input class="jz-input" v-model="form.model.discountCause"/>
          </el-form-item>
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
            <el-table-column prop="purchaseOrder" label="采购订单"/>
            <el-table-column prop="materialNumber" label="物料"/>
            <el-table-column prop="materialDescribe" label="物料描述"/>
            <el-table-column prop="quantity" label="数量"/>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'

export default {
  name: "ConsignmentInvoicing",
  data() {
    return {
      type:this.$store.state.user.type,
      form:{
        title: '发票信息维护',
        visible: false,
        check:false,
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
          // aggregateAmount: [
          //   {required: true, message: '不含税金额不能为空', trigger: 'blur'}
          // ],
          // taxRate: [
          //   {required: true, message: '税率不能为空', trigger: 'blur'}
          // ],
          // taxPrice: [
          //   {required: true, message: '税额不能为空', trigger: 'blur'}
          // ],
          // taxPriceTotal: [
          //   {required: true, message: '税价合计不能为空', trigger: 'blur'}
          // ]
        }
      },
      tableUtil: {},
      InvoicingData:[]
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.finance.consignmentBill, {}, '寄售物资发票查询');
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
    calculate(){
      this.form.model.taxAmount = parseFloat(this.form.model.amount) * parseFloat(this.form.model.taxRate) / 100
      this.form.model.taxPriceTotal = parseFloat(this.form.model.amount) + parseFloat(this.form.model.taxAmount)
    },
    update(data){
      this.form.check=false
      this.form.title="发票信息维护"
      //状态为‘已提交’才可以修改
      if (data.invoiceStatus == 0){
        this.form.model = Object.assign({}, data)
        this.$api.supplier.procurement.finance.consignmentBill.getInvoicing({invoiceNumber:data.invoiceNumber}).then(res => {
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
      this.form.model = Object.assign({}, data)
      this.$api.supplier.procurement.finance.consignmentBill.getInvoicing({invoiceNumber:data.invoiceNumber}).then(res => {
        if (res.code === 200){
          this.InvoicingData = res.data.records
          this.form.visible = true
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    remove(data){
      //状态为‘已提交’才可以废弃
      if (data.invoiceStatus == 0){
        this.$confirm('确认操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.supplier.procurement.finance.consignmentBill.remove(data.id).then(res => {
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
        this.$message.warning("已挂账的信息不能删除")
      }
    },
    updateStatus(data){
      let params = {
        id:data.id,
        invoiceStatus:1
      }
      this.$api.supplier.procurement.finance.consignmentBill.update(params).then(res => {
        if (res.code === 200){
          this.$message.success("已挂账成功")
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ":" + res.msg)
        }
      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //修改数据格式
          this.$api.supplier.procurement.finance.consignmentBill.update(this.form.model).then(res => {
            if (res.code === 200){
              this.tableUtil.initTable()
              this.tableUtil.initTable()
              this.form.visible = false
            } else {
              this.$message.error(res.code + ":" + res.msg)
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
    }
  }
}
</script>

<style scoped>
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
    margin-right: 10px;
  }
  /deep/ .el-input__prefix {
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
  /deep/ .el-input--mini .el-input__icon{
    height: 28px;
  }
</style>
