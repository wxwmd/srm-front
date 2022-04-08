<template>
  <div class="jz-form">
    <el-dialog title="装车单详情" :visible.sync="details.isDetails" width="1600px">
      <div class="jz-shipping-details" id="jz-shipping-details">
        <table>
          <tr>
            <td colspan="2"></td>
            <td colspan="2" style="font-size: 16px;font-weight: bold">主机厂有限公司</td>
            <td rowspan="2" colspan="2">
              <svg id="barcode"></svg>
            </td>
          </tr>
          <tr>
            <td colspan="2"></td>
            <td colspan="2" style="font-weight: bold">物资承运装车单</td>
          </tr>
          <tr>
            <td colspan="2"><strong>装车单号：</strong>{{detailsData.loadingNumber}}</td>
            <td colspan="2"><strong>收货窗口：</strong>{{detailsData.receivingWindow}}</td>
            <td><strong>装运到货日期：</strong>{{detailsData.planDeliveryDate}}</td>
            <td><strong>装车单维护日期：</strong>{{detailsData.loadingDocumentDate}}</td>
          </tr>
          <tr>
            <td style="font-weight: bold">采购单位</td>
            <td>{{detailsData.procurementUnit}}</td>
            <td style="font-weight: bold">采购员</td>
            <td>{{detailsData.purchasePerson}}</td>
            <td style="font-weight: bold">联系方式</td>
            <td>{{detailsData.purchasePhone}}</td>
          </tr>
          <tr>
            <td style="font-weight: bold">采购单位地址</td>
            <td>{{detailsData.procurementUnitAddress}}</td>
            <td style="font-weight: bold">车牌号</td>
            <td>{{detailsData.licensePlateNumber}}</td>
            <td style="font-weight: bold">物流联系方式</td>
            <td>{{detailsData.logisticsContactInformation}}</td>
          </tr>
          <tr>
            <td style="font-weight: bold">供应商名称</td>
            <td>{{detailsData.supplierName}}</td>
            <td style="font-weight: bold">代码</td>
            <td colspan="3">{{detailsData.supplierCode}}</td>
          </tr>
          <tr style="height: auto;">
            <td colspan="6">
              <el-table highlight-current-row
                        border
                        size="mini"
                        :data="tableData"
                        style="width:100%">
                <el-table-column type="index" label="序号" width="50"/>
                <el-table-column prop="materialNumber" label="物料"/>
                <el-table-column prop="materialDescription" label="物料描述"/>
                <el-table-column prop="purchaseOrder" label="采购订单号"/>
                <el-table-column prop="lineItem" label="行项目"/>
                <el-table-column prop="createDate" label="采购订单日期"/>
                <el-table-column prop="orderNumber" label="订单数量" width="70"/>
                <el-table-column prop="loadingShipmentNumber" label="装车数量" width="70"/>
                <el-table-column prop="unit" label="单位" width="50"/>
                <el-table-column prop="storageLocation" label="库位"/>
                <el-table-column prop="shippingSpace" label="仓位"/>
                <el-table-column prop="supplierCode" label="实收数量"/>
                <el-table-column prop="loadingWay" label="计量检查信息"/>
                <el-table-column prop="loadingDate" label="生产订单"/>
                <el-table-column prop="planDeliveryDate" label="申请者"/>
                <el-table-column prop="loadingDate" label="标示信息"/>
                <el-table-column prop="remark" label="备注（关键物资条形码粘贴处）" width="200"/>
              </el-table>
            </td>
          </tr>
        </table>
        <div class="jz-print-foot">
          <span>总件数：</span>
          <span></span>
          <span>总重量：</span>
          <span></span>
          <span>总体积：</span>
          <span></span>
          <span>收料员：</span>
          <span></span>
          <span>收料日期：</span>
          <span></span>
        </div>
      </div>
      <div class="jz-form-btn">
        <el-button type="primary" plain v-print="printObj">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jsbarcode from 'jsbarcode'
export default {
  name: "ShippingDetails",
  props: {
    details: Object
  },
  data() {
    return {
      //条形码
      printObj:{
        id: "jz-shipping-details",
        popTitle: '装车单',
      },
      detailsData:{},
      tableData:[],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
      this.$api.supplier.procurement.infoMaintenance.shipping.getDetail(this.details.id).then(res => {
        if (res.code === 200){
          this.detailsData = res.data
          this.tableData = res.data.records
          this.$nextTick(() => {
            this.barcode()
          })
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    //生成条形码
    barcode(){
      jsbarcode("#barcode", this.detailsData.loadingNumber)
    },
    //修改父组件的值
    beforeClose() {
      this.details.isDetails = false
      this.$emit('getIsDetails', false)
    }
  }
}
</script>

<style scoped>
  .jz-shipping-details {
    width: 100%;
    height: auto;
    padding: 20px;
  }
  .jz-shipping-details table{
    width: 100%;
    border: 1px solid #333;
    border-collapse: collapse;
    color: #333;
  }
  .jz-shipping-details table td{
    border: 1px solid #333;
    line-height: 30px;
    text-align: center;
  }
  /deep/ .el-table--border {
    font-size: 14px;
  }
  /deep/ .el-table--border td, /deep/.el-table--border th, /deep/.el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid #333;
  }
  /deep/ .el-table td, /deep/ .el-table th.is-leaf {
    border-bottom: 1px solid #333;
  }
  /deep/ .el-table th>.cell {
    color: #333;
  }
  /deep/ .el-table .cell {
    color: #333;
    padding-left: 5px;
    padding-right: 5px;
  }
  .jz-print-foot{
    margin-top: 40px;
    line-height: 30px;
    display: flex;
    justify-content: flex-end;
  }
  .jz-print-foot span:nth-child(2n){
    display: block;
    width: 100px;
    height: 30px;
    border-bottom: 1px solid #333;
    margin-right: 20px;
    margin-top: -6px;
  }
  .jz-print-foot span:nth-child(6){
    margin-right: 100px;
  }
  .jz-print-foot span:last-child{
    margin-right: 0;
  }
</style>
