<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-select size="mini" filterable :filter-method="selectValue" v-model="model.loadingWay" placeholder="请选择装运方式">
          <el-option
            v-for="(item,index) in loadingWayList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
        </el-select>
        <el-date-picker
          size="mini"
          value-format="yyyy-MM-dd"
          v-model="model.loadingDate"
          type="date"
          placeholder="装运日期">
        </el-date-picker>
        <el-date-picker
          size="mini"
          value-format="yyyy-MM-dd"
          v-model="model.planDeliveryDate"
          type="date"
          placeholder="到货日期">
        </el-date-picker>
        <el-input class="jz-input" size="mini" clearable v-model="model.licensePlateNumber" placeholder="车牌号"/>
        <el-input class="jz-input" size="mini" clearable v-model="model.logisticsContactInformation" placeholder="联系方式"/>
        <el-input class="jz-input" size="mini" clearable v-model="model.procurementUnit" placeholder="采购单位"/>
        <el-input class="jz-input" size="mini" clearable v-model="model.procurementUnitAddress" placeholder="采购单位地址"/>
        <el-input class="jz-input" size="mini" clearable v-model="model.receivingWindow" placeholder="收货窗口"/>
<!--        <el-input class="jz-input" size="mini" clearable v-model="model.documentName" placeholder="文件名称"/>-->
<!--        <el-upload-->
<!--          :action="uploadUrl"-->
<!--          :headers="headers"-->
<!--          :show-file-list="false"-->
<!--          :limit="1"-->
<!--          :on-success="uploadSuccess">-->
<!--          <el-button size="small" type="primary">{{model.documentUrl !== '' ? (model.documentName + suffix) : '点击上传质量报告'}}</el-button>-->
<!--        </el-upload>-->
      </div>
      <div>
        <el-button type="primary" plain @click="save">提交</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="model.loadingRecords"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="remove(scope.row)" style="margin-right: 10px">撤销</el-button>
            <el-upload
              :action="uploadUrl"
              :headers="headers"
              :show-file-list="false"
              :limit="1"
              :on-success="uploadSuccess">
              <el-button size="small" type="primary" style="width: 130px" @click="clickUpload(scope.row)">{{scope.row.documentUrl !== null ? '上传成功' : '点击上传质量报告'}}</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column prop="materialNumber" label="物料号" width="100"/>
        <el-table-column prop="materialDescription" label="物料描述" width="150"/>
        <el-table-column prop="purchaseOrder" label="采购订单号" width="100"/>
        <el-table-column prop="lineItem" label="行项目"/>
        <el-table-column prop="type" label="类别"/>
        <el-table-column prop="factory" label="工厂" width="100"/>
        <el-table-column prop="createDate" label="创建日期" width="100"/>
        <el-table-column prop="deliveryDate" label="交货日期" width="100"/>
        <el-table-column prop="loadingShipmentDate" label="装车发运日期" width="100"/>
        <el-table-column prop="orderNumber" label="订单数量"/>
        <el-table-column prop="receivingNumber" label="收货数量"/>
        <el-table-column prop="inventoryMatching" label="库存匹配"/>
        <el-table-column label="装车数量" width="100">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.loadingShipmentNumber"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remainingQuantity" label="剩余数量"/>
        <el-table-column label="剩余承诺到货日期" width="160">
          <template slot-scope="scope">
            <el-date-picker
              size="mini"
              v-model="scope.row.remainingDate"
              type="date"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="60"/>
        <el-table-column prop="storageLocation" label="库位"/>
        <el-table-column prop="proposer" label="申请人"/>
        <el-table-column prop="shippingSpace" label="仓位"/>
        <el-table-column prop="versionNumber" label="版本号"/>
        <el-table-column prop="dimensionSize" label="大小量纲"/>
        <el-table-column prop="purchaseGroup" label="采购组"/>
        <el-table-column prop="supplierMaterial" label="供应商物料号" width="100"/>
        <el-table-column prop="purchasePerson" label="采购员"/>
        <el-table-column prop="contactInformation" label="联系方式" width="110"/>
        <el-table-column prop="companyAddress" label="公司地址" width="150"/>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Assembly",
  data(){
    return{
      selects:[],
      loadingWayList:[],
      loadingWayListCopy:[],
      value:'',
      uploadUrl: '',
      headers: {
        credential: localStorage.getItem('jaezi-credential')
      },
      // suffix:'',
      model:{
        loadingWay:'', //装车方式
        loadingDate:'', //装车日期
        planDeliveryDate:'', //到货日期
        logisticsContactInformation:'', //联系方式
        licensePlateNumber:'',//车牌号
        loadingRecords:[],
        receivingWindow:'', //收货窗口
        procurementUnit:'',  //采购单位
        procurementUnitAddress:''  //采购单位地址
        // documentName:'',
        // documentUrl:''
      },
      clickData:{}
    }
  },
  created () {
    this.uploadUrl = this.$api.supplier.procurement.infoMaintenance.shipping.upload
    this.selects = this.$route.query.selectList
    this.initData()
    // 字典值
    this.$api.supplier.system.dict('loadingWay').then(res => {
      if (res.code === 200){
        this.loadingWayList = res.data
        this.loadingWayListCopy = res.data
      }
    })
  },
  methods:{
    selectValue(val){
      this.value = val;
      if (val) { //val存在
        this.loadingWayList = this.loadingWayListCopy.filter((item) => {
          if (!!~item.dictLabel.indexOf(val) || !!~item.dictLabel.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else { //val为空时，还原数组
        this.loadingWayList = this.loadingWayListCopy;
      }
    },
    // 通过选中的id查询订单
    initData(){
      if (this.selects.length !== 0){
        let params = {id:this.selects}
        const ids= params.id.map(_=>`purchaseId=${_}`).join('&');
        this.$api.supplier.procurement.infoMaintenance.shippingOrder.getData(ids).then(res => {
          if (res.code === 200){
            this.model.loadingRecords = res.data.records
          } else {
            this.$message.error(res.code + ':' + res.msg)
          }
        })
      } else {
        this.$router.push('/procurement/infoMaintenance/shippingOrder')
      }
    },
    //从选中列表中删除不需要装车的订单
    remove(data){
      let index = this.selects.indexOf(data.purchaseId)
      this.selects.splice(index,1);
      this.initData()
    },
    clickUpload(row){
      this.clickData = row
    },
    uploadSuccess (res) {
      this.clickData.documentUrl = res.data.url
      let s = res.data.fileName.lastIndexOf('.')
      this.clickData.documentName = res.data.fileName.substring(0,s)
    },
    //装车
    save(){
      if (this.model.loadingWay === ''){
        this.$message.error('装车方式不能为空')
      } else if (this.model.loadingDate === ''){
        this.$message.error('装运日期不能为空')
      } else if (this.model.planDeliveryDate === ''){
        this.$message.error('到货日期不能为空')
      } else if (this.model.licensePlateNumber === ''){
        this.$message.error('车牌号不能为空')
      } else if (this.model.logisticsContactInformation === ''){
        this.$message.error('联系方式不能为空')
      } else if (this.model.procurementUnit === ''){
        this.$message.error('采购单位不能为空')
      } else if (this.model.procurementUnitAddress === ''){
        this.$message.error('采购单位地址不能为空')
      } else if (this.model.receivingWindow === ''){
        this.$message.error('收货窗口不能为空')
      } else {
        let isSave = true
        //判断每一个订单的装车数量
        for (let i = 0; i < this.model.loadingRecords.length; i++) {
          if(this.model.loadingRecords[i].loadingShipmentNumber <= 0 || this.model.loadingRecords[i].loadingShipmentNumber > this.model.loadingRecords[i].remainingQuantity){
            this.$message.error('所有的装车数量必须大于0且装车数量不能大于剩余数量')
            break;
          } else if(this.model.loadingRecords[i].documentUrl === null){
            this.$message.error('所有的采购订单的质量报告都必须上传')
            break;
          } else {
            isSave = false
          }
        }
        //如果都满足要求，就装车
        if (isSave === false){
          //计算剩余数量
          this.model.loadingRecords.forEach(item => {
            item.remainingQuantity = item.remainingQuantity - item.loadingShipmentNumber
          })
          this.$api.supplier.procurement.infoMaintenance.shipping.addShipping(this.model).then(res => {
            if (res.code === 200){
              this.$message.success('装车信息填写成功')
              this.$router.push({path: '/procurement/infoMaintenance/shipping'});
            } else {
              this.$message.error(res.code + ':' + res.msg)
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .jz-module-toolbar{
    align-items: flex-start;
  }
  .jz-module-toolbar>div:first-child{
    width: 90%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-right: 10px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
  /deep/ .cell .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 200px;
    height: 28px;
  }
  /deep/ .el-select{
    height: 28px;
  }
  /deep/ .el-select > .el-input{
    width: 200px;
  }
  /deep/ .el-table .cell{
    display: flex;
    justify-content: center;
  }
</style>
