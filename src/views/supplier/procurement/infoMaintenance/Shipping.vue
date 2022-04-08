<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.loadingNumber" placeholder="装车单号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.factory" placeholder="工厂"/>
        <el-date-picker
          size="mini"
          value-format="yyyy-MM-dd"
          v-model="tableUtil.filter.loadingDate"
          type="date"
          placeholder="装车日期">
        </el-date-picker>
        <el-date-picker
          v-model="tableUtil.filter.startTime"
          value-format="timestamp"
          type="date"
          size="mini"
          placeholder="计划到货日期开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="tableUtil.filter.entTime"
          value-format="timestamp"
          type="date"
          size="mini"
          placeholder="计划到货日期结束日期">
        </el-date-picker>
      </div>
      <div>
        <button class="jz-btn" @click="doSearch()" style="margin-right: 10px">查询</button>
        <el-button type="primary" plain @click="update()" v-if="this.$store.state.user.type === 1">修改</el-button>
        <el-button type="danger" plain @click="remove()" v-if="this.$store.state.user.type === 1">删除</el-button>
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
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="loadingNumber" label="装车单号" width="110"/>
        <el-table-column prop="factory" label="工厂" width="120"/>
        <el-table-column prop="loadingDocumentDate" label="装车单生成日期" width="110"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type === 3" label="供应商代码"/>
        <el-table-column prop="loadingWay" label="装运方式" width="90" :formatter="formatLoadingWay"/>
        <el-table-column prop="loadingDate" label="装车日期" width="90"/>
        <el-table-column prop="planDeliveryDate" label="计划到货日期" width="100"/>
        <el-table-column prop="loadingShipmentDate" label="装运时间" width="90"/>
        <el-table-column prop="licensePlateNumber" label="车牌号"/>
        <el-table-column prop="logisticsContactInformation" label="物流联系方式" width="100"/>
        <el-table-column prop="receivingWindow" label="收货窗口"/>
        <el-table-column prop="shippingExplain" label="装运说明"/>
<!--        <el-table-column prop="documentName" label="质量报告">-->
<!--          <template slot-scope="scope">-->
<!--            <span class="jz-documentName" @click="download(scope.row)">{{scope.row.documentName}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="getShippingDetails(scope.row.id)">详情</el-button>
            <el-button type="primary" plain @click="print(scope.row.id)">打印</el-button>
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
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close
                 width="600px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="110px">
          <el-form-item label="装车单号" prop="loadingNumber">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.loadingNumber" disabled/>
          </el-form-item>
          <el-form-item label="车牌号" prop="licensePlateNumber">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.licensePlateNumber"/>
          </el-form-item>
          <el-form-item label="物料联系方式" prop="logisticsContactInformation">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.logisticsContactInformation"/>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="jz-form">
      <el-dialog title="查看装车单详情" :close-on-click-modal="false" :visible.sync="shipping.visible" width="1200px">
        <div class="jz-shipping-detail">
          <p>装车单号：{{shipping.detailsData.loadingNumber}}</p>
          <p>采购单位：{{shipping.detailsData.procurementUnit}}</p>
          <p>采购单位地址：{{shipping.detailsData.procurementUnitAddress}}</p>
          <p>收货窗口：{{shipping.detailsData.receivingWindow}}</p>
          <p>装运到货日期：{{shipping.detailsData.planDeliveryDate}}</p>
          <p>车牌号：{{shipping.detailsData.licensePlateNumber}}</p>
          <p>物流联系方式：{{shipping.detailsData.logisticsContactInformation}}</p>
          <p>装运日期：{{shipping.detailsData.loadingDate}}</p>
        </div>
        <el-table highlight-current-row
                  border
                  size="mini"
                  :data="shipping.tableData"
                  style="width:100%">
          <el-table-column type="index" label="序号" width="50"/>
          <el-table-column prop="documentName" label="质量报告" width="100">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="download(scope.row)">下载</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
          <el-table-column prop="materialNumber" label="物料号" width="100"/>
          <el-table-column prop="materialDescription" label="物料描述" width="150"/>
          <el-table-column prop="purchaseOrder" label="采购订单号" width="100"/>
          <el-table-column prop="lineItem" label="行项目"/>
          <el-table-column prop="type" label="类别"/>
          <el-table-column prop="factory" label="工厂" width="100"/>
          <el-table-column prop="orderNumber" label="订单数量" width="70"/>
          <el-table-column prop="loadingShipmentNumber" label="装车数量" width="70"/>
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
      </el-dialog>
    </div>
    <shipping-details v-if="details.isDetails" :details="details" @getIsDetails="getDetails($event)"></shipping-details>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import ShippingDetails from '@/components/supplier/shipping/shippingDetails'
import common from "@/assets/supplier/js/common";
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "Shipping",
  components: {ShippingDetails},
  data() {
    return {
      details: {
        isDetails: false,
        id: ''
      },
      loadingWayList: [],
      value1: [],
      tableUtil: {},
      form: {
        formRules: {
          licensePlateNumber: [
            {required: true, message: '车牌号不能为空', trigger: 'blur'}
          ],
          logisticsContactInformation: [
            {required: true, message: '联系方式不能为空', trigger: 'blur'}
          ],
        },
      },
      shipping:{
        visible:false,
        detailsData:{},
        tableData:[]
      }
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.shipping, {}, '装车单');
    // 字典值
    this.$api.supplier.system.dict('loadingWay').then(res => {
      if (res.code === 200) {
        this.loadingWayList = res.data
      }
    })
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
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    update() {
      this.tableUtil.update()
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save()
        }
      })
    },
    getShippingDetails(id){
      this.$api.supplier.procurement.infoMaintenance.shipping.getDetail(id).then(res => {
        if (res.code === 200){
          this.shipping.detailsData = res.data
          this.shipping.tableData = res.data.records
          this.shipping.visible = true
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    //打印
    print(number) {
      this.details.id = number
      this.details.isDetails = true
    },
    //接收子组件修改的值
    getDetails(data) {
      this.details.isDetails = data
    },
    formatLoadingWay(row, column, cellValue) {
      for (let item in this.loadingWayList) {
        if (cellValue == this.loadingWayList[item].dictValue) {
          return this.loadingWayList[item].dictLabel
        }
      }
    },
    download(data){
      let params = {// 参数
        id: data.id
      };
      this.$api.supplier.procurement.infoMaintenance.shipping.download("blob", params).then(res => {
        common.blobDownLoad(res);
      })
    },
    beforeClose(done) {
      this.cleanVerifyMessage()
      done()
    },
    // 清空表单验证信息
    cleanVerifyMessage() {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    }
  }
}
</script>

<style scoped>
  .jz-module-toolbar{
    align-items: flex-start;
  }
  .jz-module-toolbar>div:first-child{
    width: 75%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-right: 10px;
    width: 200px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
  .jz-documentName {
    cursor: pointer;
  }
  .jz-documentName:hover {
    color: #4499ff;
  }
  .jz-shipping-detail{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .jz-shipping-detail p{
    width: 24%;
    font-size: 14px;
    line-height: 30px;
  }
</style>
