<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input size="mini" class="jz-input" style="width: 200px" clearable v-model="tableUtil.filter.title" placeholder="标题"/>
        <el-input size="mini" class="jz-input" style="width: 200px" clearable v-model="tableUtil.filter.createUser" placeholder="创建人"/>
        <el-select size="mini" filterable :filter-method="selectValue" style="width: 200px" clearable v-model="tableUtil.filter.type" placeholder="类型">
          <el-option
            v-for="(item,index) in typeList"
            :key="index"
            :label="item.type"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select size="mini" style="width: 150px" clearable v-model="tableUtil.filter.status" placeholder="状态">
          <el-option label="暂存" :value="0"></el-option>
          <el-option label="发布" :value="1"></el-option>
        </el-select>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
      </div>
      <div class="jz-toolbar-margin">
        <el-button size="mini" type="primary" plain @click="add()">添加</el-button>
        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>
        <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>
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
            <router-link :to="'/news/management/' + scppe.row.id">
              <span style="color: #337ab7;">{{ scppe.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="180">
          <template slot-scope="scope">
            {{scope.row.type === 1 ? "企业新闻" : (scope.row.type === 2 ? "企业公告" : "行业动态")}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{scope.row.status === 0 ? "暂存" : (scope.row.status === 1 ? "发布" : "")}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="180"/>
        <el-table-column prop="createUser" label="创建人" width="200"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="top(scope.row)">{{ topContent(scope.row) }}</el-button>
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
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import {formatDateTime} from "@/assets/management/js/Utils";
import Message from "element-ui/packages/message";
export default {
  name: "Management",
  data() {
    return {
      typeList:[{
        id:1,
        type:'企业新闻'
      },{
        id:2,
        type:'企业公告'
      },{
        id:3,
        type:'行业动态'
      }],
      typeListCopy:[{
        id:1,
        type:'企业新闻'
      },{
        id:2,
        type:'企业公告'
      },{
        id:3,
        type:'行业动态'
      }],
      value:'',
      tableUtil: {}
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.news, {}, '新闻');
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    selectValue(val){
      this.value = val;
      if (val) { //val存在
        this.typeList = this.typeListCopy.filter((item) => {
          if (!!~item.type.indexOf(val) || !!~item.type.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else { //val为空时，还原数组
        this.typeList = this.typeListCopy;
      }
    },
    doSearch(){
      this.tableUtil.initTable()
    },
    add() {
      this.$router.push({path: '/news/management/issue'});
    },
    update() {
      if (this.tableUtil.table.currentRow) {
        if (this.tableUtil.table.currentRow.status === 1){
          Message.error('已发布的文章不能修改！');
        } else {
          this.$router.push({path: '/news/management/issue',query:{id:this.tableUtil.table.currentRow.id}});
        }
      } else {
        Message.error('请先选择一条记录！');
        return
      }
    },
    remove() {
      this.tableUtil.remove()
    },
    // 格式化创建时间
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    // 置顶
    top(data) {
      if(data.sort === 0 || data.sort === undefined){
        this.$api.supplier.news.getTop({id:data.id}).then(res => {
          if (res.code === 200){
            this.tableUtil.initTable()
          } else {
            this.$message.error(res.code + ':' + res.msg)
          }
        })
      } else {
        this.$api.supplier.news.getTop({id:data.id,sort:0}).then(res => {
          if (res.code === 200){
            this.tableUtil.initTable()
          } else {
            this.$message.error(res.code + ':' + res.msg)
          }
        })
      }
    },
    topContent(data) {
      return data.sort === 0  ? '置顶' : '取消置顶'
    },
  }
}
</script>

<style scoped>

</style>
