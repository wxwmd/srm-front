<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialDescription" placeholder="物料描述"/>
        <el-select size="mini" v-model="tableUtil.filter.planType" filterable clearable placeholder="请选择类型">
          <el-option label="提前" value="提前"></el-option>
          <el-option label="取消" value="取消"></el-option>
        </el-select>
        <el-select size="mini" v-model="tableUtil.filter.cancelStatus" filterable clearable placeholder="请选择取消状态">
          <el-option label="可取消" value="可取消"></el-option>
          <el-option label="不可取消" value="不可取消"></el-option>
        </el-select>
      </div>
      <div class="jz-toolbar-margin1">
        <button class="jz-btn" @click="doSearch()" style="margin-right: 10px">查询</button>
        <el-button type="primary" plain v-if="this.$store.state.user.type === 1" @click="update()">确认落实日期和备注</el-button>
        <el-button type="primary" plain @click="exportData()" v-if="this.$store.state.user.type !== 1">导出</el-button>
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
        <el-table-column prop="materialNumber" label="物料号" width="120"/>
        <el-table-column prop="materialDescription" label="物料描述" width="150"/>
        <el-table-column prop="plant" label="工厂" width="150"/>
        <el-table-column prop="period" label="周期" width="80"/>
        <el-table-column prop="createDate" label="创建日期" width="90"/>
        <el-table-column prop="receDate" label="收货日期" width="90"/>
        <el-table-column prop="rescheduledDate" label="再计划日期" width="90"/>
        <el-table-column label="落实日期" width="170">
          <template slot-scope="scope">
            <el-date-picker
                    v-if="type === 1"
                    size="mini"
                    v-model="scope.row.carryOutTheDate"
                    type="date"
                    @change="changeData(scope.row)"
                    value-format="yyyy-MM-dd">
            </el-date-picker>
            <span v-else>{{scope.row.carryOutTheDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200">
          <template slot-scope="scope">
            <el-input v-if="type === 1" size="mini" v-model="scope.row.remark" @change="changeMark(scope.row)"></el-input>
            <span v-else>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交货点日期" width="90"/>
        <el-table-column prop="pOrder" label="采购订单" width="120"/>
        <el-table-column prop="project" label="项目"/>
        <el-table-column prop="orderQty" label="订单数量" width="70"/>
        <el-table-column prop="planType" label="类型" width="90"/>
        <el-table-column prop="cancelStatus" label="取消状态" width="90"/>
        <el-table-column prop="determineOrderRatio" label="确定订单比率" width="70"/>
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
  data(){
    return{
      type: this.$store.state.user.type,
      tableUtil: {},
      model:{}
    }
  },
  created () {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.replan, {}, '再计划时间确认查询');
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
    update(){
      if (this.model.carryOutTheDate === undefined){
        this.$message.error('请先填写落实日期')
      }else{
        this.$api.supplier.procurement.infoMaintenance.replan.update(this.model).then(res => {
          if (res.code === 200){
            this.$message.success(this.model.plant + '再计划时间已确认')
            this.tableUtil.initTable()
          } else {
            this.$message.error(res.code + ':' + res.msg)
          }
        })
      }

    },
    changeData(item){
      this.model = item
    },
    changeMark(item){
      this.model = item
    },
    exportData(){
      // if(this.tableUtil.filter.materialNumber === undefined ){
      //   this.tableUtil.filter.materialNumber = ''
      // }
      this.tableUtil.form.currentApi = this.$api.supplier.procurement.infoMaintenance.replan.export
      this.tableUtil.export()
    }
  }
}
</script>

<style scoped>
  .jz-module-toolbar{
    align-items: flex-start;
  }
  .jz-module-toolbar>div:first-child{
    width: 68%;
  }
  .jz-toolbar-margin1{
    margin-top: 0;
  }
  /deep/ .el-select > .el-input{
    width: 200px;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 140px;
  }
</style>
