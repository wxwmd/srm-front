<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialDescription"
                  placeholder="物料描述"/>
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
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商"/>
        <el-table-column prop="supplierName" v-if="this.$store.state.user.type !== 1" label="供应商名称"/>
        <el-table-column prop="materialNumber" label="物料号"/>
        <el-table-column prop="materialDescription" label="物料描述"/>
        <el-table-column prop="plant" label="工厂"/>
        <el-table-column prop="materialType" label="物料类别"/>
        <el-table-column prop="conversionUnit" label="转换单位量"/>
        <el-table-column prop="unit" label="单位"/>
        <el-table-column prop="mrp" label="MRP控制者"/>
        <el-table-column prop="maintainType" label="维护类型"/>
        <el-table-column label="0月">
          <el-table-column prop="zeroSum" label="总计需求"/>
        </el-table-column>
        <el-table-column label="1月">
          <el-table-column prop="oneSum" label="总计需求"/>
        </el-table-column>
        <el-table-column label="2月">
          <el-table-column prop="twoSum" label="总计需求"/>
        </el-table-column>
        <el-table-column label="3月">
          <el-table-column prop="threeSum" label="总计需求"/>
        </el-table-column>
        <el-table-column label="4月">
          <el-table-column prop="fourSum" label="总计需求"/>
        </el-table-column>
        <el-table-column label="5月">
          <el-table-column prop="fiveSum" label="总计需求"/>
        </el-table-column>
        <el-table-column label="6月">
          <el-table-column prop="sixSum" label="总计需求"/>
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
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'

export default {
  name: "SixRequirement",
  data() {
    return {
      tableUtil: {},
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.plan.sixRequirement, {}, '供应商库存管理');
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
      if (this.tableUtil.filter.materialNumber === undefined) {
        this.tableUtil.filter.materialNumber = ''
      }
      this.tableUtil.form.currentApi = this.$api.supplier.collaboration.assembly.export
      this.tableUtil.export()
    }
  }
}
</script>

<style scoped>

</style>
