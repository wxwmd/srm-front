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
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.plant" placeholder="工厂"/>
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
        <el-table-column prop="plant" label="工厂" width="120"/>
        <el-table-column prop="materialNumber" label="物料号" width="120"/>
        <el-table-column prop="materialDescription" label="描述" width="150"/>
        <el-table-column prop="adjustType" label="调整类型" width="150">
          <template slot-scope="scope">
            <el-select size="mini" v-if="type === 1" v-model="scope.row.adjustType" placeholder="请选择">
              <el-option label="订单数量" :value="1"/>
              <el-option label="取消订单" :value="2"/>
              <el-option label="订单拆单" :value="3"/>
              <el-option label="交付时间" :value="4"/>
            </el-select>
            <span v-else>{{ scope.row.adjustType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购凭证" width="130">
          <template slot-scope="scope">
            <el-input size="mini" v-if="type === 1 && scope.row.adjustType === 2" v-model="scope.row.pOrder"></el-input>
            <span v-else>{{ scope.row.pOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目" width="90">
          <template slot-scope="scope">
            <el-input size="mini" v-if="type === 1 && scope.row.adjustType === 2"
                      v-model="scope.row.project"></el-input>
            <span v-else>{{ scope.row.project }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期" width="100"/>
        <el-table-column prop="deliveryDate" label="交货日期" width="100"/>
        <el-table-column prop="rescheduledDate" label="再计划日期" width="100"/>
        <el-table-column prop="orderQty" label="订单数量"/>
        <el-table-column prop="deliveredQty" label="已交量"/>
        <el-table-column prop="defQty" label="欠交量"/>
        <el-table-column prop="isSatisfy" label="是否满足双周需求（Y/N)"/>
        <el-table-column label="数量1" width="150">
          <template slot-scope="scope">
            <el-input size="mini" v-if="type === 1 && scope.row.adjustType !== 2" v-model="scope.row.qty1"></el-input>
            <span v-else>{{ scope.row.qty1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate1" label="交货期1" width="200">
          <template slot-scope="scope">
            <el-date-picker
                size="mini"
                v-if="type === 1 && (scope.row.adjustType === 3 || scope.row.adjustType === 4)"
                v-model="scope.row.deliveryDate1"
                type="date"
                value-format="yyyy-MM-dd">
            </el-date-picker>
            <span v-else>{{ scope.row.deliveryDate1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量2" width="150">
          <template slot-scope="scope">
            <el-input size="mini" v-if="type === 1 && scope.row.adjustType !== 2" v-model="scope.row.qty2"></el-input>
            <span v-else>{{ scope.row.qty2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交货期2" width="200">
          <template slot-scope="scope">
            <el-date-picker
                size="mini"
                v-if="type === 1 && scope.row.adjustType === 3"
                v-model="scope.row.deliveryDate2"
                type="date"
                value-format="yyyy-MM-dd">
            </el-date-picker>
            <span v-else>{{ scope.row.deliveryDate2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量3" width="150">
          <template slot-scope="scope">
            <el-input size="mini" v-if="type === 1 && scope.row.adjustType !== 2" v-model="scope.row.qty3"></el-input>
            <span v-else>{{ scope.row.qty3 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交货期3" width="200">
          <template slot-scope="scope">
            <el-date-picker
                size="mini"
                v-if="type === 1 && scope.row.adjustType === 3"
                v-model="scope.row.deliveryDate3"
                type="date"
                value-format="yyyy-MM-dd">
            </el-date-picker>
            <span v-else>{{ scope.row.deliveryDate3 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200">
          <template slot-scope="scope">
            <el-input size="mini" v-if="type === 1" v-model="scope.row.remark"></el-input>
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" v-if="type === 1">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="update(scope.row)"
                       :disabled="scope.row.auditStatus == '1' || scope.row.status == '1'">提交</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="审核状态" width="90">
          <template slot-scope="scope">
            {{
              scope.row.auditStatus == '0' ? "未审核" : (scope.row.auditStatus == '1' ? "审核通过" : (scope.row.auditStatus == '2' ? "审核不通过" : ""))
            }}
          </template>
        </el-table-column>
        <el-table-column label="审核" width="100" v-if="type !== 1">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" title="审核通过" icon="el-icon-check"
                       :disabled="scope.row.auditStatus != '0' || scope.row.auditStatus == ''" circle @click="audit(scope.row)"></el-button>
            <el-button size="mini" type="primary" title="审核不通过" icon="el-icon-close"
                       :disabled="scope.row.auditStatus != '0' || scope.row.auditStatus == ''" circle @click="auditError(scope.row)"></el-button>
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
import TableUtil from '@/assets/supplier/js/TableUtil'

export default {
  name: "Adjust",
  data() {
    return {
      type: this.$store.state.user.type,
      tableUtil: {},
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.orderStatus, {}, '采购订单调整');
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
    update(item) {
      item.auditStatus = '0'
      this.$api.supplier.procurement.infoMaintenance.orderStatus.update(item).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功')
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    audit(item) {
      item.auditStatus = '1'
      item.status = '0'
      item.unDescription = '已调整'
      this.$api.supplier.procurement.infoMaintenance.orderStatus.update(item).then(res => {
        if (res.code === 200) {
          this.$message.success(item.plant + '采购订单调整已审核')
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    auditError(item) {
      item.auditStatus = '2'
      this.$api.supplier.procurement.infoMaintenance.orderStatus.update(item).then(res => {
        if (res.code === 200) {
          this.$message.success(item.plant + '采购订单调整已审核')
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
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 180px;
}

/deep/ .el-button--mini.is-circle {
  padding: 0 7px
}
</style>
