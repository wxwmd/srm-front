<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-attention" v-if="type === 1">
      <p>*选择开票区间后点击查询，得到开票区间范围内的寄售物资</p>
      <p>*核对金额无误后，点击开票进行开票管理</p>
    </div>
    <div class="jz-module-toolbar">
      <div>
<!--        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>-->

        <el-date-picker
          v-model="tableUtil.filter.startTime"
          value-format="yyyy-MM-dd"
          type="date"
          size="mini"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="tableUtil.filter.endTime"
          value-format="yyyy-MM-dd"
          type="date"
          size="mini"
          placeholder="结束日期">
        </el-date-picker>
<!--        <el-select size="mini" filterable v-model="tableUtil.filter.invoiceGroup" clearable placeholder="请选择发票组">-->
<!--          <el-option-->
<!--            v-for="(item,index) in IntervalList"-->
<!--            :key="index"-->
<!--            :label="item"-->
<!--            :value="item">-->
<!--          </el-option>-->
<!--        </el-select>-->
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.plant" placeholder="工厂"/>
      </div>
      <div>
        <button class="jz-btn" @click="doSearch()" style="margin-right: 10px">查询</button>
        <el-button type="primary" plain @click="exportData()" v-if="type === 1">导出</el-button>
<!--        <el-button v-if="show && type === 1" type="primary" plain @click="split()">拆票</el-button>-->
<!--        <el-button v-if="show && type === 1" type="primary" plain @click="combined()">开票</el-button>-->
        <el-button type="primary" v-if="type === 1" plain @click="combined()">开票</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <div class="jz-invoice" v-if="show">
<!--        <span>开票区间：</span>-->
<!--        <span>{{tableUtil.filter.outInvoicePeriod}}</span>-->
        <span>不含税金额：</span>
        <span>{{resultList[0]}}</span>
        <span>税额：</span>
        <span>{{resultList[1]}}</span>
        <span>税价合计：</span>
        <span>{{resultList[2]}}</span>
      </div>
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData.slice(10*tableUtil.filter.page-10,10*tableUtil.filter.page)"
                ref="multipleTable"
                style="width:100%">
        <el-table-column v-if="selectShow && type === 1" type="selection" width="55"/>
        <el-table-column type="index" width="50"/>
        <el-table-column prop="supplierCode" label="供应商编码" width="250"/>
        <el-table-column prop="supplierName" label="供应商名称" width="350"/>
        <el-table-column prop="materialNumber" label="物料号" width="250"/>
        <el-table-column prop="materialName" label="物料名称" width="250"/>
        <el-table-column prop="plant" label="工厂" width="150"/>
        <el-table-column prop="outInvoicePeriod" label="开票期间" width="200"/>
        <el-table-column prop="quantity" label="数量"/>
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
    <consignment-split v-if="splitTicket.isSplit" :splitTicket="splitTicket" @getIsSplit = "getSplit($event)"></consignment-split>
    <consignment-combined v-if="combinedTicket.isCombined" :combinedTicket="combinedTicket" @getIsCombined = "getCombined($event)"></consignment-combined>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import ConsignmentSplit from '@/components/supplier/finance/consignmentSplit'
import ConsignmentCombined from '@/components/supplier/finance/consignmentCombined'

