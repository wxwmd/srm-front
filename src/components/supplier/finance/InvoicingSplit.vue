<template>
  <div class="jz-form">
    <el-dialog title="拆票" :close-on-click-modal="false" :visible.sync="splitTicket.splitShow" width="600px" destroy-on-close>
      <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="110px">
        <el-form-item label="不含税总金额" prop="aggregateAmount">
          <el-input size="small" class="jz-input" v-model="form.model.aggregateAmount"/>
        </el-form-item>
        <el-form-item label="拆票详情">
          <el-table size="small" border
                    row-class-name="jz-table-row"
                    cell-class-name="jz-table-cell"
                    :data="form.model.splitData"
                    :header-cell-style="{background:'#f6f6f6'}"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column prop="notOutInvoiceNumber" label="数量">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.notOutInvoiceNumber"
                          v-if="form.model.splitData.length === scope.$index + 1"/>
                <span v-else>{{scope.row.notOutInvoiceNumber}}</span>
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
  name: "InvoicingSplit",
  props: {
    splitTicket: Object
  },
  data() {
    return {
      visible: true,
      isAdd: false,
      form: {
        model: {
          aggregateAmount:'',
          taxRate:'',
          splitData: [
            {id: 0, notOutInvoiceNumber: 0}
          ],
        },
        formRules: {
          aggregateAmount:[
            {required: true, message: '不含税总金额不能为空', trigger: 'blur'}
          ]
        },
      }
    }
  },
  methods: {
    //添加表格行
    incrementSplit(id, index) {
      let split = this.form.model.splitData[index]
      if (split.notOutInvoiceNumber <= 0) {
        this.$message.warning('数量要大于0！');
        return null
      }
      let nullSplit = {id: id + 1, notOutInvoiceNumber: 0};
      this.form.model.splitData.push(nullSplit)
    },
    //删除表格行
    decrementSplit(id) {
      for (let index = 0; index < this.form.model.splitData.length; index++) {
        if (this.form.model.splitData[index].id === id) {
          this.form.model.splitData.splice(index, 1);
        }
      }
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let split = {}
          let sum = 0
          split.aggregateAmount = parseFloat(this.form.model.aggregateAmount).toFixed(2)
          this.form.model.splitData.forEach(item => {
            //数据格式处理
            sum = sum + parseFloat(item.notOutInvoiceNumber)
            item.notOutInvoiceNumber = parseFloat(item.notOutInvoiceNumber).toFixed(3)
            item.purchaseOrder = this.splitTicket.splitTicket.purchaseOrder
            item.material = this.splitTicket.splitTicket.material
            item.hongProject = this.splitTicket.splitTicket.hongProject
            item.supplierCode = this.$store.state.user.username
            //删除id字段
            delete item.id
          })
          split.standardInvoices = this.form.model.splitData
          //判断拆票前的数量和拆票后的数量是否相等
          if (sum === this.splitTicket.splitTicket.notOutInvoiceNumber){
            this.$api.supplier.procurement.finance.invoicing.split(split).then(res => {
              if (res.code === 200){
                if (res.data === null){
                  this.$parent.tableUtil.initTable()
                  this.splitTicket.splitShow = false
                  this.$message.success('拆票成功')
                } else {
                  res.data.forEach(item => {
                    alert('订单号为：' + item.purchaseOrder + '，' + '物料为：' + item.material + '，' + '行项目为：' + item.hongProject + '的订单总金额错误，请核对后重新填写')
                  })
                }
              } else {
                this.$message.error(res.code + ":" + res.msg)
              }
            })
          } else {
            this.$message.error('数量不匹配，请重新拆票')
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
        this.url = ''
        this.visiblePersonList = []
      })
    }
  }
}
</script>

<style scoped>
  /deep/ .el-button--mini.is-circle {
    padding: 0 7px;
  }
</style>
