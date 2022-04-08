<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>字典详情</span>
      <span>/</span>
      <span>DictData Management</span>
    </div>
    <!--  Toolbar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-button size="mini" type="primary" plain @click="add()">添加</el-button>
        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>
        <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>
        <el-button type="primary" size="mini" plain @click="backtrack()">返回</el-button>
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
        <el-table-column label="字典编码" prop="dictCode"/>
        <el-table-column label="字典标签" prop="dictLabel">
          <!--          <template slot-scope="scope">
                      <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{scope.row.dictLabel}}</span>
                      <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{scope.row.dictLabel}}</el-tag>
                    </template>-->
        </el-table-column>
        <el-table-column label="字典键值" prop="dictValue"/>
        <el-table-column label="字典排序" prop="dictSort"/>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close width="800px">
        <el-form class="jz-form-body" :model="tableUtil.module.model" :rules="rules" ref="form"
                 label-width="80px">
          <el-form-item label="字典类型">
            <el-input v-model="tableUtil.module.model.dictType" :disabled="true"/>
          </el-form-item>
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input v-model="tableUtil.module.model.dictLabel" placeholder="请输入字典标签"/>
          </el-form-item>
          <el-form-item label="字典键值" prop="dictValue">
            <el-input v-model="tableUtil.module.model.dictValue" placeholder="请输入字典键值"/>
          </el-form-item>
          <el-form-item label="字典排序" prop="dictSort">
            <el-input-number v-model="tableUtil.module.model.dictSort" controls-position="right" :min="0"/>
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
            <el-input v-model="tableUtil.module.model.remark" type="textarea" placeholder="请输入内容"></el-input>
          </el-form-item>
          <div class="jz-form-btn">
            <el-button type="primary" plain @click="save('form')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
import TableUtil from "@/assets/supplier/js/TableUtil";

export default {
  name: 'Material',
  data() {
    return {
      tableUtil: {},
      model: {},
      dictStatusList: [],
      rules: {
        dictLabel: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getDict()
    this.tableUtil = new TableUtil(this.$api.management.system.dictData, {}, '字典详情', false)
    this.tableUtil.filter.dictType = this.$route.params.id;
    this.tableUtil.initTable();
  },
  methods: {
    selectedRow(row) {
      row.id = row.dictCode;
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
      this.tableUtil.module.model.dictType = this.$route.params.id;
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
    beforeClose(done) {
      this.cleanVerifyMessage()
      done()
    },
    // 清空表单验证信息
    cleanVerifyMessage() {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    backtrack() {
      this.$router.push({path: '/admin/dict'})
    }
  }
}
</script>
