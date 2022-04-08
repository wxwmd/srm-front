<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>字典管理</span>
      <span>/</span>
      <span>Dict Management</span>
    </div>
    <!--  Toolbar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.dictName" placeholder="字典名称"/>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.dictType" placeholder="字典类型"/>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
<!--        <el-button size="mini" type="primary" plain @click="add()">添加</el-button>-->
<!--        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>-->
<!--        <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>-->
        <el-button size="mini" type="refresh" plain @click="refreshDict()">刷新缓存</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table-admin">
      <el-table highlight-current-row
                @row-click="selectedRow"
                size="mini"
                border
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%;">
        <el-table-column type="index" width="50" align="center"/>
        <el-table-column label="字典编号" prop="dictId"/>
        <el-table-column label="字典名称" prop="dictName" :show-overflow-tooltip="true"/>
        <el-table-column label="字典类型" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <router-link :to="'/admin/dictData' + scope.row.dictType">
              <span style="color: #337ab7;">{{ scope.row.dictType }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" :formatter="formatterDict" prop="status">
        </el-table-column>
        <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"/>
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
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close
                 width="800px">
        <el-form class="jz-form-body" :model="tableUtil.module.model" :rules="rules" ref="form"
                 label-width="80px">
          <el-form-item label="字典名称" prop="dictName">
            <el-input class="jz-input" v-model="tableUtil.module.model.dictName"/>
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input class="jz-input" v-model="tableUtil.module.model.dictType"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="tableUtil.module.model.status">
              <el-radio
                  v-for="dict in dictStatusList"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
              >{{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="jz-input" type="textarea" placeholder="请输入内容" v-model="tableUtil.module.model.remark"/>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
import TableUtil from "@/assets/supplier/js/TableUtil";
import Message from 'element-ui/packages/message'

export default {
  name: 'Material',
  data() {
    return {
      tableUtil: {},
      model: {},
      dictStatusList: [],
      rules: {
        dictName: [
          {required: true, message: "字典名称不能为空", trigger: "blur"}
        ],
        dictType: [
          {required: true, message: "字典类型不能为空", trigger: "blur"}
        ]
      }
    }
  },
  created() {
    this.getDict()
    this.tableUtil = new TableUtil(this.$api.management.system.dictType, {}, '字典')
  },
  methods: {
    selectedRow(row) {
      row.id = row.dictId;
      this.tableUtil.selectedRow(row)
    },
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
    add() {
      this.tableUtil.add();
    },
    update() {
      this.tableUtil.update();
    },
    remove() {
      this.tableUtil.remove();
    },
    save(formName) {
      if (!this.tableUtil.table.isAdd) {
        this.tableUtil.save();
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save()
        }
      })
    },
    getDict() {
      this.$api.supplier.system.dict("dictStatus").then(res => {
        if (res.code === 200) {
          this.dictStatusList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    formatterDict(row, column, cellValue) {
      let dictLabel = "";
      this.dictStatusList.forEach(function (v) {
        if (cellValue === v.dictValue) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    },
    refreshDict() {
      this.$api.management.system.dictType.refreshCache().then(res => {
        if (res.code == 200) {
          Message.success('刷新成功');
        }
      })
    },
    beforeClose(done) {
      this.cleanVerifyMessage()
      done()
    },
    // 清空表单验证信息
    cleanVerifyMessage() {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    }
  }
}
</script>

<style scoped>

.jz-input {
  width: 200px;
  margin-right: 10px;
}

</style>
