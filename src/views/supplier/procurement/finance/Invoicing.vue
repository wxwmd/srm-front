<!--标准物资开票管理界面-->

<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.plant" placeholder="工厂"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.purchaseOrder" placeholder="采购订单号"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="type === 1">
        <el-button type="primary" plain @click="exportData()">导出</el-button>
        <el-button type="primary" plain @click="combined()">开票</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <div class="jz-attention" v-if="type === 1">
        <p>*供应商选取要开票的采购订单行，点击开票，录入不含税金额、税额、价税合计，提交之后完成开票</p>
        <p>*冻结数目不为0的项目无法开票</p>
      </div>
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                ref="multipleTable"
                :row-key="getRowId"
                style="width:100%"
                :cell-style="cellStyle"
                @row-click="clickData">
<!--        <el-table-column v-if="type === 1" type="selection" :reserve-selection="true" width="55"/>-->
        <el-table-column :selectable="checkFreezeNum"  type="selection" :reserve-selection="true" width="55"></el-table-column>
<!--        <el-table-column type="index" width="50"/>-->
<!--     <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>-->
        <el-table-column prop="supplierCode" label="供应商编码" width="100"/>
        <el-table-column prop="supplierName" label="供应商名称" width="130"/>
        <el-table-column prop="material" label="物料号" width="100"/>
        <el-table-column prop="materialName" label="物料名称"/>
        <el-table-column prop="purchaseOrder" label="采购订单" width="130"/>
        <el-table-column prop="hongProject" label="行项目"/>
        <el-table-column prop="plant" label="工厂"/>
        <el-table-column prop="materialVoucher" label="物料凭证"/>
        <el-table-column prop="voucherProject" label="凭证项目"/>
        <el-table-column prop="notOutInvoiceNumber" label="未开票数量" width="90"/>
        <el-table-column prop="freezeNumber" label="冻结数量" />
<!--        <el-table-column prop="status" label="状态">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.status === -1 ? "未开票" : (scope.row.status === 0 ? "已开票" : "")}}-->
<!--          </template>-->
<!--        </el-table-column>-->
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
    <invoicing-combined :combinedTicket="combin" v-if="combin.combinedShow"></invoicing-combined>
<!--    <invoicing-split :splitTicket="splitClick" v-if="splitClick.splitShow"></invoicing-split>-->
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import InvoicingCombined from "@/components/supplier/finance/InvoicingCombined";

export default {
  name: "Invoicing",
  components:{InvoicingCombined},
  data() {
    return {
      type:this.$store.state.user.type,
      value1:[],
      tableUtil: {},
      verifyList:[],
      splitList:[],
      splitClick:{
        splitShow:false,
        splitTicket: {},
      },
      combin:{
        combinedShow:false,
        combinedTicket:[]
      }
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.procurement.finance.invoicing, {}, '标准物资开票');
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
    clickData(row, event, column){
      if (row.freezeNumber!==0){
        this.$message.error("冻结数量不为0！请联系管理员")
      }
    },
    // Freezenumber为0才可选
    checkFreezeNum (row, index){
      return row.freezeNumber===0;
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      // 状态列字体颜色
      if (row.freezeNumber!==0&& columnIndex === 11) {
        return 'color: red'
      } else {
        return 'color: #1a1a1b'
      }
    },
    // changeTime(){
    //   if (this.value1 !== null){
    //     if (this.value1.length > 0){
    //       this.tableUtil.filter.startTime = this.value1[0]
    //       this.tableUtil.filter.entTime = this.value1[1]
    //     }
    //   } else {
    //     this.tableUtil.filter.startTime = ''
    //     this.tableUtil.filter.entTime = ''
    //   }
    // },
    getRowId(row){
      return row.id
    },
    //验证
    // verify(){
    //   if (this.$refs.multipleTable.selection.length === 0){
    //     this.$message.error('请选择需要验证的行项目')
    //   } else {
    //     this.verifyList = []
    //     let statusList = []
    //     this.$refs.multipleTable.selection.forEach(order => {
    //       //将需要验证的数据的id取出来
    //       this.verifyList.push({id:order.id})
    //       statusList.push(order.status)
    //     })
    //     let index = false;
    //     //状态为‘未开票’才可以验证
    //     statusList.forEach(status => {
    //       if (status !== -1){
    //         index = true
    //       }
    //     })
    //     if (index === false){
    //       this.$api.supplier.procurement.finance.invoicing.verify(this.verifyList).then(res => {
    //         if (res.code === 200){
    //           this.tableUtil.initTable()
    //           this.$message.success('验证成功')
    //         } else {
    //           this.$message.error(res.code + ':' + res.msg)
    //         }
    //       })
    //     } else {
    //       this.$message.error('请选择状态为”未开票“的行项目验证')
    //     }
    //   }
    // },
    //拆票
    // split(){
    //   if (this.$refs.multipleTable.selection.length === 0){
    //     this.$message.error('请选择需要拆票的行项目')
    //   } else if (this.$refs.multipleTable.selection.length > 1){
    //     this.$message.error('每次只能对一个行项目进行拆票')
    //   } else {
    //     if (this.$refs.multipleTable.selection[0].status === -1){
    //       this.splitClick.splitShow = true
    //       this.splitClick.splitTicket = this.$refs.multipleTable.selection[0]
    //     } else {
    //       this.$message.error('请选择状态为“未开票”的行项目进行拆票')
    //     }
    //   }
    // },
    //合票
    combined(){
      if (this.$refs.multipleTable.selection.length === 0){
        this.$message.error('请选择需要开票的行项目')
      } else {
        this.verifyList = []
        let statusList = []
        this.$refs.multipleTable.selection.forEach(order => {
          //将合票的订单id取出来
          this.verifyList.push({id:order.id})
          statusList.push(order.status)
        })
        let flag = true;
        //状态为‘未开票’才可以合票
        statusList.forEach(status => {
          if (status != -1){
            flag = false
          }
        })
        if (flag){
          this.combin.combinedShow = true
          this.combin.combinedTicket = this.$refs.multipleTable.selection
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message.error('请选择状态为”未开票“的行项目进行开票')
        }
      }
    },
    exportData(){
      this.tableUtil.form.currentApi = this.$api.supplier.procurement.finance.invoicing.export
      this.tableUtil.export()
    },
    // 导入excel文件
    excelImport() {
      this.tableUtil.upload.uploadName = 'file'
      this.tableUtil.module.apis.importApi = this.$api.supplier.procurement.finance.invoicing.import
      this.tableUtil.importCamera()
    },
    // 监听文件上传框
    controlUploadChange(e) {
      this.tableUtil.uploadChange(e)
    },
    templateExport() {
      this.tableUtil.form.currentApi = this.$api.supplier.procurement.finance.invoicing.templateExport
      this.tableUtil.export()
    },
  }
}
</script>

<style scoped>

.jz-upload > a {
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 75px;
  color: #FFF;
  background-color: #409EFF;
  border: none;
  border-radius: 4px;
  display: inline-block;
}

.jz-upload > a > input {
  position: absolute;
  font-size: 20px;
  left: 11px;
  top: 11px;
  width: 75px;
  opacity: 0;
  filter: alpha(opacity=0);
}

.jz-upload > a:hover {
  cursor: pointer;
}

.jz-upload > input {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  width: 215px;
  font-size: 12px;
  border: none;
}

</style>
