<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.serialNo" placeholder="流程流水号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.title" placeholder="变更标题"/>
        <el-select filterable size="mini" v-model="tableUtil.filter.status" clearable placeholder="状态">
          <el-option
              v-for="(item,index) in processStateList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue">
          </el-option>
        </el-select>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="type === 1">
        <el-button type="primary" plain @click="add()">添加</el-button>
        <el-button type="primary" plain @click="update()">修改</el-button>
        <el-button type="primary" plain @click="remove()">删除</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                @row-click="selectedRow"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="serialNo" label="流程流水号"/>
        <el-table-column label="变更标题">
          <template slot-scope="scope">
            <span @click="downloadDetail(scope.row)" class="jz-name">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :formatter="formatProcessState" label="状态"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"/>
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
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close
                 width="800px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="100px">
          <el-form-item label="流程流水号" prop="serialNo">
            <el-input size="small" class="jz-input" :disabled="!tableUtil.table.isAdd"
                      v-model="tableUtil.module.model.serialNo"/>
          </el-form-item>
          <el-form-item label="变更标题" prop="title">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.title"/>
          </el-form-item>
          <el-form-item label="流程状态" prop="status">
            <el-select size="small" filterable v-model="tableUtil.module.model.status" placeholder="请选择流程状态">
              <el-option
                  v-for="item in processStateList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详情" prop="documentUrl">
            <el-upload
              ref="upload"
              :action="form.uploadUrl"
              :headers="form.headers"
              :show-file-list="false"
              :limit="1"
              :on-success="success">
              <el-input size="small" type="textarea" class="jz-input"
                        v-if="documentUrl !== '' && documentUrl !== undefined && documentUrl !== null"
                        v-model="tableUtil.module.model.documentUrl"/>
              <i v-else class="el-icon-plus jz-uploader-icon"></i>
            </el-upload>
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
import TableUtil from '@/assets/supplier/js/TableUtil'
import {formatDateTime} from '@/assets/management/js/Utils'
import common from "@/assets/supplier/js/common";

export default {
  name: "Change",
  data() {
    return {
      type: this.$store.state.user.type,
      value1: [],
      tableUtil: {},
      form: {
        formRules: {
          serialNo: [
            {required: true, message: '流程流水号不能为空', trigger: 'blur'}
          ],
          supplierCode: [
            {required: true, message: '供应商编码不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '变更标题不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '流程状态不能为空', trigger: 'blur'}
          ]
        },
        uploadUrl: '',
        headers: {
          credential: localStorage.getItem('jaezi-credential')
        },
      },
      processStateList: [],
      documentUrl: '',
    }
  },
  created() {
    this.getProcessStateDict();
    this.tableUtil = new TableUtil(this.$api.supplier.collaboration.change, {}, '供应商技术、厂址变更');
    this.form.uploadUrl = this.$api.supplier.collaboration.change.upload
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
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    add() {
      this.documentUrl = ''
      this.tableUtil.module.model.documentUrl = ''
      this.tableUtil.add()
    },
    update() {
      if (this.tableUtil.table.currentRow !== null) {
        this.documentUrl = this.tableUtil.table.currentRow.documentUrl
      }
      this.tableUtil.update()
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      if (this.tableUtil.module.model.documentUrl !== undefined && this.tableUtil.module.model.documentUrl !== '' && this.tableUtil.module.model.documentUrl !== null){
        this.tableUtil.module.model.documentName = this.tableUtil.module.model.title + '详情'
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tableUtil.save()
          }
        })
      } else {
        this.$message.error('请上传文件')
      }
    },
    success(res) {
      this.$refs.upload.clearFiles();
      this.documentUrl = res.data
      this.tableUtil.module.model.documentUrl = res.data
    },
    downloadDetail(data) {
      if (data.documentUrl !== null) {
        let params = {// 参数
          id: data.id,
          fileName: data.documentName
        };
        this.$api.supplier.collaboration.change.download("blob", params).then(res => {
          common.blobDownLoad(res);
        })
      } else {
        this.$message.error('请上传详情文件')
      }
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    changeTime() {
      if (this.value1.length > 0) {
        this.tableUtil.filter.stateTime = this.value1[0]
        this.tableUtil.filter.entTime = this.value1[1]
      }
    },
    getProcessStateDict() {
      this.$api.supplier.system.dict("processState").then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            item.dictValue = parseInt(item.dictValue)
          })
          this.processStateList = res.data;
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    formatProcessState(row, column, cellValue) {
      let dictLabel = "";
      this.processStateList.forEach(function (v) {
        if (cellValue === parseInt(v.dictValue)) {
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
        this.url = ''
        this.visiblePersonList = []
      })
    }
  }
}
</script>

<style scoped>
  .jz-name {
    cursor: pointer;
  }
  .jz-name:hover {
    color: #4499ff;
  }
  .jz-module-toolbar{
    align-items: flex-start;
  }
</style>
