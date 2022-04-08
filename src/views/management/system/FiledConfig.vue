<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>数据表配置管理</span>
      <span>/</span>
      <span>TableConfig Management</span>
    </div>
    <!--  Toolbar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.filedName" placeholder="列名称"/>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
        <el-button type="primary" size="mini" plain @click="add()">添加</el-button>
        <el-button type="primary" size="mini" plain @click="update()">修改</el-button>
        <el-button type="danger" size="mini" plain @click="remove()">删除</el-button>
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
        <el-table-column type="index" width="50"/>
        <el-table-column prop="filedName" label="列名称"/>
        <el-table-column prop="dataType" label="数据类型"/>
        <el-table-column prop="defaultValues" label="默认值"/>
        <el-table-column prop="isNull" :formatter="formatIsNull" label="是否为空"/>
        <el-table-column prop="isPk" :formatter="formatIsPk" label="是否主键"/>
        <el-table-column prop="comments" label="注释"/>
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
        <el-form class="jz-form-body" :model="tableUtil.module.model" ref="form" :rules='form.formRules'
                 label-width="80px">
          <el-form-item label="表ID" v-if="false">
            <el-input class="jz-input" v-model="tableUtil.module.model.tableId"/>
          </el-form-item>
          <el-form-item label="表名称">
            <el-input class="jz-input" v-model="tableUtil.module.model.tableName" :disabled="true"/>
          </el-form-item>
          <el-form-item label="列名称" prop="filedName">
            <el-input class="jz-input" v-model="tableUtil.module.model.filedName"/>
          </el-form-item>
          <el-form-item label="数据类型" prop="dataType">
            <el-input class="jz-input" v-model="tableUtil.module.model.dataType"/>
          </el-form-item>
          <el-form-item label="默认值" prop="defaultValues">
            <el-input class="jz-input" v-model="tableUtil.module.model.defaultValues"/>
          </el-form-item>
          <el-form-item label="是否为空" prop="isNull">
            <el-radio-group v-model="tableUtil.module.model.isNull">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否主键" prop="isPk">
            <el-radio-group v-model="tableUtil.module.model.isPk">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注释" prop="comments">
            <el-input class="jz-input" v-model="tableUtil.module.model.comments"/>
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
import TableUtil from "@/assets/supplier/js/TableUtil";

export default {
  name: 'Material',
  data() {
    return {
      tableUtil: {},
      model: {},
      form: {
        formRules: {
          filedName: [
            {required: true, message: '列名称不允许为空', trigger: 'blur'}
          ],
          dataType: [
            {required: true, message: '数据类型不允许为空', trigger: 'blur'}
          ],
          comments: [
            {required: true, message: '列注释不允许为空', trigger: 'blur'}
          ],
          isPk: [
            {required: true, message: '是否主键不允许为空', trigger: 'blur'}
          ],
          isNull: [
            {required: true, message: '是否为空不允许为空', trigger: 'blur'}
          ],
        }
      },
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.management.system.filedConfig, {}, '数据列配置', false)
    this.tableUtil.filter.tableId = this.$route.query.id;
    this.tableUtil.initTable();
  },
  methods: {
    selectedRow(row) {
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
    add() {
      this.tableUtil.add();
      this.tableUtil.module.model.tableName = this.$route.query.tableName;
      this.tableUtil.module.model.tableId = this.$route.query.id;
    },
    update() {
      this.tableUtil.update();
      this.tableUtil.module.model.tableName = this.$route.query.tableName;
      this.tableUtil.module.model.tableId = this.$route.query.id;
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
    formatIsPk(row, column, cellValue) {
      if (cellValue == 1) {
        return '是';
      } else {
        return '否';
      }
    },
    formatIsNull(row, column, cellValue) {
      if (cellValue == 1) {
        return '否';
      } else {
        return '是';
      }
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
      this.$router.push({path: '/admin/tableConfig'})
    }
  }
}
</script>

<style scoped>
/*.jz-icon-btn button{*/
/*  width: 100px;*/
/*  height: 36px;*/
/*  background: #209eb4;*/
/*  color: #DDD;*/
/*  font-weight: 600;*/
/*  border: none;*/
/*  margin: 0 1px;*/
/*}*/
/*.jz-icon-btn button:hover{*/
/*  background: #3fbdc9;*/
/*  cursor: pointer;*/
/*  color: #DDD;*/
/*}*/
.jz-icon-list span {
  margin: 1px 2px;
  font-size: 30px;
  border: 1px solid #CCC;
}

.jz-icon-list span i {
  font-size: 30px;
  padding: 30px;
}

.jz-icon-list span i:hover {
  cursor: pointer;
  background-color: #EEE;
}

.jz-upload {
  margin-bottom: 10px;
}

.jz-input {
  width: 200px;
  margin-right: 10px;
}

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

.jz-import {
  margin: 0 10px;
}
</style>
