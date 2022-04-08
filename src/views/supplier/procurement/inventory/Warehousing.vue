<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
<!--        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type === 3"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>-->
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.nonstopNumber" placeholder="直达编号"/>
        <el-date-picker
          v-model="tableUtil.filter.startTime"
          value-format="timestamp"
          type="date"
          size="mini"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="tableUtil.filter.entTime"
          value-format="timestamp"
          type="date"
          size="mini"
          placeholder="结束日期">
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
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="nonstopNumber" label="直达编号"/>
        <el-table-column prop="materialNumber" label="物料号"/>
        <el-table-column prop="materialDescribe" label="物料描述"/>
        <el-table-column prop="purchaseOrder" label="采购订单"/>
        <el-table-column prop="hongProject" label="行项目"/>
        <el-table-column prop="productionOrder" label="生产订单"/>
        <el-table-column prop="loadingListNumber" label="装车单号"/>
        <el-table-column prop="directSendingType" label="直送类型"/>
        <el-table-column prop="qty" label="入库数量"/>
        <el-table-column prop="date" label="日期"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type === 3" label="供应商编码"/>
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
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "Warehousing",
  data() {
    return {
      value1: [],
      tableUtil: {}
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.inventory.warehousing, {}, '直送入库信息查询');
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    doSearch() {
      if (this.tableUtil.filter.startTime != undefined && this.tableUtil.filter.entTime == undefined) {
        this.$message.error('请输入结束时间')
      } else if (this.tableUtil.filter.startTime == undefined && this.tableUtil.filter.entTime != undefined) {
        this.$message.error('请输入开始时间')
      } else if (this.tableUtil.filter.startTime != undefined && this.tableUtil.filter.entTime != undefined) {
        if (this.tableUtil.filter.entTime < this.tableUtil.filter.startTime){
          this.$message.error('结束时间不能小于开始时间')
        } else {
          this.tableUtil.filter.startTime = formatDateTime(this.tableUtil.filter.startTime)
          this.tableUtil.filter.entTime = formatDateTime(this.tableUtil.filter.entTime)
          this.tableUtil.initTable()
          this.tableUtil.filter.startTime = new Date(this.tableUtil.filter.startTime)
          this.tableUtil.filter.entTime = new Date(this.tableUtil.filter.entTime)
        }
      } else {
        this.tableUtil.initTable()
      }
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    }
  }
}
</script>

<style scoped>
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-right: 10px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
</style>
