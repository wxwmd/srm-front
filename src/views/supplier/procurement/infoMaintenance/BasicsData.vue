<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div v-if="this.$store.state.user.type !== 1">
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <!--<div>-->
      <!--<el-button type="primary" plain @click="exportData()">导出</el-button>-->
      <!--</div>-->
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
<!--        <el-table-column label="企业审核意见" width="200">-->
<!--          <template slot-scope="scope">-->
<!--            <el-input size="mini" v-if="type !== 1" v-model="scope.row.roundEnterpriseAuditOpinions"></el-input>-->
<!--            <span v-else>{{ scope.row.roundEnterpriseAuditOpinions }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="企业回馈结论" width="200">
          <template slot-scope="scope">
            <el-input size="mini" type="textarea" v-if="type !== 1"
                      v-model="scope.row.miniQuantityEnterpriseFeedbackConclusion"></el-input>
            <span v-else>{{ scope.row.miniQuantityEnterpriseFeedbackConclusion }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roundEnterpriseConfirmationDate" label="企业确认时间" width="100"/>
        <el-table-column prop="materialNumber" label="物料号" width="100"/>
        <el-table-column prop="materialDescription" label="物料描述" width="150"/>
        <el-table-column prop="trafficStabilityClassification" :formatter="formatDict" label="流量稳定性分类"/>
        <el-table-column prop="trafficClassification" :formatter="formatDict" label="流量分类"/>
        <el-table-column prop="riskClassification" :formatter="formatDict" label="风险分类"/>
        <el-table-column prop="factory" label="工厂" width="130"/>
        <el-table-column label="舍入值 最小包装">
          <el-table-column prop="roundSysExistingValue" label="系统现有值" width="90"/>
          <el-table-column label="供应商反馈设置数量" width="90">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.roundSupplierFeedbackSetQuantity"></el-input>
              <span v-else>{{ scope.row.roundSupplierFeedbackSetQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.roundEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.roundEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="最小批量">
          <el-table-column prop="miniQuantitySysExistingValue" label="系统现有值"/>
          <el-table-column label="供应商反馈设置数量" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1"
                        v-model="scope.row.miniQuantitySupplierFeedbackSetQuantity"></el-input>
              <span v-else>{{ scope.row.miniQuantitySupplierFeedbackSetQuantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.roundBatchEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.roundBatchEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商设置必要性">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.miniQuantitySupplierSetNecessity"></el-input>
              <span v-else>{{ scope.row.miniQuantitySupplierSetNecessity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.roundBatchNecessityEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.roundBatchNecessityEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="送货频次">
          <el-table-column label="供应商维护建议" width="200">
            <template slot-scope="scope">
              <el-select size="mini" v-if="type === 1" v-model="scope.row.deliveryFrequency">
                <el-option
                    v-for="(item,index) in deliveryFrequencyList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue">
                </el-option>
              </el-select>
              <span v-else>{{ formatValue('deliveryFrequency',scope.row.deliveryFrequency) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.adviseEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.adviseEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="keyComponentName" label="关键零部件名称"/>
        <el-table-column prop="keyComponentInventory" label="关键零部件库存"/>
        <el-table-column label="实际采购周期/天">
          <el-table-column label="原材料/半成品准备周期" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.actualMaterialsReadyDay"></el-input>
              <span v-else>{{ scope.row.actualMaterialsReadyDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.rawMaterialPeriodEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.rawMaterialPeriodEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划锁定周期" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.actualPlanLockDay"></el-input>
              <span v-else>{{ scope.row.actualPlanLockDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.lockPlanEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.lockPlanEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产周期" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.actualProductionDay"></el-input>
              <span v-else>{{ scope.row.actualProductionDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.productionEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.productionEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运输周期" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.actualTransportationDay"></el-input>
              <span v-else>{{ scope.row.actualTransportationDay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.transportationEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.transportationEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总计" width="100">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type === 1" v-model="scope.row.actualTotal"></el-input>
              <span v-else>{{ scope.row.actualTotal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业审核意见" width="200">
            <template slot-scope="scope">
              <el-input size="mini" v-if="type !== 1" v-model="scope.row.totalEnterpriseAuditOpinions"></el-input>
              <span v-else>{{ scope.row.totalEnterpriseAuditOpinions }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="purchaseDay" label="采购周期"/>
        <el-table-column prop="purchaseType" :formatter="formatDict" label="采购类型"/>
        <el-table-column prop="category" label="品类"/>
        <el-table-column prop="socialGeneralityClassification" label="社会通用性分类"/>
        <el-table-column prop="supplyMode" :formatter="formatDict" label="供货方式"/>
        <el-table-column prop="purchaseGroup" label="采购组"/>
        <el-table-column prop="updateDate" label="更新日期"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type === 3" label="供应商编码" width="100"/>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="update(scope.row)">提交</el-button>
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
  name: "Assembly",
  data() {
    return {
      type: this.$store.state.user.type,
      tableUtil: {},
      trafficStabilityClassificationList: [],
      trafficClassificationList: [],
      riskClassificationList: [],
      purchaseTypeList: [],
      supplyModeList: [],
      deliveryFrequencyList: []
    }
  },
  created() {
    this.getDict("trafficStabilityClassification");
    this.getDict("trafficClassification");
    this.getDict("riskClassification");
    this.getDict("purchaseType");
    this.getDict("supplyMode");
    this.getDict("deliveryFrequency");
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.basicsData, {}, '供应商库存管理');
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
      this.$api.supplier.procurement.infoMaintenance.basicsData.update(item).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功')
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    getDict(dictType) {
      this.$api.supplier.system.dict(dictType).then(res => {
        if (res.code == 200) {
          if (dictType === "trafficStabilityClassification") {
            this.trafficStabilityClassificationList = res.data;
          } else if (dictType === "trafficClassification") {
            this.trafficClassificationList = res.data;
          } else if (dictType === "riskClassification") {
            this.riskClassificationList = res.data;
          } else if (dictType === "purchaseType") {
            this.purchaseTypeList = res.data;
          } else if (dictType === "supplyMode") {
            this.supplyModeList = res.data;
          } else if (dictType === "deliveryFrequency") {
            this.deliveryFrequencyList = res.data;
          }
        }
      })
    },
    formatDict(row, column, cellValue) {
      let dictLabel = "";
      if (column.property === "trafficStabilityClassification") {
        this.trafficStabilityClassificationList.forEach(function (v) {
          if (cellValue === v.dictValue) {
            dictLabel = v.dictLabel;
            return;
          }
        })
      } else if (column.property === "trafficClassification") {
        this.trafficClassificationList.forEach(function (v) {
          if (cellValue === v.dictValue) {
            dictLabel = v.dictLabel;
            return;
          }
        })
      } else if (column.property === "riskClassification") {
        this.riskClassificationList.forEach(function (v) {
          if (cellValue === v.dictValue) {
            dictLabel = v.dictLabel;
            return;
          }
        })
      } else if (column.property === "purchaseType") {
        this.purchaseTypeList.forEach(function (v) {
          if (cellValue === parseInt(v.dictValue)) {
            dictLabel = v.dictLabel;
            return;
          }
        })
      } else if (column.property === "supplyMode") {
        this.supplyModeList.forEach(function (v) {
          if (cellValue === v.dictValue) {
            dictLabel = v.dictLabel;
            return;
          }
        })
      }
      return dictLabel;
    },
    formatValue(name,value){
      let dictLabel = "";
      if (name === 'deliveryFrequency') {
        this.deliveryFrequencyList.forEach(function (v) {
          if (value === v.dictValue) {
            dictLabel = v.dictLabel;
            return;
          }
        })
      }
      return dictLabel;
    }
  }
}
</script>

<style scoped>

</style>
