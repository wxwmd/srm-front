<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="small" clearable v-model="tableUtil.filter.reportName" placeholder="报告名称"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="userType !== 1" class="jz-toolbar-margin1">
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
        <el-table-column prop="reportName" label="报告名称"/>
        <el-table-column prop="reportDescription" label="报告描述"/>
        <el-table-column prop="updateDate" label="更新时间" :formatter="formatTime"/>
        <el-table-column label="下载" width="100">
          <template slot-scope="scope">
            <el-button type="plain" @click="download(scope.row)">
              下载
            </el-button>
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
                 destroy-on-close width="800px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="100px"
                 label-position="left">
          <el-form-item label="报告名称" prop="reportName">
            <el-input size="small" class="jz-input" v-model="tableUtil.module.model.reportName"
                      :disabled="!tableUtil.table.isAdd"/>
          </el-form-item>
          <el-form-item label="报告描述" prop="reportDescription">
            <el-input size="small" type="textarea" class="jz-input" v-model="tableUtil.module.model.reportDescription"/>
          </el-form-item>
          <el-form-item label="文件链接" prop="url">
            <el-upload
                ref="upload"
                :action="form.uploadUrl"
                :headers="form.headers"
                :show-file-list="false"
                :limit="1"
                :on-success="uploadSuccess">
              <el-input size="small" type="textarea" class="jz-input" v-if="url !== ''"
                        v-model="tableUtil.module.model.url"/>
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
import common from "@/assets/supplier/js/common";
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "QualityInformation",
  data() {
    return {
      userType: this.$store.state.user.type,
      form: {
        formRules: {
          reportName: [
            {required: true, message: '报告名称不能为空', trigger: 'blur'}
          ],
          reportDescription: [
            {required: true, message: '报告描述不能为空', trigger: 'blur'}
          ],
          visible: [
            {required: true, message: '可见性不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '文件链接不能为空', trigger: 'blur'}
          ],
        },
        uploadUrl: '',
        headers: {
          credential: localStorage.getItem('jaezi-credential')
        }
      },
      visiblePersonList: [],
      url: '',
      tableUtil: {},
      supplierList: []
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.quality.qualityInformation, {}, '供应商质量');
    this.form.uploadUrl = this.$api.supplier.quality.qualityInformation.upload
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
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    add() {
      this.url = ''
      this.tableUtil.module.model.url = ''
      this.visiblePersonList = []
      this.tableUtil.add()
    },
    update() {
      this.visiblePersonList = []
      if (this.tableUtil.table.currentRow !== null) {
        this.$api.supplier.quality.qualityInformation.getVisible(this.tableUtil.table.currentRow.id).then(res => {
          if (res.code === 200) {
            res.data.forEach(person => {
              this.visiblePersonList.push(person.personId)
            })
          }
        })
        this.url = this.tableUtil.table.currentRow.url
      }
      this.tableUtil.update()
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      if (this.tableUtil.module.model.url !== undefined && this.tableUtil.module.model.url !== '' && this.tableUtil.module.model.url !== null) {
        this.tableUtil.module.model.visiblePersonList = this.visiblePersonList
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
      this.tableUtil.module.model.url = res.data
      this.url = res.data
    },
    download(data) {
      let params = {// 参数
        id: data.id
      };
      this.$api.supplier.quality.qualityInformation.download("blob", params).then(res => {
        common.blobDownLoad(res);
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
        this.url = ''
        this.visiblePersonList = []
      })
    }
  }
}
</script>

<style scoped>

</style>
