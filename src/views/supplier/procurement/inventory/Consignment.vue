<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type === 3"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.factory" placeholder="工厂"/>
        <!--                <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.outstanding" placeholder="未结算"/>-->
        <!--                <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.clsd" placeholder="已结算"/>-->
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
        <el-checkbox-group v-model="checkList" @change="check">
          <el-checkbox label="未结算"></el-checkbox>
          <el-checkbox label="已结算"></el-checkbox>
          <el-checkbox label="输出收发明细"></el-checkbox>
        </el-checkbox-group>
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
        <el-table-column prop="factory" label="工厂"/>
        <el-table-column prop="firstTerm" label="期初"/>
        <el-table-column prop="income" label="收入"/>
        <el-table-column prop="emit" label="期末"/>
        <el-table-column prop="afterTax" label="不含税金额"/>
        <el-table-column prop="outstanding" label="未结算" v-if="outstandingShow"/>
        <el-table-column prop="clsd" label="已结算" v-if="clsdShow"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type === 3" label="供应商编码"/>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination" v-if="paginationShow">
      <el-pagination @size-change="pageSizeChange"
                     @current-change="pageCurrentChange"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="tableUtil.table.total">
      </el-pagination>
    </div>
    <!--  Table  -->
    <div class="jz-module-table" v-if="detailShow">
      <el-table highlight-current-row
                border
                size="mini"
                @row-click="selectedRow"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
          <el-table-column prop="orderNo" label="单据号"/>
          <el-table-column prop="line" label="行号"/>
          <el-table-column prop="bookedDate" label="记账日期"/>
          <el-table-column prop="shippingMark" label="收发标志"/>
          <el-table-column prop="materialNumber" label="物料号"/>
          <el-table-column prop="materialName" label="物料名称"/>
          <el-table-column prop="qty" label="数量"/>
          <el-table-column prop="money" label="金额"/>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination" v-if="detailShow">
      <el-pagination @size-change="pageSizeDetailChange"
                     @current-change="pageCurrentDetailChange"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "Consignment",
  data() {
    return {
      value1: [],
      tableUtil: {},
      checkList:[],
      outstandingShow:false,
      clsdShow:false,
      paginationShow:true,
      filter: {
        limit: 10,
        page: 1
      },
      tableData:[],
      total:0,
      detailShow:false
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.inventory.consignment, {}, '寄售物资结收发存');
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    pageSizeDetailChange(limit){
      this.filter.limit = limit;
      this.getDetail(this.tableUtil.table.currentRow.id)
    },
    pageCurrentDetailChange(page){
      this.filter.page = page;
      this.getDetail(this.tableUtil.table.currentRow.id)
    },
    selectedRow(row) {
      this.tableUtil.table.currentRow = row
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
    },
    check(list){
      if (list.length > 0){
        let indexO = list.indexOf("未结算")
        let indexC = list.indexOf("已结算")
        let index = list.indexOf("输出收发明细")
        if (indexO === -1){
          this.outstandingShow = false
        } else {
          this.outstandingShow = true
        }
        if (indexC === -1){
          this.clsdShow = false
        } else {
          this.clsdShow = true
        }
        if (index !== -1){
          if (this.tableUtil.table.currentRow !== null){
            this.tableUtil.table.tableData = []
            this.tableUtil.table.tableData.push(this.tableUtil.table.currentRow)
            this.filter.limit = 10
            this.filter.page = 1
            this.getDetail(this.tableUtil.table.currentRow.id)
            this.paginationShow = false
          } else {
            list.splice(index,1);
            this.tableUtil.initTable()
            this.paginationShow = true
            this.$message.warning('请先点击选中表格数据')
          }
        }
      } else {
        this.tableUtil.initTable()
        this.detailShow = false
        this.tableUtil.table.currentRow = null
        this.outstandingShow = false
        this.clsdShow = false
        this.paginationShow = true
      }
    },
    getDetail(id){
      this.filter.id = id
      this.$api.supplier.procurement.inventory.consignment.getDetail(this.filter).then(res => {
        if (res.code === 200){
          this.tableData = res.data.records
          this.total = res.data.total
          this.detailShow = true
        }
      })
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
  /deep/ .el-checkbox-group{
    height: 30px;
    line-height: 30px;
    margin-left: 10px;
  }
</style>
