<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.pOrder" placeholder="采购订单号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.plant" placeholder="工厂"/>
        <el-date-picker
            v-model="tableUtil.filter.startTime"
            value-format="timestamp"
            type="datetime"
            size="mini"
            placeholder="交货日期区间开始日期">
        </el-date-picker>
        <el-date-picker
            v-model="tableUtil.filter.entTime"
            value-format="timestamp"
            type="datetime"
            size="mini"
            placeholder="交货日期区间结束日期">
        </el-date-picker>
      </div>
      <div>
        <button class="jz-btn" @click="doSearch()" style="margin-right: 10px">查询</button>
        <el-button type="primary" plain @click="confirm()" v-if="this.$store.state.user.type === 1">装运信息确认</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                ref="multipleTable"
                :row-key="getRowId"
                style="width:100%">
        <el-table-column v-if="this.$store.state.user.type === 1" type="selection" :reserve-selection="true"
                         width="55"/>
        <el-table-column type="index" width="50"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="materialNumber" label="物料号" width="100"/>
        <el-table-column prop="materialDescription" label="物料描述" width="150"/>
        <el-table-column prop="purchaseOrder" label="采购订单号" width="100"/>
        <el-table-column prop="lineItem" label="行项目"/>
        <el-table-column prop="type" label="类别"/>
        <el-table-column prop="factory" label="工厂" width="100"/>
        <el-table-column prop="createDate" label="创建日期" width="100"/>
        <el-table-column prop="deliveryDate" label="交货日期" width="100"/>
        <el-table-column prop="loadingShipmentDate" label="装车发运日期" width="100"/>
        <el-table-column prop="orderNumber" label="订单数量"/>
        <el-table-column prop="receivingNumber" label="收货数量"/>
        <el-table-column prop="remainingQuantity" label="剩余数量"/>
        <el-table-column prop="inventoryMatching" label="库存匹配"/>
        <el-table-column prop="remainingDate" label="承诺到货日期" width="100"/>
        <el-table-column prop="unit" label="单位" width="60"/>
        <el-table-column prop="storageLocation" label="库位"/>
        <el-table-column prop="versionNumber" label="版本号"/>
        <el-table-column prop="dimensionSize" label="大小量纲"/>
        <el-table-column prop="purchaseGroup" label="采购组"/>
        <el-table-column prop="supplierMaterial" label="供应商物料号" width="100"/>
        <el-table-column prop="purchasePerson" label="采购员"/>
        <el-table-column prop="contactInformation" label="联系方式" width="120"/>
        <el-table-column prop="companyAddress" label="公司地址" width="150"/>
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
  name: "ShippingOrder",
  data() {
    return {
      tableUtil: {},
      value1: [],
      selectList: []
    }
  },
  created() {
    let username = this.$route.query.username;
    if (username) {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.shippingOrder, {}, '装车单维护', false);
      this.tableUtil.filter.username = username;
      this.tableUtil.filter.colorStatus = this.$route.query.colorStatus;
      this.tableUtil.initTable();
    } else {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.shippingOrder, {}, '装车单维护');
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
      if (this.tableUtil.filter.startTime != undefined && this.tableUtil.filter.entTime == undefined) {
        this.$message.error('请输入结束时间')
      } else if (this.tableUtil.filter.startTime == undefined && this.tableUtil.filter.entTime != undefined) {
        this.$message.error('请输入开始时间')
      } else if (this.tableUtil.filter.startTime != undefined && this.tableUtil.filter.entTime != undefined) {
        if (this.tableUtil.filter.entTime < this.tableUtil.filter.startTime) {
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
    getRowId(row) {
      return row.purchaseId
    },
    confirm() {
      for (let i = 0; i < this.$refs.multipleTable.selection.length; i++) {
        if (this.$refs.multipleTable.selection[i].inventoryMatching < 0 || !this.$refs.multipleTable.selection[i].inventoryMatching) {
          this.$message.error('第' + (i + 1) + '行库存匹配不满足，请重新选择');
          return;
        }
      }

      if (this.$refs.multipleTable.selection.length === 0) {
        this.$message.error('请选择需要装车的订单')
      } else {
        let list = []
        this.$refs.multipleTable.selection.forEach(item => {
          list.push(item.remainingQuantity)
        })
        if (list.indexOf(0) === -1) {
          this.selectList = []
          this.$refs.multipleTable.selection.forEach(select => {
            this.selectList.push(select.purchaseId)
          })
          this.$router.push({path: '/procurement/infoMaintenance/upShipping', query: {selectList: this.selectList}});
        } else {
          this.$message.error('请选择剩余数量不为0的订单装车')
        }
      }
    }
  }
}
</script>

<style scoped>
.jz-module-toolbar {
  align-items: flex-start;
}

.jz-module-toolbar > div:first-child {
  width: 68%;
}

/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  margin-right: 10px;
  width: 200px;
}

/deep/ .el-input__prefix {
  line-height: 28px;
}
</style>
