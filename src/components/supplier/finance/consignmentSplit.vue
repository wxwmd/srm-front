<template>
  <div class="jz-form">
    <el-dialog title="拆票" :close-on-click-modal="false" :visible.sync="splitTicket.isSplit" width="1500px" destroy-on-close>
      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="110px">
        <el-form-item label-width="0px">
          <el-table size="small" border
                    row-class-name="jz-table-row"
                    cell-class-name="jz-table-cell"
                    :data="form.model.splitData"
                    :header-cell-style="{background:'#f6f6f6'}"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column prop="invoiceNumber" label="发票号">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.invoiceNumber"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.invoiceNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceCode" label="发票代码">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.invoiceCode"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.invoiceCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="invoiceDate" label="发票日期" width="150px">
              <template slot-scope="scope">
                <el-date-picker
                  size="small"
                  value-format="yyyy-MM-dd"
                  v-model="scope.row.invoiceDate"
                  type="date"
                  v-if="form.model.splitData.length === scope.$index + 1"
                  placeholder="发票日期">
                </el-date-picker>
                <span v-else>{{scope.row.invoiceDate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="不含税金额" width="120px">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.amount"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taxRate" label="税率(%)" width="100px">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxRate"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.taxRate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taxPrice" label="税额" width="100px">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxPrice"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.taxPrice}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taxPriceTotal" label="税价合计" width="120px">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.taxPriceTotal"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.taxPriceTotal}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80px">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.quantity"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.quantity}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="mini" class="jz-table-button" type="primary" icon="el-icon-plus" circle
                           @click="incrementSplit(scope.row.id, scope.$index)"
                           :disabled="form.model.splitData.length !== scope.$index + 1">
                </el-button>
                <el-button size="mini" class="jz-table-button" type="danger" icon="el-icon-delete" circle
                           @click="decrementSplit(scope.row.id)"
                           :disabled="form.model.splitData.length === 1">
                </el-button>
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
  name: "ConsignmentSplit",
  props: {
    splitTicket: Object
  },
  data() {
    return {
      visible: true,
      isAdd: false,
      form: {
        model: {
          // aggregateAmount:'',
          // taxRate:'',
          splitData: [
            {id: 0, invoiceNumber: '', invoiceCode: '', invoiceDate:'', amount: 0.00,taxRate: 0.00, taxPrice: 0.00, taxPriceTotal: 0.00, quantity: 0}
          ],
        },
        formRules: {},
      }
    }
  },
  methods: {
    //添加行
    incrementSplit(id, index) {
      let split = this.form.model.splitData[index]
      if (split.invoiceNumber === '') {
        this.$message.warning('发票号不能为空！');
        return null
      }
      if (split.invoiceCode === '') {
        this.$message.warning('发票代码不能为空！');
        return null
      }
      if (split.invoiceDate === '') {
        this.$message.warning('开票日期不能为空！');
        return null
      }
      if (split.amount <= 0) {
        this.$message.warning('不含税金额要大于0！');
        return null
      }
      if (split.taxRate < 0) {
        this.$message.warning('税率不能小于0！');
        return null
      }
      if (split.taxPrice < 0) {
        this.$message.warning('税额不能小于0！');
        return null
      }
      if (split.taxPriceTotal <= 0) {
        this.$message.warning('税价合计要大于0！');
        return null
      }
      if (split.quantity <= 0) {
        this.$message.warning('数量要大于0！');
        return null
      }
      let nullSplit = {id: id + 1, invoiceNumber: '', invoiceCode: '', invoiceDate:'', amount: 0.00,taxRate: 0.00, taxPrice: 0.00, taxPriceTotal: 0.00, quantity: 0};
      this.form.model.splitData.push(nullSplit)
    },
    //删除行
    decrementSplit(id) {
      for (let index = 0; index < this.form.model.splitData.length; index++) {
        if (this.form.model.splitData[index].id === id) {
          this.form.model.splitData.splice(index, 1);
        }
      }
    },
    save(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let number = 0
          //修改数据格式
          this.form.model.splitData.forEach(ticket => {
            ticket.purchaseOrder = this.splitTicket.splitList[0].purchaseOrder
            ticket.materialNumber = this.splitTicket.splitList[0].materialNumber
            ticket.materialDescription = this.splitTicket.splitList[0].materialDescription
            ticket.outInvoicePeriod = this.splitTicket.splitList[0].outInvoicePeriod
            ticket.amount = parseFloat(ticket.amount).toFixed(2)
            // ticket.taxRate = parseFloat(ticket.taxRate) / 100
            ticket.taxPrice = parseFloat(ticket.taxPrice).toFixed(2)
            ticket.taxPriceTotal = parseFloat(ticket.taxPriceTotal).toFixed(2)
            number = number + parseFloat(ticket.quantity)
          })
          //如果拆票数量相加等于未开票数量，才可以拆票
          if (number == this.splitTicket.splitList[0].quantity){
            this.$api.supplier.procurement.finance.consignmentInvoicing.consignmentSplit(this.form.model.splitData).then(res => {
              if (res.code === 200){
                if (res.data !== undefined && res.data !== null){
                  this.$alert('发票号为：' + res.data[0].invoiceNumber + '的发票金额超出限额，请重新填写！', '', {
                    confirmButtonText: '确定',
                  });
                } else {
                  this.$parent.doSearch()
                  this.splitTicket.isSplit = false
                }
              } else {
                this.$message.error(res.code + ":" + res.msg)
              }
            })
          } else {
            this.$message.error('数量错误，请核对数量，重新填写')
          }
        }
      })
    },
    beforeClose() {
      this.splitTicket.isSplit = false
      this.$emit('getIsSplit', {isSplit:false,outInvoicePeriod:this.splitTicket.splitList[0].outInvoicePeriod,status:-1})
    }
  }
}
</script>

<style scoped>
  /deep/ .el-button--mini.is-circle {
    padding: 0 7px;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
</style>
