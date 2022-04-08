<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div class="jz-toolbar-margin1" v-if="type !== 1">
        <el-button type="primary" plain @click="bulkUpload">批量上传</el-button>
        <el-button type="primary" plain @click="update()">修改</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <div class="jz-attention" v-if="type !== 1">
        <p>*上传的文件名的格式为‘物料号-凭证号-凭证版本’，请按规定命名，否则会上传失败</p>
      </div>
      <el-table highlight-current-row
                border
                size="mini"
                @row-click="selectedRow"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                ref="multipleTable"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column label="序列号">
          <template slot-scope="scope">
            <span @click="downloadDetail(scope.row)" class="jz-name">{{scope.row.seriesNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialNumber" label="物料号"/>
        <el-table-column prop="description" label="物料描述"/>
        <el-table-column prop="documentType" label="文档类型"/>
        <el-table-column prop="certificateNumber" label="凭证号"/>
        <el-table-column prop="certificateVersions" label="凭证版本"/>
        <el-table-column prop="certificateDescription" label="凭证部分">
          <template slot-scope="scope">
            {{ scope.row.certificateDescription === 2 ? "有效" : "无效" }}
          </template>
        </el-table-column>
        <el-table-column prop="effectiveDate" label="生效日期"/>
        <el-table-column prop="topicOutline" label="大小量纲"/>
        <el-table-column label="下载" width="100">
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close
                 width="800px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="100px"
                 label-position="left">
          <el-form-item label="物料号" prop="materialNumber">
            <el-input size="small" class="jz-input" disabled v-model="tableUtil.module.model.materialNumber"/>
          </el-form-item>
          <el-form-item label="详情" prop="documentUrl">
            <el-upload
                ref="uploadDetail"
                :action="form.uploadUrl"
                :headers="form.headers"
                :show-file-list="false"
                :limit="1"
                :on-success="success">
              <el-input size="small" type="textarea" class="jz-input" v-if="documentUrl !== '' && documentUrl !== undefined && documentUrl !== null" v-model="tableUtil.module.model.documentUrl"/>
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
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog title="批量上传" :close-on-click-modal="false" :visible.sync="upload.visible" :before-close="beforeCloseUpload"
                 width="800px">
        <el-form :model="upload.model" ref="uploadForm" :rules='upload.formRules' label-width="100px"
                 label-position="left">
          <el-form-item label-width="0">
            <el-upload
              action=""
              :on-remove="fileRemove"
              :auto-upload="false"
              :on-change="fileChange"
              ref="upload"
              :show-file-list="true"
              :file-list="upload.fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="设置可见性" prop="visible">
            <el-select size="mini" v-model="upload.model.visible">
              <el-option label="所有企业用户和部分供应商" :value="0"></el-option>
              <el-option label="所有用户" :value="1"></el-option>
              <el-option label="企业用户" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择供应商" prop="visiblePersonList" v-if="upload.model.visible === 0">
            <el-transfer
              filterable
              filter-placeholder="请输入供应商"
              :titles="['供应商列表', '可见供应商']"
              v-model="upload.model.visiblePersonList"
              :data="supplierList">
            </el-transfer>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="saveUpload('uploadForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import common from "@/assets/supplier/js/common";

export default {
  name: "Technical",
  data() {
    return {
      type: this.$store.state.user.type,
      form: {
        formRules: {
          documentUrl: [
            {required: true, message: '详情不能为空', trigger: 'blur'}
          ],
          visible: [
            {required: true, message: '可见性不能为空', trigger: 'blur'}
          ],
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
      supplierList: [],
      upload:{
        formRules: {
          visible: [
            {required: true, message: '可见性不能为空', trigger: 'blur'}
          ]
        },
        visible: false,
        fileList:[],
        model:{
          visible: '',
          fileNames: [],
          visiblePersonList: []
        }
      }
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.supplier.collaboration.technical, {}, '技术图档信息管理');
    this.form.uploadUrl = this.$api.supplier.collaboration.technical.upload
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
    add() {
      this.visiblePersonList = []
      this.tableUtil.add()
    },
    remove() {
      this.tableUtil.remove()
    },
    update() {
      this.visiblePersonList = []
      if (this.tableUtil.table.currentRow !== null) {
        this.documentUrl = this.tableUtil.table.currentRow.documentUrl
        this.tableUtil.module.model.materialNumber = this.tableUtil.table.currentRow.materialNumber
        this.$api.supplier.collaboration.technical.getVisible(this.tableUtil.table.currentRow.id).then(res => {
          if (res.code === 200) {
            res.data.forEach(person => {
              this.visiblePersonList.push(person.personId)
            })
          }
        })
      }
      this.tableUtil.update()
    },
    success(res) {
      this.$refs.uploadDetail.clearFiles();
      this.documentUrl = res.data
      this.tableUtil.module.model.documentUrl = res.data
    },
    save(formName) {
      this.tableUtil.module.model.visiblePersonList = this.visiblePersonList
      this.tableUtil.module.model.documentName = this.tableUtil.table.currentRow.materialNumber + '-' + this.tableUtil.table.currentRow.certificateNumber + '-' + this.tableUtil.table.currentRow.certificateVersions + '详情'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save()
        }
      })
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
    fileChange(file, fileList) {
      this.upload.fileList = fileList;
    },
    fileRemove(file, fileList) {
      this.upload.fileList = fileList;
    },
    bulkUpload(){
      this.upload.visible = true
    },
    saveUpload(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.upload.fileList.length == 0) {
            this.$message.error('请上传文件')
          } else {
            let formData = new FormData();
            // eslint-disable-next-line no-unused-vars
            let fileList = this.upload.fileList;
            for (let index in fileList) {
              let size = fileList[index].size / 1024 / 1024;
              if (size > 10) {
                this.$message.error('文件【' + fileList[index].name + '】大小不得超过10M');
                return;
              }
              formData.append(fileList[index].uid, fileList[index].raw);
            }
            this.$api.supplier.collaboration.technical.batchUpLoad(formData).then(result => {
              if (result.code === 200) {
                this.upload.model.fileNames = result.data;
                this.infoSubmit();
              } else {
                this.$message.error(result.code + ':' + result.msg)
              }
            })
          }
        }
      })
    },
    infoSubmit() {
      this.$api.supplier.collaboration.technical.bulkUpload(this.upload.model).then(result => {
        if (result.code === 200) {
          this.$message.success('文件上传成功')
          this.$refs.upload.clearFiles();
          this.tableUtil.initTable()
          this.upload.visible = false
        } else if (result.code === 432){
          let name = ''
          result.data.forEach((item,index) => {
            if (index === 0){
              name = item
            } else {
              name = name +',' + item
            }
          })
          this.tableUtil.initTable()
          this.upload.visible = false
          this.$message.error(name + '上传失败')
        } else {
          this.$message.error(result.code + ':' + result.msg)
        }
      })
    },
    download(data) {
      let params = {// 参数
        id: data.id,
        fileName: data.materialNumber + '-' + data.certificateNumber + '-' + data.certificateVersions
      };
      this.$api.supplier.collaboration.technical.download("blob", params).then(res => {
        common.blobDownLoad(res);
      })
    },
    downloadDetail(data) {
      if (data.documentUrl !== null){
        let params = {// 参数
          id: data.id,
          fileName: data.documentName
        };
        this.$api.supplier.collaboration.technical.download("blob", params).then(res => {
          common.blobDownLoad(res);
        })
      } else {
        this.$message.error('请先在修改里面上传详情文件')
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
    },
    beforeCloseUpload(done) {
      this.cleanVerifyMessageUpload()
      done()
    },
    // 清空表单验证信息
    cleanVerifyMessageUpload() {
      this.$nextTick(() => {
        this.$refs['uploadForm'].resetFields()
        this.upload.model.visiblePersonList = []
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
