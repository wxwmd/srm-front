<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="small" clearable v-model="tableUtil.filter.accountingYear" placeholder="会计年度"/>
        <el-input class="jz-input" size="small" clearable v-model="tableUtil.filter.month" placeholder="月份"/>
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
        <el-table-column prop="company" label="公司"/>
        <el-table-column prop="accountingYear" label="会计年度" width="150"/>
        <el-table-column prop="month" label="月份" width="90"/>
        <el-table-column prop="paymentAmount" label="付款金额" width="120"/>
        <el-table-column prop="text" label="文本"/>
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

export default {
  name: "ActualPayment",
  data() {
    return {
      tableUtil: {},
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.finance.actualPayment, {}, '实际付款情况查询');
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
    }
  }
}
</script>

<style scoped>

</style>
