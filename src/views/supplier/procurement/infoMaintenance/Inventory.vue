<template>
  <div class="jz-supplier-container">
    <div class="jz-overview-title">
      <span>供应商库存匹配</span>
    </div>
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialName" placeholder="物料名称"/>
        <el-date-picker
          v-model="tableUtil.filter.deliveryDate"
          value-format="yyyy-MM-dd"
          type="date"
          size="mini"
          placeholder="交货日期">
        </el-date-picker>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.pOrder" placeholder="采购订单号"/>
        <!--          <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.status" placeholder="状态 -全部，红灯，黄灯"/>-->
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <!--        <div v-if="this.$store.state.user.type === 1">-->
      <!--          <el-button size="mini" type="primary" plain @click="importLink">供应商库存导入</el-button>-->
      <!--          <el-button size="mini" type="primary" plain @click="planLink">供应商生产计划导入</el-button>-->
      <!--        </div>-->
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
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <i :class="scope.row.status === 'yellow' ? 'el-icon-s-opportunity jz-yellow' : (scope.row.status === 'red' ? 'el-icon-s-opportunity jz-red' : (scope.row.status === 'green' ? 'el-icon-s-opportunity jz-green' : ''))"></i>
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="materialNumber" label="物料号" width="150"/>
        <el-table-column prop="materialName" label="物料名称" width="150"/>
        <el-table-column prop="plant" label="工厂" :formatter="formatterPlant"/>
        <el-table-column prop="purchase" label="采购组"/>
        <el-table-column prop="pOrder" label="采购订单号" width="150"/>
        <el-table-column prop="project" label="项目"/>
        <el-table-column prop="rescheduledDate" label="再计划日期" width="100"/>
        <el-table-column prop="supplierEntryDate" label="供应商入库日期" width="110"/>
        <el-table-column prop="orderQty" label="订单数量" width="80"/>
        <el-table-column prop="deliveredQty" label="已交量" width="80"/>
        <el-table-column prop="defQty" label="欠交量" width="80"/>
        <el-table-column prop="inventoryMatching" label="库存匹配" width="80"/>
        <el-table-column prop="installedQty" label="已装车数量" width="90"/>
        <el-table-column prop="type" label="类型"/>
        <el-table-column prop="unit" label="单位" width="80"/>
        <el-table-column prop="orderConfirmation" label="订单确认"/>
        <el-table-column prop="createDate" label="创建日期" width="90"/>
        <el-table-column prop="deliveryDate" label="交货日期" width="90"/>
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
  name: "Assembly",
  data() {
    return {
      tableUtil: {},
      plantList:[],
      statusList:[]
    }
  },
  created() {
    let username = this.$route.query.username;
    if (username) {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.inventory, {}, '供应商库存管理', false);
      this.tableUtil.filter.username = username;
      this.tableUtil.filter.colorStatus = this.$route.query.colorStatus;
      this.tableUtil.initTable();
    } else {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.inventory, {}, '供应商库存管理');
    }
    // setTimeout(() => {
    //   if (this.tableUtil.table.tableData.length === 0 && this.$store.state.user.type === 1){
    //     this.$message.warning('请导入供应商库存和供应商生产计划')
    //   }
    // }, 1000 )
    this.getDict('plant')
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
    getDict(typeName) {
      this.$api.supplier.system.dict(typeName).then(res => {
        if (res.code === 200) {
          this.plantList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    formatterPlant(value) {
      let plant = ''
      this.plantList.forEach(item => {
        if (item.dictValue == value.plant) {
          plant = item.dictLabel
        }
      })
      return plant
    }
    // importLink(){
    //   this.$router.push('/procurement/infoMaintenance/import')
    // },
    // planLink(){
    //   this.$router.push('/procurement/infoMaintenance/productionPlan')
    // }
  }
}
</script>

<style scoped>
  .jz-overview-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 200px;
    margin-right: 10px;
  }
  /deep/ .el-input__prefix{
    line-height: 28px;
  }
  .jz-red {
    color: red;
  }
  .jz-yellow {
    color: yellow;
  }
  .jz-green {
    color: green;
  }
</style>
