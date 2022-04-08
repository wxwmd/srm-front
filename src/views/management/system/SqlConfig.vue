<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>自定义SQL配置管理</span>
      <span>/</span>
      <span>SqlConfig Management</span>
    </div>
    <!--  Toolbar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-button size="mini" type="primary" plain @click="add()">添加</el-button>
        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>
        <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>
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
        <el-table-column prop="functionName" label="功能名称"/>
        <el-table-column prop="sqlContent" label="自定义SQL" :show-overflow-tooltip="true"/>
        <el-table-column prop="remark" label="备注"/>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible"
                 destroy-on-close
                 width="800px">
        <el-form class="jz-form-body" :model="tableUtil.module.model" ref="form" :rules='form.formRules'
                 label-width="100px">
          <el-form-item label="功能名称" prop="functionName">
            <el-input class="jz-input" :disabled="!tableUtil.table.isAdd"
                      v-model="tableUtil.module.model.functionName"/>
          </el-form-item>
          <el-form-item label="自定义SQL" prop="sqlContent">
            <el-input class="jz-input" type="textarea" :rows="12" v-model="tableUtil.module.model.sqlContent"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input class="jz-input" type="textarea" v-model="tableUtil.module.model.remark"/>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="manualRun()">执行</el-button>
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
          functionName: [
            {required: true, message: '功能名称不允许为空', trigger: 'blur'}
          ],
          sqlContent: [
            {required: true, message: '自定义SQL不允许为空', trigger: 'blur'}
          ]
        }
      },
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.management.system.sqlConfig, {}, '自定义SQL配置')
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
    manualRun() {
      if (this.tableUtil.module.model.sqlContent) {
        this.$api.management.system.sqlConfig.run(this.tableUtil.module.model).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
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
</style>
