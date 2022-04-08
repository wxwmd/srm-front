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
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.tableName" placeholder="表名称"/>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
        <el-button type="primary" size="mini" plain @click="add()">添加</el-button>
        <el-button type="primary" size="mini" plain @click="update()">修改</el-button>
        <el-button type="danger" size="mini" plain @click="remove()">删除</el-button>
        <el-button type="primary" size="mini" plain @click="templateExport()">数据表模板导出</el-button>
        <el-popover class="jz-import" placement="top" width="320" v-model="tableUtil.upload.visible">
          <div class="jz-upload">
            <a href="javascript:;">
              选择文件<input type="file" @change="controlUploadChange"/>
            </a>
            <input type="text" v-model="tableUtil.upload.fileName"/>
            <el-select size="mini" @focus="getTableName" v-model="tableName" filterable placeholder="请选择表名"
                       style="margin-top: 10px">
              <el-option
                  v-for="item in tableNameList"
                  :key="item.id"
                  :label="item.tableName"
                  :value="item.tableName">
              </el-option>
            </el-select>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="tableUtil.upload.visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="excelImport">导入</el-button>
          </div>
          <el-button size="mini" type="primary" class="export" slot="reference" plain>数据表导入</el-button>
        </el-popover>
        <el-button type="primary" size="mini" plain @click="pathConfig()">文件夹路径配置</el-button>
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
        <el-table-column label="表名称">
          <template slot-scope="scope">
            <router-link :to="{path:'/admin/filedConfig',query: {id:scope.row.id,tableName:scope.row.tableName}}">
              <span style="color: #337ab7;">{{ scope.row.tableName }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="tableComments" label="表注释"/>
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
          <el-form-item label="表名称" prop="tableName">
            <el-input class="jz-input" v-model="tableUtil.module.model.tableName" :disabled="!tableUtil.table.isAdd"/>
          </el-form-item>
          <el-form-item label="表注释" prop="tableComments">
            <el-input class="jz-input" v-model="tableUtil.module.model.tableComments"/>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--  Form  -->
    <div class="jz-form">
      <el-dialog title="文件夹路径配置" :close-on-click-modal="false" :visible.sync="form.visible" :before-close="beforeClosePath"
                 width="800px">
        <el-form :model="form.model" ref="form1" :rules='form.formRules' label-width="100px"
                 label-position="left">
          <el-form-item label="文件夹路径" prop="path">
            <el-input class="jz-input" v-model="form.model.path"/>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="pathConfigSave('form1')">确 定</el-button>
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
      tableNameList: [],
      tableName: '',
      form: {
        visible: false,
        model: {
          path: ''
        },
        formRules: {
          tableName: [
            {required: true, message: '表名称不允许为空', trigger: 'blur'}
          ],
          tableComments: [
            {required: true, message: '表注释不允许为空', trigger: 'blur'}
          ]
        }
      },
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.management.system.tableConfig, {}, '数据表配置');
    let filter = {id: 2};
    this.$api.management.system.resource.getAll(filter).then(res => {
      if (res.code === 200) {
        let data = ''
        data = res.data.records[0].config
        this.form.model = JSON.parse(data);
      }
    })
  },
  methods: {
    getTableName() {
      this.$api.management.system.tableConfig.getAll().then(res => {
        if (res.code === 200) {
          this.tableNameList = res.data.records
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
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
    templateExport() {
      this.tableUtil.form.currentApi = this.$api.management.system.tableConfig.templateExports
      this.tableUtil.export()
    },
    docxExport() {
      this.tableUtil.form.currentApi = this.$api.management.system.tableConfig.docxExports
      this.tableUtil.export()
    },
    // 导入excel文件
    excelImport() {
      let index = this.tableUtil.upload.fileName.lastIndexOf('.')
      let fileName = this.tableUtil.upload.fileName.substring(0, index);
      if (fileName === this.tableName) {
        this.tableUtil.upload.uploadName = 'file'
        this.tableUtil.module.apis.importApi = this.$api.management.system.tableConfig.import
        this.tableUtil.importCamera()
      } else {
        this.$message.error('上传的文件名称与表名不一样，请上传与表名对应的文件')
      }
    },
    // 监听文件上传框
    controlUploadChange(e) {
      this.tableUtil.uploadChange(e)
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
    beforeClosePath(done) {
      this.cleanVerifyMessagePath()
      done()
    },
    // 清空表单验证信息
    cleanVerifyMessagePath() {
      this.$nextTick(() => {
        this.$refs['form1'].resetFields()
      })
    },
    pathConfig() {
      this.form.visible = true
    },
    pathConfigSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let config = ''
          config = JSON.stringify(this.form.model)
          let data = {id: 2, config: config}
          this.$api.management.system.resource.update(data).then(res => {
            if (res.code === 200) {
              this.form.visible = false
            } else {
              this.$message.error(res.code + ':' + res.msg)
            }
          })
        }
      })
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
