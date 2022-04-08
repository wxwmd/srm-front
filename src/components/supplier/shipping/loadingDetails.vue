<template>
  <div class="jz-form">
    <el-dialog title="装车单详情" :visible.sync="details.isDetails" width="1600px">
      <div class="jz-shipping-details" id="jz-shipping-details">
        <table>
          <tr>
            <td colspan="2"></td>
            <td colspan="4" style="font-size: 16px;font-weight: bold">主机厂有限公司</td>
            <td colspan="2">
              <svg id="barcode"></svg>
            </td>
          </tr>
<!--          <tr>-->
<!--            <td colspan="2"></td>-->
<!--            <td colspan="2" style="font-weight: bold">物资承运装车单</td>-->
<!--          </tr>-->
          <tr>
            <td style="font-weight: bold">需求工厂</td>
            <td>{{detailsData.plant}}</td>
            <td style="font-weight: bold" colspan="2">产线</td>
            <td colspan="2">{{detailsData.loadingNumber}}</td>
            <td style="font-weight: bold">装车单号</td>
            <td>{{detailsData.loadingNumber}}</td>
          </tr>
          <tr>
            <td style="font-weight: bold">库位</td>
            <td>{{detailsData.location}}</td>
            <td style="font-weight: bold">需求信息发布人</td>
            <td>{{detailsData.needInformationPublisher}}</td>
            <td style="font-weight: bold">联系电话</td>
            <td>{{detailsData.needInformationPublisherPhone}}</td>
            <td style="font-weight: bold">发布日期</td>
            <td>{{detailsData.createDate}}</td>
          </tr>
          <tr>
            <td style="font-weight: bold">供应商名称</td>
            <td>{{detailsData.supplierName}}</td>
            <td style="font-weight: bold">供应商代码</td>
            <td>{{detailsData.supplierCode}}</td>
            <td style="font-weight: bold">供应部联系人</td>
            <td>{{detailsData.supplyDepartmentContactPerson}}</td>
            <td style="font-weight: bold">到货日期</td>
            <td>{{detailsData.arrivalDate}}</td>
          </tr>
          <tr>
            <td style="font-weight: bold">收货窗口</td>
            <td>{{detailsData.onlineServiceTime}}</td>
            <td style="font-weight: bold">车牌号</td>
            <td>{{detailsData.licensePlateNumber}}</td>
            <td style="font-weight: bold">联系电话</td>
            <td>{{detailsData.phone}}</td>
            <td style="font-weight: bold">上线使用时间</td>
            <td>{{detailsData.onlineServiceTime}}</td>
          </tr>
          <tr style="height: auto;">
            <td colspan="8">
              <el-table highlight-current-row
                        border
                        size="mini"
                        :data="tableData"
                        style="width:100%">
                <el-table-column type="index" label="序号" width="50"/>
                <el-table-column prop="productionOrder" label="生产订单"/>
                <el-table-column prop="turner" label="车工号"/>
                <el-table-column prop="workCenter" label="工作中心"/>
                <el-table-column prop="materialNumber" label="物料"/>
                <el-table-column prop="materialDescription" label="物料描述"/>
                <el-table-column prop="planQty" label="计划数量" width="90"/>
                <el-table-column prop="actualQty" label="实收数量" width="90"/>
                <el-table-column prop="unit" label="单位" width="50"/>
                <el-table-column prop="station" label="工位"/>
                <el-table-column prop="keyMaterials" label="关键物资"/>
                <el-table-column prop="numberImmediately" label="报号机号"/>
                <el-table-column prop="assemblyMaterial" label="总成物料"/>
                <el-table-column prop="remark" label="备注（关键物资条形码粘贴处）" width="220"/>
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
  name: "LoadingDetails",
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
    this.getDetailList()
  },
  methods: {
    getData(){
      this.$api.supplier.procurement.loading.getDetail(this.details.id).then(res => {
        if (res.code === 200){
          this.detailsData = res.data
          this.$nextTick(() => {
            this.barcode()
          })
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    getDetailList(){
      this.$api.supplier.procurement.loading.getDetailList({rid:this.details.id}).then(res => {
        if (res.code === 200){
          this.tableData = res.data.records
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
  .jz-print-foot span{
    font-size: 12px;
  }
  .jz-print-foot span:nth-child(2n){
    display: block;
    width: 65px;
    height: 30px;
    border-bottom: 1px solid #333;
    margin-right: 20px;
    margin-top: -6px;
  }
  /*.jz-print-foot span:nth-child(6){*/
  /*  margin-right: 100px;*/
  /*}*/
  .jz-print-foot span:last-child{
    margin-right: 0;
  }
</style>
