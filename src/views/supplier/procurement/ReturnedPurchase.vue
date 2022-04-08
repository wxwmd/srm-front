<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div v-if="this.$store.state.user.type !== 1">
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <!--<div>-->
      <!--<el-button type="primary" plain @click="exportData()">导出</el-button>-->
      <!--</div>-->
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
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="materialNumber" label="物料号"/>
<!--        <el-table-column prop="materialDescription" label="物料描述"/>-->
        <el-table-column prop="pType" label="采购类型" width="90"/>
        <el-table-column prop="plant" label="工厂"/>
        <el-table-column prop="applyQty" label="申请退货数量" width="80"/>
        <el-table-column prop="confirmQty" label="确认退货数量" width="80"/>
        <el-table-column prop="status" :formatter="formatDict" label="退货确认单状态" width="110"/>
        <el-table-column prop="unit" label="单位" width="60"/>
        <el-table-column prop="unPurchaseOrder" label="未开票采购订单"/>
        <el-table-column prop="modeTransport" label="实物拉走方式" width="100"/>
        <el-table-column prop="expressCompany" label="快递公司" width="100"/>
        <el-table-column prop="shippingAddress" label="收货地址"/>
        <el-table-column prop="consigneeName" label="收货人姓名" width="90"/>
        <el-table-column prop="phone" label="收货人电话" width="100"/>
        <!--        <el-table-column prop="supplierCode" label="供应商编码"/>
                <el-table-column prop="returnNo" label="退货单号"/>
                <el-table-column prop="returnType" label="退货单分类"/>-->
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
  name: "ReturnedPurchase",
  data() {
    return {
      tableUtil: {},
      returnStateList: []
    }
  },
  created() {
    this.getDict();
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.returnedPurchase, {}, '冻结积待退货');
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
    getDict() {
      this.$api.supplier.system.dict("returnState").then(res => {
        if (res.code == 200) {
          this.returnStateList = res.data
        }
      });
    },
    formatDict(row, column, cellValue) {
      let dictLabel = "";
      this.returnStateList.forEach(function (v) {
        if (cellValue === v.dictValue) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    }
  }
}
</script>

<style scoped>

</style>