export default {
  name: "ConsignmentInvoicing",
  components:{ConsignmentSplit,ConsignmentCombined},
  data() {
    return {
      type:this.$store.state.user.type,
      tableUtil: {
        // filter:{
        //   limit: 10,
        //   page: 1
        // },
        filter:{
          limit:10,
          page:1
        },
        table: {
          tableData: [],
          total: 0,
        }
      },
      IntervalList: [],
      resultList:[],
      show:false,
      selectShow:false,
      combinedTicket:{
        isCombined:false,
        combinedList:[]
      },
      splitTicket:{
        isSplit:false,
        splitList:[]
      },
      util:{}
    }
  },
  created() {
    this.util = new TableUtil(this.$api.supplier.procurement.finance.consignmentInvoicing, {}, '寄售物资开票');
    // 界面刚加载不显示一堆记录
    //this.initTable()
    this.getOutInvoicePeriod()
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.filter.limit = limit;
      //this.initTable()
    },
    pageCurrentChange(page) {
      this.tableUtil.filter.page = page;
      //this.initTable()
    },
    doSearch() {
      if (this.tableUtil.filter.startTime==null || this.tableUtil.filter.endTime==null){
        this.$message.error('请选择开票区间')
      } else {
        if (this.tableUtil.filter.invoiceGroup !== '' && this.tableUtil.filter.invoiceGroup !== undefined){
          this.show = true
        }
        this.tableUtil.filter.status = -1
        this.initTable()
      }
    },
    initTable() {
      // 初始化表
      this.$api.supplier.procurement.finance.consignmentInvoicing.getAll(this.tableUtil.filter).then(res => {
        if (res.code === 200) {
          this.tableUtil.table.tableData = res.data.consignmentSalesInvoiceOuts
          this.tableUtil.table.total = res.data.consignmentSalesInvoiceOuts.length
          if (res.data.resultList !== undefined && res.data.resultList !== null){
            if (res.data.resultList.length > 0){
              this.resultList = res.data.resultList
              // if (this.resultList[0] > this.$store.state.user.quota){
              //
              //   this.$alert('不含税总金额大于限额，请分开进行开票', '', {
              //     confirmButtonText: '确定',
              //     callback: () => {
              //       this.selectShow = true
              //     }
              //   });
              // } else
              if (this.resultList[0] === 0) {
                this.selectShow = false
                this.$message.success('开票成功，此区间没有可以开票的订单，请重新选择开票区间')
              } else {
                this.selectShow = false
                this.show=true

                if (this.type===1){
                  this.$message.success('查询成功，请核对金额后进行开票')
                } else {
                  this.$message.success('查询成功')
                }
              }
            }
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    getOutInvoicePeriod() {
      this.$api.supplier.procurement.finance.consignmentInvoicing.getOutInvoicePeriod().then(res => {
        if (res.code === 200) {
          this.IntervalList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    getSplit(data){
      this.splitTicket.isSplit = data.isSplit
    },
    getCombined(data){
      this.combinedTicket.isCombined = data
    },
    // split(){
    //   if (this.$refs.multipleTable.selection.length === 0){
    //     this.$message.error('请选择需要拆票的行项目')
    //   } else if (this.$refs.multipleTable.selection.length > 1){
    //     this.$message.error('每次只能对一个行项目进行拆票')
    //   } else {
    //     if (this.$refs.multipleTable.selection[0].status === -1){
    //       this.splitTicket.isSplit = true
    //       this.splitTicket.splitList = this.$refs.multipleTable.selection
    //     } else {
    //       this.$message.error('请选择状态为“未开票”的行项目进行拆票')
    //     }
    //   }
    // },
    combined(){
      if (this.tableUtil.table.tableData.length===0){
        this.$message.error('没有可以开票的行')
      }
      else if (this.tableUtil.filter.startTime==null || this.tableUtil.filter.endTime==null){
        this.$message.error('请选择开票区间')
      }
      else if (this.selectShow === false){
        this.combinedTicket.isCombined = true
        this.combinedTicket.combinedList = this.tableUtil.table.tableData
      }
      else {
        if (this.$refs.multipleTable.selection.length === 0){
          this.$message.error('请选择需要开票的行')
        } else {
          this.combinedTicket.isCombined = true
          this.combinedTicket.combinedList = this.$refs.multipleTable.selection
        }
      }
    },
    exportData(){
      this.util.form.currentApi = this.$api.supplier.procurement.finance.consignmentInvoicing.export
      this.util.export()
    }
  }
}
</script>

<style scoped>
  .jz-module-toolbar{
    display: flex;
    align-items: flex-start;
  }
  .jz-module-toolbar>div:first-child{
    width: 70%;
  }
  .jz-invoice{
    line-height: 50px;
  }
  .jz-invoice span:nth-child(2n){
    margin-right: 20px;
  }
  /deep/ .el-select{
    width: 210px;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-right: 10px;
    width: 200px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
</style>
