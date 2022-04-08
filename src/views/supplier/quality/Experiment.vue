<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1" v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.reportNumber" placeholder="报告单号"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.reportName" placeholder="报告名称"/>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="userType == 1" class="jz-toolbar-margin1">
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
                :header-cell-style="{background:'#f9f9f9'}"
                @row-click="selectedRow"
                :data="tableUtil.table.tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <!--        <el-table-column prop="materialNumber" label="物料号"/>-->
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="reportNumber" label="报告单号"/>
        <el-table-column prop="reportName" label="报告名称"/>
        <el-table-column prop="reportDescription" label="报告描述"/>
        <el-table-column prop="reportUploadDate" label="报告上传时间" :formatter="formatTime"/>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close width="600px">
        <el-form :model="tableUtil.model" ref="form" :rules='tableUtil.form.formRules' label-width="80px"
                 label-position="left">
          <el-form-item label="报告名称" prop="reportName">
            <el-input size="small" class="jz-input" v-model="tableUtil.model.reportName"/>
          </el-form-item>
          <el-form-item label="报告描述" prop="reportDescription">
            <el-input size="small" type="textarea" class="jz-input" v-model="tableUtil.model.reportDescription"/>
          </el-form-item>
          <el-form-item label="文件链接" prop="url">
            <el-upload
                ref="upload"
                :action="tableUtil.form.uploadUrl"
                :headers="tableUtil.form.headers"
                :show-file-list="false"
                :limit="1"
                :on-success="uploadSuccess">
              <el-input size="small" type="textarea" class="jz-input" v-if="tableUtil.model.url !== ''"
                        v-model="tableUtil.model.url"/>
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
import common from "@/assets/supplier/js/common";
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: "Experiment",
  data() {
    return {
      userType: this.$store.state.user.type,
      tableUtil: {
        filter: {
          limit: 10,
          page: 1,
          reportType: 1
        },
        table: {
          currentRow: null,
          tableData: [],
          total: 0,
          isAdd: true
        },
        form: {
          title: '供应商实验报告',
          visible: false,
          formRules: {
            reportName: [
              {required: true, message: '文件名不能为空', trigger: 'blur'}
            ],
            reportDescription: [
              {required: true, message: '文件描述不能为空', trigger: 'blur'}
            ],
            url: [
              {required: true, message: '文件链接不能为空', trigger: 'blur'}
            ],
          },
          uploadUrl: '',
          headers: {
            credential: localStorage.getItem('jaezi-credential')
          },
          currentApi: ''
        },
        model: {
          url: '',
          reportName:'',
          reportDescription:'',
          reportType: 1
        }
      },
    }
  },
  created() {
    this.initTable()
    this.tableUtil.form.uploadUrl = this.$api.supplier.quality.experiment.upload
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.filter.limit = limit;
      this.initTable()
    },
    pageCurrentChange(page) {
      this.tableUtil.filter.page = page;
      this.initTable()
    },
    initTable() {
      let self = this
      self.$api.supplier.quality.experiment.getAll(this.tableUtil.filter).then(res => {
        if (res.code === 200) {
          self.tableUtil.table.tableData = res.data.records
          self.tableUtil.table.total = res.data.total
        } else {
          self.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    doSearch() {
      this.initTable()
    },
    selectedRow(row) {
      this.tableUtil.table.currentRow = row
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    add() {
      this.tableUtil.model.url = ''
      this.tableUtil.model.reportName = ''
      this.tableUtil.model.reportDescription = ''
      this.tableUtil.form.visible = true;
      this.tableUtil.form.title = '添加供应商实验报告信息';
      this.tableUtil.table.isAdd = true;
      this.tableUtil.form.currentApi = this.$api.supplier.quality.experiment.add;
    },
    update() {
      if (this.tableUtil.table.currentRow) {
        this.tableUtil.model = Object.assign({}, this.tableUtil.table.currentRow)
      } else {
        this.$message.error('请先选择一条记录！');
        return
      }
      this.tableUtil.form.visible = true;
      this.tableUtil.form.title = '修改供应商实验报告信息';
      this.tableUtil.table.isAdd = false;
      this.tableUtil.form.currentApi = this.$api.supplier.quality.experiment.update;
    },
    remove() {
      if (!this.tableUtil.table.currentRow) {
        this.$message.error('请先选择一条记录！');
        return
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.supplier.quality.experiment.remove(this.tableUtil.table.currentRow.id).then(() => {
          if (this.tableUtil.table.total % 10 === 1) {
            this.tableUtil.filter.page = this.tableUtil.filter.page > 1 ? this.tableUtil.filter.page - 1 : 1;
          }
          this.initTable();
          this.$message.success('删除成功')
        })
      }).catch(() => {
      });
    },
    save(formName) {
      if (this.tableUtil.model.url !== undefined && this.tableUtil.model.url !== '' && this.tableUtil.model.url !== null){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tableUtil.form.currentApi(this.tableUtil.model).then(res => {
              if (res.code === 200) {
                this.tableUtil.form.visible = false;
                this.initTable()
              } else {
                this.$message.error(res.code + ':' + res.msg)
              }
            })
          }
        })
      } else {
        this.$message.error('请上传文件')
      }
    },
    // 上传成功事件
    uploadSuccess(res) {
      this.$refs.upload.clearFiles();
      this.tableUtil.model.url = res.data
    },
    download(data) {
      let params = {// 参数
        id: data.id
      };
      this.$api.supplier.quality.experiment.download("blob", params).then(res => {
        common.blobDownLoad(res);
      })

    },
    // beforeClose(done) {
    //   this.cleanVerifyMessage()
    //   done()
    // },
    // // 清空表单验证信息
    // cleanVerifyMessage() {
    //   this.$nextTick(() => {
    //     this.$refs['form'].resetFields()
    //   })
    // }
  }
}
</script>

<style scoped>
/*/deep/ .el-upload {*/
/*  width: 100%;*/
/*  text-align: left;*/
/*}*/
/*.jz-uploader-icon{*/
/*  font-size: 40px;*/
/*  border: 1px solid #ddd;*/
/*  padding: 20px;*/
/*  border-radius: 4px;*/
/*  color: #ddd;*/
/*}*/
</style>
