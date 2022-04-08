<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>登录日志</span>
      <span>/</span>
      <span>Login Log</span>
    </div>
    <!--  Toolbar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.username" placeholder="用户名称"/>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table-admin">
      <el-table highlight-current-row
                size="mini"
                border
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%;">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="username" label="用户名称"/>
        <el-table-column prop="loginType" label="登录类型"/>
        <el-table-column prop="ip" label="登录IP"/>
        <el-table-column prop="browserName" label="浏览器名称"/>
        <el-table-column prop="browserVersion" label="浏览器版本"/>
        <el-table-column prop="deviceType" label="设备类型"/>
        <el-table-column prop="deviceOs" label="设备系统"/>
        <el-table-column prop="osName" label="系统名称"/>
        <el-table-column prop="osVersion" label="系统版本"/>
        <el-table-column prop="result" label="登陆结果"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"/>
      </el-table>
    </div>
    <!--  Pagination  -->
    <div class="jz-module-pagination-admin">
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
import TableUtil from "@/assets/supplier/js/TableUtil";
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: "LoginLog",
  data() {
    return {
      tableUtil: {},
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.management.system.loginLog, {}, '登录日志')
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
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
  }
}
</script>

<style scoped>
  .jz-input {
    width: 200px;
    margin-right: 10px;
  }
</style>
