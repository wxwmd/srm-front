<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-date-picker
          v-model="balance.filter.startTime"
          value-format="timestamp"
          type="datetime"
          size="mini"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="balance.filter.entTime"
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
                :data="balance.balanceData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="company" label="公司"/>
        <el-table-column prop="bookBalance" label="账面余额"/>
        <el-table-column prop="subject" label="科目"/>
        <el-table-column prop="lenders" label="借贷方"/>
        <el-table-column prop="date" label="日期"/>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination">
      <el-pagination @size-change="pageSizeChange"
                     @current-change="pageCurrentChange"
                     :page-size="10"
                     layout="total, prev, pager, next, jumper"
                     :total="balance.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: "Balance",
  data(){
    return{
      value1:[],
      // tableUtil: {}
      balance:{
        balanceData:[],
        total:0,
        filter:{
          page:1,
          limit:10
        }
      }
    }
  },
  created () {
    this.initBalance()
  },
  methods:{
    pageSizeChange (limit) {
      this.balance.filter.limit = limit;
      this.initBalance()
    },
    pageCurrentChange (page) {
      this.balance.filter.page = page;
      this.initBalance()
    },
    doSearch(){
      if (this.balance.filter.startTime != undefined && this.balance.filter.entTime == undefined) {
        this.$message.error('请输入结束时间')
      } else if (this.balance.filter.startTime == undefined && this.balance.filter.entTime != undefined) {
        this.$message.error('请输入开始时间')
      } else if (this.balance.filter.startTime != undefined && this.balance.filter.entTime != undefined) {
        if (this.balance.filter.entTime < this.balance.filter.startTime){
          this.$message.error('结束时间不能小于开始时间')
        } else {
          this.balance.filter.startTime = formatDateTime(this.balance.filter.startTime)
          this.balance.filter.entTime = formatDateTime(this.balance.filter.entTime)
          this.initBalance()
          this.balance.filter.startTime = new Date(this.balance.filter.startTime)
          this.balance.filter.entTime = new Date(this.balance.filter.entTime)
        }
      } else {
        this.initBalance()
      }
    },
    initBalance(){
      this.$api.supplier.procurement.finance.balance.getAll(this.balance.filter).then(res => {
        if (res.code === 200){
          this.balance.balanceData = res.data.records
          this.balance.total = res.data.total
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    exportData(){
      let currentApi = ''
      let data = {}
      currentApi = this.$api.supplier.procurement.finance.balance.export
      this.balance.filter.startTime = formatDateTime(this.balance.filter.startTime)
      this.balance.filter.entTime = formatDateTime(this.balance.filter.entTime)
      data = this.balance.filter
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
      this.balance.filter.startTime = new Date(this.balance.filter.startTime)
      this.balance.filter.entTime = new Date(this.balance.filter.entTime)
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
