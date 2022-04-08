<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialDescription" placeholder="物料号描述"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="this.$store.state.user.type === 1">
        <el-popover class="jz-import" placement="top" width="320" v-model="tableUtil.upload.visible">
          <div class="jz-upload">
            <a href="javascript:;">
              选择文件<input type="file" @change="controlUploadChange"/>
            </a>
            <input type="text" v-model="tableUtil.upload.fileName"/>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="tableUtil.upload.visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="controlImportCamera">导入</el-button>
          </div>
          <el-button size="mini" type="primary" class="export" slot="reference" plain>导入</el-button>
        </el-popover>
        <el-button type="primary" plain @click="exportData()">模板导出</el-button>
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
        <el-table-column prop="materialNumber" label="物料号" width="260"/>
        <el-table-column prop="materialDescription" label="物料描述"/>
        <el-table-column prop="supplierInventory" label="供应商库存" width="110"/>
        <el-table-column prop="orderQty" label="订货数量" width="110"/>
        <el-table-column prop="inventoryDiff" label="库存差异" width="110"/>
        <el-table-column prop="updateTime" label="更新时间" width="110"/>
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
    name: "ProductionPlan",
    data(){
      return{
        tableUtil: {},
      }
    },
    created () {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.productionPlan, {}, '供应商生产计划导入');
      if (this.$store.state.user.type === 1){
        this.$message.warning('请先导出模板，在导出的模板中填写对的数据再进行导入')
      }
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
      exportData(){
        this.tableUtil.form.currentApi = this.$api.supplier.procurement.infoMaintenance.productionPlan.export
        this.tableUtil.export()
      },
      // 导入excel文件
      controlImportCamera() {
        this.tableUtil.upload.uploadName = 'file'
        this.tableUtil.module.apis.importApi = this.$api.supplier.procurement.infoMaintenance.productionPlan.import
        this.tableUtil.importCamera()
      },
      // 监听文件上传框
      controlUploadChange(e) {
        this.tableUtil.uploadChange(e)
      }
    }
  }
</script>

<style scoped>

</style>
