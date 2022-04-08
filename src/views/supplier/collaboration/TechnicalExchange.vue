<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.name" placeholder="资料名称"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.description" placeholder="资料描述"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="type !== 1" class="jz-toolbar-margin1">
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
                ref="multipleTable"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column label="资料名称">
          <template slot-scope="scope">
            <span @click="downloadDetail(scope.row)" class="jz-name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="资料描述"/>
        <el-table-column prop="updateTime" :formatter="formatTime" label="更新时间"/>
        <el-table-column label="资料下载" width="100">
          <template slot-scope="scope">
            <el-button type="plain" v-if="scope.row.url" @click="download(scope.row)">下载</el-button>
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
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible"
                 destroy-on-close
                 width="800px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="100px"
                 label-position="left">
          <el-form-item label="资料名称" prop="name">
            <el-input size="small" class="jz-input" :disabled="!tableUtil.table.isAdd"
                      v-model="tableUtil.module.model.name"/>
          </el-form-item>
          <el-form-item label="资料描述" prop="description">
            <el-input size="small" type="textarea" class="jz-input" v-model="tableUtil.module.model.description"/>
          </el-form-item>
          <el-form-item label="资料链接" prop="url">
            <el-upload
                ref="uploadDetail"
                :action="form.uploadUrl"
                :headers="form.headers"
                :show-file-list="false"
                :limit="1"
                :on-success="uploadSuccess">
              <el-input size="small" type="textarea" class="jz-input" v-if="url !== '' && url !== undefined"
                        v-model="tableUtil.module.model.url"/>
              <i v-else class="el-icon-plus jz-uploader-icon"></i>
            </el-upload>
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
          <el-form-item label="设置可见性" prop="visible">
            <el-select size="mini" v-model="tableUtil.module.model.visible">
              <el-option label="所有企业用户和部分供应商" :value="0"></el-option>
              <el-option label="所有用户" :value="1"></el-option>
              <el-option label="企业用户" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择供应商" prop="visiblePersonList" v-if="tableUtil.module.model.visible === 0">
            <el-transfer
                filterable
                filter-placeholder="请输入供应商"
                :titles="['供应商列表', '可见供应商']"
                v-model="visiblePersonList"
                :data="supplierList">
            </el-transfer>
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
  name: "Assembly",
  data() {
    return {
      type: this.$store.state.user.type,
      form: {
        formRules: {
          name: [
            {required: true, message: '资料名称不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '资料描述不能为空', trigger: 'blur'}
          ],
          visible: [
            {required: true, message: '可见性不能为空', trigger: 'blur'}
          ],
          documentUrl: [
            {required: true, message: '详情不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '文件链接不能为空', trigger: 'blur'}
          ]
        },
        uploadUrl: '',
        headers: {
          credential: localStorage.getItem('jaezi-credential')
        }
      },
      visiblePersonList: [],
      url: '',
      documentUrl: '',
      tableUtil: {},
      supplierList: []
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.collaboration.technicalExchange, {}, '技术资料交流');
    this.form.uploadUrl = this.$api.supplier.collaboration.technicalExchange.upload
    this.getSupplier()
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
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    add() {
      this.url = ''
      this.tableUtil.module.model.url = ''
      this.documentUrl = ''
      this.tableUtil.module.model.documentUrl = ''
      this.visiblePersonList = []
      this.tableUtil.add()
    },
    update() {
      this.visiblePersonList = []
      if (this.tableUtil.table.currentRow !== null) {
        this.$api.supplier.collaboration.technicalExchange.getVisible(this.tableUtil.table.currentRow.id).then(res => {
          if (res.code === 200) {
            res.data.forEach(person => {
              this.visiblePersonList.push(person.personId)
            })
          }
        })
        this.url = this.tableUtil.table.currentRow.url
        this.documentUrl = this.tableUtil.table.currentRow.documentUrl
      }
      this.tableUtil.update()
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      if (this.tableUtil.module.model.url !== undefined && this.tableUtil.module.model.url !== '' && this.tableUtil.module.model.url !== null && this.tableUtil.module.model.documentUrl !== undefined && this.tableUtil.module.model.documentUrl !== '' && this.tableUtil.module.model.documentUrl !== null) {
        this.tableUtil.module.model.visiblePersonList = this.visiblePersonList
        this.tableUtil.module.model.documentName = this.tableUtil.module.model.name + '详情'
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tableUtil.save()
          }
        })
      } else {
        this.$message.error('请上传文件')
      }
    },
    getSupplier() {
      this.$api.supplier.system.getAllSupplier().then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            this.supplierList.push({label: item.username, key: item.userId})
          })
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    // 上传成功事件
    uploadSuccess(res) {
      this.$refs.upload.clearFiles();
      this.url = res.data
      this.tableUtil.module.model.url = res.data
    },
    success(res) {
      this.$refs.uploadDetail.clearFiles();
      this.documentUrl = res.data
      this.tableUtil.module.model.documentUrl = res.data
    },
    download(data) {
      let params = {// 参数
        id: data.id,
        fileName: data.name
      };
      this.$api.supplier.collaboration.technicalExchange.download("blob", params).then(res => {
        common.blobDownLoad(res);
      })
    },
    downloadDetail(data) {
      if (data.documentUrl !== null) {
        let params = {// 参数
          id: data.id,
          fileName: data.documentName
        };
        this.$api.supplier.collaboration.technicalExchange.download("blob", params).then(res => {
          common.blobDownLoad(res);
        })
      } else {
        this.$message.error('请上传详情文件')
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
</style>
