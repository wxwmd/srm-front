<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.pOrder" placeholder="采购订单号"/>
        <!--        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.status" placeholder="请选择状态"/>-->
        <el-select size="mini" v-model="tableUtil.filter.status" clearable placeholder="请选择状态">
          <el-option label="确认" :value="1"></el-option>
          <el-option label="未确认" :value="0"></el-option>
        </el-select>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div class="jz-toolbar-margin">
        <el-button type="primary" plain @click="exportData()">导出</el-button>
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
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="materialNumber" label="物料号" width="130"/>
        <el-table-column prop="materialName" label="物料名称" width="150"/>
        <el-table-column prop="pOrder" label="采购订单" width="130"/>
        <el-table-column prop="project" label="项目"/>
        <el-table-column prop="type" label="类型" width="80"/>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? "确认" : "未确认" }}
          </template>
        </el-table-column>
        <el-table-column prop="urgent" label="紧急"/>
        <el-table-column prop="plant" label="工厂" width="120"/>
        <el-table-column prop="releaseReason" label="发布原因" width="150"/>
        <el-table-column prop="componentIdentity" label="组件标识"/>
        <el-table-column prop="version" label="版本号" width="80"/>
        <el-table-column prop="identityInformation" label="标识信息"/>
        <el-table-column prop="qty" label="数量" width="80"/>
        <el-table-column prop="unit" label="单位" width="60"/>
        <el-table-column prop="deliveryDate" label="交货日期" width="100"/>
        <el-table-column prop="createDate" label="建立日期" width="100"/>
        <el-table-column prop="orderReason" label="订单原因" width="150"/>
        <el-table-column prop="purchaseCredentials" label="订单凭证"/>
        <el-table-column prop="qmStatus" label="质检状态"/>
        <el-table-column prop="unqualifiedQty" label="质检不合格数"/>
        <el-table-column prop="readDate" label="阅读日期" width="100"/>
        <el-table-column prop="deliveryConfirm" label="交货确认" width="100"/>
        <el-table-column prop="shipmentInfo" label="装运信息" width="150"/>
        <el-table-column prop="receiveStatus" label="收货状态" width="90"/>
        <el-table-column prop="receiveAmount" label="收货数量" width="100"/>
        <el-table-column prop="orderExplanation" label="订单说明"/>
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
  name: "OrderStatus",
  data() {
    return {
      tableUtil: {},
    }
  },
  created() {
    let username = this.$route.query.username;
    if (username) {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.orderStatus, {}, '采购订单状态查询', false);
      this.tableUtil.filter.username = username;

      let factoryColorStatus = this.$route.query.factoryColorStatus;
      if (factoryColorStatus) {
        this.tableUtil.filter.factoryColorStatus = factoryColorStatus;
      }
      let postponeColorStatus = this.$route.query.postponeColorStatus;
      if (postponeColorStatus) {
        this.tableUtil.filter.postponeColorStatus = postponeColorStatus;
      }
      this.tableUtil.initTable();
    } else {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.orderStatus, {}, '采购订单状态查询');
    }
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
    exportData() {
      if (this.tableUtil.filter.pOrder === undefined) {
        this.tableUtil.filter.pOrder = ''
      }
      if (this.tableUtil.filter.releaseReason === undefined) {
        this.tableUtil.filter.releaseReason = ''
      }
      if (this.tableUtil.filter.status === undefined) {
        this.tableUtil.filter.status = ''
      }
      this.tableUtil.form.currentApi = this.$api.supplier.procurement.infoMaintenance.orderStatus.export
      this.tableUtil.export()
    }
  }
}
</script>

<style scoped>

</style>
