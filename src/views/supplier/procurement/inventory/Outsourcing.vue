<template>
    <div class="jz-supplier-container">
        <!--  ToolBar  -->
        <div class="jz-module-toolbar">
            <div>
<!--                <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type === 3" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>-->
                <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.plant" placeholder="工厂"/>
                <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
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
                <el-table-column prop="plant" label="工厂"/>
                <el-table-column prop="materialNumber" label="物料号"/>
                <el-table-column prop="materialDescription" label="物料描述"/>
                <el-table-column prop="qty" label="库存数量"/>
                <el-table-column prop="qty1" label="主机厂库存"/>
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
    name: "Outsourcing",
    data(){
      return{
        tableUtil: {}
      }
    },
    created () {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.inventory.outsourcing, {}, '外协分包库存查询');
    },
    methods:{
      pageSizeChange (limit) {
        this.tableUtil.pageSizeChange(limit)
      },
      pageCurrentChange (page) {
        this.tableUtil.pageCurrentChange(page)
      },
      doSearch(){
        this.tableUtil.initTable()
      },
      formatTime (row, column, cellValue) {
        return formatDateTime(cellValue)
      }
    }
  }
</script>

<style scoped>

</style>
