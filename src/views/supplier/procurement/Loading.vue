<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
<!--        <el-input class="jz-input" size="mini" v-if="this.$store.state.user.type === 3" clearable
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>-->
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.loadingNumber" placeholder="装车单号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.plant" placeholder="工厂"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.status" placeholder="确认状态"/>
        <el-date-picker
          v-model="tableUtil.filter.startTime"
          value-format="timestamp"
          type="datetime"
          size="mini"
          placeholder="生成日期开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="tableUtil.filter.endTime"
          value-format="timestamp"
          type="datetime"
          size="mini"
          placeholder="生成日期结束日期">
        </el-date-picker>
      </div>
      <div class="jz-toolbar-margin1">
        <button class="jz-btn" @click="doSearch()" style="margin-right: 10px">查询</button>
        <el-button type="primary" plain @click="update()">修改</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                @row-click="selectedRow"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="status" label="状态" width="80"/>
        <el-table-column prop="loadingNumber" label="装车单号"/>
        <el-table-column prop="plant" label="工厂"/>
        <el-table-column prop="licensePlateNumber" label="车牌号" width="130"/>
        <el-table-column prop="phone" label="联系电话" width="120"/>
        <el-table-column prop="createDate" label="生成日期" width="150"/>
        <el-table-column prop="arrivalDate" label="到货日期" width="100"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type === 3" label="供应商编码"/>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="print(scope.row.id)">打印</el-button>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close width="800px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="100px" label-position="left">
          <el-form-item label="车牌号" prop="licensePlateNumber">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.licensePlateNumber"/>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.phone"/>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <loading-details v-if="details.isDetails" :details="details" @getIsDetails="getDetails($event)"></loading-details>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import LoadingDetails from '../../../components/supplier/shipping/loadingDetails'
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "Loading",
  components: {LoadingDetails},
  data() {
    return {
      value1:[],
      details: {
        isDetails: false,
        id: ''
      },
      tableUtil: {},
      form:{
        formRules:{
          licensePlateNumber: [
            { required: true, message: '车牌号不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' }
          ],
        },
      },
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.loading, {}, '直送装车单查询与打印');
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    selectedRow (row) {
      this.tableUtil.selectedRow(row)
    },
    doSearch() {
      if (this.tableUtil.filter.startTime !== undefined && this.tableUtil.filter.endTime === undefined) {
        this.$message.error('请输入结束时间')
      } else if (this.tableUtil.filter.startTime === undefined && this.tableUtil.filter.endTime !== undefined) {
        this.$message.error('请输入开始时间')
      } else if (this.tableUtil.filter.startTime !== undefined && this.tableUtil.filter.endTime !== undefined) {
        if (this.tableUtil.filter.endTime < this.tableUtil.filter.startTime){
          this.$message.error('结束时间不能小于开始时间')
        } else {
          this.tableUtil.filter.startTime = formatDateTime(this.tableUtil.filter.startTime)
          this.tableUtil.filter.endTime = formatDateTime(this.tableUtil.filter.endTime)
          this.tableUtil.initTable()
          this.tableUtil.filter.startTime = new Date(this.tableUtil.filter.startTime)
          this.tableUtil.filter.endTime = new Date(this.tableUtil.filter.endTime)
        }
      } else {
        this.tableUtil.initTable()
      }
    },
    update () {
      this.tableUtil.update()
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save()
        }
      })
    },
    //接收子组件修改的值
    getDetails(data) {
      this.details.isDetails = data
    },
    //查看详情
    print(number) {
      this.details.id = number
      this.details.isDetails = true
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
  .jz-module-toolbar{
    align-items: flex-start;
  }
  .jz-module-toolbar>div:first-child{
    width: 80%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-right: 10px;
    width: 200px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
</style>
