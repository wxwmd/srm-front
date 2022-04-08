<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div>
        <el-button type="primary" plain @click="update()" v-if="type !== 1">文件上传</el-button>
        <el-button type="primary" plain @click="exportData()">导出</el-button>
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
        <el-table-column label="物料号">
          <template slot-scope="scope">
            <span @click="downloadDetail(scope.row)" class="jz-name">{{scope.row.materialNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialDescription" label="物料描述"/>
        <el-table-column prop="componentNumber" label="组件数量"/>
        <el-table-column prop="unit" label="单位"/>
        <el-table-column prop="materialType" label="物料类型"/>
        <el-table-column prop="amount" label="数量"/>
        <el-table-column prop="pgr" label="pGr"/>
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
import common from "@/assets/supplier/js/common";
export default {
  name: "Assembly",
  data(){
    return{
      type:this.$store.state.user.type,
      form:{
        formRules: {
          documentUrl: [
            {required: true, message: '详情不能为空', trigger: 'blur'}
          ]
        },
        uploadUrl: '',
        headers: {
          credential: localStorage.getItem('jaezi-credential')
        }
      },
      tableUtil: {},
      documentUrl: '',
    }
  },
  created () {
    this.tableUtil = new TableUtil(this.$api.supplier.collaboration.assembly, {}, '总成件组件');
    this.form.uploadUrl = this.$api.supplier.collaboration.assembly.upload
  },
  methods:{
    pageSizeChange (limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange (page) {
      this.tableUtil.pageCurrentChange(page)
    },
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    doSearch(){
      this.tableUtil.initTable()
    },
    update() {
      if (this.tableUtil.table.currentRow !== null) {
        this.documentUrl = this.tableUtil.table.currentRow.documentUrl
      }
      this.tableUtil.update()
    },
    save(formName) {
      this.tableUtil.module.model.documentName = this.tableUtil.module.model.materialNumber + '详情'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save()
        }
      })
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
        this.$api.supplier.collaboration.assembly.download("blob", params).then(res => {
          common.blobDownLoad(res);
        })
      } else {
        this.$message.error('请上传详情文件')
      }
    },
    exportData(){
      if(this.tableUtil.filter.materialNumber === undefined ){
        this.tableUtil.filter.materialNumber = ''
      }
      this.tableUtil.form.currentApi = this.$api.supplier.collaboration.assembly.export
      this.tableUtil.export()
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
  .jz-name {
    cursor: pointer;
  }
  .jz-name:hover {
    color: #4499ff;
  }
</style>
