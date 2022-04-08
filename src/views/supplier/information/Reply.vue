<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.title" placeholder="信息标题"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.sender" placeholder="发件人"/>
        <el-button type="primary" plain @click="doSearch()">查询</el-button>
        <el-button type="danger" plain @click="remove()">删除</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                @row-click="selectedRow"
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column show-overflow-tooltip prop="title" label="标题">
          <template slot-scope="scppe">
            <router-link :to="'/information/' + scppe.row.id">
              <span style="color: #337ab7;">{{ scppe.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" :formatter="formatInfoType" label="类型" width="100px"/>
        <el-table-column prop="sender" label="发件人" width="200px"/>
        <el-table-column prop="recipient" label="收件人" width="200px"/>
        <el-table-column prop="senderReadStatus" :formatter="formatReadStatus" label="发件人状态" width="90px"/>
        <el-table-column prop="recipientReadStatus" :formatter="formatReadStatus" label="收件人状态" width="90px"/>
        <el-table-column prop="createTime" :formatter="formatTime" label="时间" width="150px"/>
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
import {formatDateTime} from "@/assets/management/js/Utils";

export default {
  name: 'Reply',
  data() {
    return {
      tableUtil: {},
      model: {},
      readStatus: [],
      infoType: []
    }
  },
  created() {
    this.getDict("readStatus");
    this.getDict("infoType");
    this.tableUtil = new TableUtil(this.$api.supplier.information, {}, '查询信息', false);
    this.tableUtil.filter.infoStateType = '1';
    this.tableUtil.filter.type = '1';
    this.tableUtil.initTable();
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    doSearch() {
      this.tableUtil.filter.type = '1';
      this.tableUtil.filter.infoStateType = '1';
      this.tableUtil.initTable()
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    formatReadStatus(row, column, cellValue) {
      let dictLabel = "";
      this.readStatus.forEach(function (v) {
        if (cellValue === parseInt(v.dictValue)) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    },
    formatInfoType(row, column, cellValue) {
      let dictLabel = "";
      this.infoType.forEach(function (v) {
        if (cellValue === parseInt(v.dictValue)) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    },
    getDict(ditType) {
      this.$api.supplier.system.dict(ditType).then(res => {
        if (res.code === 200) {
          if (ditType == "readStatus") {
            this.readStatus = res.data;
          } else if (ditType == "infoType") {
            this.infoType = res.data.filter(function (value) {
              return parseInt(value.dictValue) === 1;
            })
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    remove() {
      this.tableUtil.remove();
    }
  }
}
</script>

<style scoped>
/deep/ .el-table .cell {
  overflow: hidden;
  white-space: nowrap;
}
</style>
