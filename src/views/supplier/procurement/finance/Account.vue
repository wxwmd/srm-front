<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-date-picker
          v-model="account.filter.startTime"
          value-format="timestamp"
          type="datetime"
          size="mini"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="account.filter.entTime"
          value-format="timestamp"
          type="datetime"
          size="mini"
          placeholder="结束日期">
        </el-date-picker>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div class="jz-toolbar-margin1">
        <el-button type="primary" plain @click="exportData()">导出</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="account.accountData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="company" label="公司"/>
        <el-table-column prop="voucherNumber" label="凭证号"/>
        <el-table-column prop="digest" label="摘要"/>
        <el-table-column prop="debitDomestic" label="借方" width="120"/>
        <el-table-column prop="creditDomestic" label="贷方" width="120"/>
        <el-table-column prop="balanceDomestic" label="余额" width="120"/>
        <el-table-column prop="direction" label="方向"/>
        <el-table-column prop="date" label="日期" width="150"/>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination">
      <el-pagination @size-change="pageAccountSizeChange"
                     @current-change="pageAccountCurrentChange"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="account.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: "Account",
  data(){
    return{
      value1:[],
      account:{
        accountData:[],
        total:0,
        filter:{
          page:1,
          limit:10
        }
      }
    }
  },
  created () {
    this.initAccount()
  },
  methods:{
    pageAccountSizeChange (limit) {
      this.account.filter.limit = limit;
      this.initAccount()
    },
    pageAccountCurrentChange (page) {
      this.account.filter.page = page;
      this.initAccount()
    },
    doSearch(){
      if (this.account.filter.startTime != undefined && this.account.filter.entTime == undefined) {
        this.$message.error('请输入结束时间')
      } else if (this.account.filter.startTime == undefined && this.account.filter.entTime != undefined) {
        this.$message.error('请输入开始时间')
      } else if (this.account.filter.startTime != undefined && this.account.filter.entTime != undefined) {
        if (this.account.filter.entTime < this.account.filter.startTime){
          this.$message.error('结束时间不能小于开始时间')
        } else {
          this.account.filter.startTime = formatDateTime(this.account.filter.startTime)
          this.account.filter.entTime = formatDateTime(this.account.filter.entTime)
          this.initAccount()
          this.account.filter.startTime = new Date(this.account.filter.startTime)
          this.account.filter.entTime = new Date(this.account.filter.entTime)
        }
      } else {
        this.initAccount()
      }
    },
    initAccount(){
      this.$api.supplier.procurement.finance.account.getAll(this.account.filter).then(res => {
        if (res.code === 200){
          this.account.accountData = res.data.records
          this.account.total = res.data.total
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    exportData(){
      let currentApi = ''
      let data = {}
      currentApi = this.$api.supplier.procurement.finance.account.export
      this.account.filter.startTime = formatDateTime(this.account.filter.startTime)
      this.account.filter.entTime = formatDateTime(this.account.filter.entTime)
      data = this.account.filter
      currentApi("blob",data).then(res => {
        if(res.data.size > 0) {
          if (res.data.type) {
            // 文件下载
            const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            let contentDisposition = res.headers['content-disposition'];
            let fileName = ''
            if (contentDisposition) {
              fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], "UTF-8");
            }
            link.setAttribute('download', fileName);
            link.click();
            link = null;
            this.$message.success('导出成功');
          } else {
            this.$message.warning(res.data.msg);
          }
        } else {
          this.$message.success("数据为空,无法导出");
        }
      })
      this.account.filter.startTime = new Date(this.account.filter.startTime)
      this.account.filter.entTime = new Date(this.account.filter.entTime)
    }
  }
}
</script>

<style scoped>
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    margin-right: 10px;
  }
  /deep/ .el-input__prefix {
    height: 28px;
    line-height: 28px;
  }
</style>
