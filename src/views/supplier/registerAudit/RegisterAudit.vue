<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.username" placeholder="用户名"/>
        <el-select size="mini" v-model="tableUtil.filter.examineStatus" placeholder="请选择审核状态">
          <el-option label="待审核" value="0"></el-option>
          <el-option label="审核未通过" value="2"></el-option>
        </el-select>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
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
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="examineStatus" label="审核状态" width="100px">
          <template slot-scope="scope">
            {{scope.row.examineStatus === 0 ? '待审核' : (scope.row.examineStatus === 2 ? '审核未通过' : '')}}
          </template>
        </el-table-column>
        <el-table-column prop="buyerNumber" label="采购员" width="90"/>
        <el-table-column prop="phone" label="电话" width="100"/>
        <el-table-column prop="problem" label="问题" width="150px"/>
        <el-table-column prop="answer" label="答案" width="150px"/>
        <el-table-column prop="companyName" label="公司名称" width="180"/>
        <el-table-column prop="companyAddress" label="公司地址" width="140"/>
        <el-table-column prop="companyEmail" label="公司邮箱" width="110"/>
        <el-table-column prop="companyWebsite" label="公司网址" width="130"/>
        <el-table-column prop="companyPhone" label="公司电话" width="100"/>
        <el-table-column prop="companyFax" label="公司传真"/>
        <el-table-column prop="technicalDirector" label="技术负责人"/>
        <el-table-column prop="technicalDirectorPhone" label="技术负责人电话" width="100"/>
        <el-table-column prop="financeDirector" label="财务负责人"/>
        <el-table-column prop="financeDirectorPhone" label="财务负责人电话" width="100"/>
        <el-table-column prop="saleDirector" label="销售负责人"/>
        <el-table-column prop="saleDirectorPhone" label="销售负责人电话" width="100"/>
        <el-table-column prop="industryExperience" label="行业经验（年）"/>
        <el-table-column prop="proposedSuppliesTop" label="拟供物资排名"/>
        <el-table-column prop="mainMaterials" label="主营物资"/>
        <el-table-column prop="otherMainMaterials" label="其他主营物资"/>
        <el-table-column prop="proposedSupplies" label="拟供物资"/>
        <el-table-column prop="otherProposedSupplies" label="其他拟供物资"/>
        <el-table-column prop="currentQualitySystem" label="现行质量体系"/>
        <el-table-column prop="mainCompetitors" label="主要竞争对手"/>
        <el-table-column prop="nowCompanyMainCustomers" label="目前公司主要客户"/>
        <el-table-column label="审核" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" title="审核通过" icon="el-icon-check" :disabled="scope.row.examineStatus !== 0" circle @click="audit(scope.row)"></el-button>
            <el-button size="mini" type="primary" title="审核不通过" icon="el-icon-close" :disabled="scope.row.examineStatus !== 0" circle @click="auditError(scope.row)"></el-button>
          </template>
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
import TableUtil from "@/assets/supplier/js/TableUtil";
export default {
  name: "RegisterAudit",
  data() {
    return {
      tableUtil: {}
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.registerAudit, {}, '供应商注册审核')
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
    audit(data){
      let params = {
        supplierId: data.supplierId,
        examineStatus: 1
      }
      this.updateAudit(params)
    },
    auditError(data){
      let params = {
        supplierId: data.supplierId,
        examineStatus: 2
      }
      this.updateAudit(params)
    },
    updateAudit(data){
      this.$api.supplier.registerAudit.update(data).then(res => {
        if (res.code === 200){
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  /deep/ .el-button{
    padding: 0 7px;
  }
</style>
