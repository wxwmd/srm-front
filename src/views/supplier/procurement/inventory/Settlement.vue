<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type === 3"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.factory" placeholder="工厂"/>
        <el-date-picker
          size="mini"
          v-model="value1"
          value-format="yyyy-MM-dd"
          type="daterange"
          @change="changeTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
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
        <el-table-column prop="factory" label="工厂"/>
        <el-table-column prop="supplier" label="供应商"/>
        <el-table-column prop="period" label="期间"/>
        <el-table-column prop="reportDate" label="报表日期"/>
        <el-table-column prop="specialSuggestion" label="特别提示"/>
        <el-table-column prop="number" label="序号"/>
        <el-table-column prop="materialNumber" label="物料号"/>
        <el-table-column prop="materialName" label="物料名称"/>
        <el-table-column prop="count" label="数量"/>
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
  name: "Settlement",
  data() {
    return {
      value1: [],
      tableUtil: {}
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.inventory.settlement, {}, '寄售物资结算通知单');
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
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    changeTime() {
      if (this.value1 !== null) {
        if (this.value1.length > 0) {
          this.tableUtil.filter.startTime = this.value1[0]
          this.tableUtil.filter.entTime = this.value1[1]
        }
      } else {
        this.tableUtil.filter.startTime = ''
        this.tableUtil.filter.entTime = ''
      }
    },
    back() {
      this.$router.push('/procurement/inventory/consignment')
    }
  }
}
</script>

<style scoped>

</style>
