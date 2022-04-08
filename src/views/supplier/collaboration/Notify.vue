<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar" v-if="type !== 1">
      <div></div>
      <div>
        <el-button type="primary" plain @click="info()">进厂不合格通知</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column show-overflow-tooltip prop="title" label="标题" width="200px">
          <template slot-scope="scppe">
            <router-link :to="'/information/' + scppe.row.id">
              <span style="color: #337ab7;">{{ scppe.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" :formatter="formatInfoType" label="类型" width="100px"/>
        <el-table-column prop="sender" label="发件人" width="120px"/>
        <el-table-column prop="recipient" label="收件人" width="120px"/>
        <el-table-column v-if="type !== 1" prop="senderReadStatus" :formatter="formatReadStatus" label="发件人状态" width="90px"/>
        <el-table-column prop="recipientReadStatus" :formatter="formatReadStatus" :label="type === 1 ? '状态' : '收件人状态'" width="90px"/>
        <el-table-column prop="auditStatus" label="是否同意不合格通知" width="150px">
          <template slot-scope="scope">
            {{ scope.row.auditStatus === '0' ? "否" : (scope.row.auditStatus === '1' ? "是" : "") }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"/>
        <el-table-column prop="createTime" :formatter="formatTime" label="时间" width="150px"/>
        <el-table-column label="操作" width="150" v-if="type === 1">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" title="同意不合格通知" icon="el-icon-check"
                       :disabled="scope.row.auditStatus !== '' && scope.row.auditStatus !== null" circle
                       @click="audit(scope.row)"></el-button>
            <el-button size="mini" type="primary" title="不同意不合格通知" icon="el-icon-close"
                       :disabled="scope.row.auditStatus !== '' && scope.row.auditStatus !== null" circle
                       @click="auditError(scope.row)"></el-button>
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
      <el-dialog title="修改备注" :close-on-click-modal="false" :visible.sync="form.visible" destroy-on-close
                 width="800px">
        <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="100px"
                 label-position="left">
          <el-form-item label="备注" prop="remark">
            <el-input size="small" class="jz-input" v-model="form.model.remark"/>
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
import {formatDateTime} from "@/assets/management/js/Utils";

export default {
  name: "Notify",
  data() {
    return {
      type: this.$store.state.user.type,
      tableUtil: {},
      readStatus: [],
      infoType: [],
      form: {
        visible: false,
        model: {
          remark: ''
        },
        formRules: {
          remark: [
            {required: true, message: '备注不能为空', trigger: 'blur'}
          ]
        },
      }
    }
  },
  created() {
    this.getDict("readStatus");
    this.getDict("infoType");
    this.tableUtil = new TableUtil(this.$api.supplier.information, {}, '查询信息', false);
    this.tableUtil.filter.infoStateType = '2';
    this.tableUtil.filter.type = '2';
    this.tableUtil.initTable();
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    doSearch() {
      this.tableUtil.filter.infoStateType = '2';
      this.tableUtil.filter.type = '2';
      this.tableUtil.initTable()
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    formatReadStatus(row, column, cellValue) {
      let dictLabel = "";
      this.readStatus.forEach(function (v) {
        if (cellValue === parseInt(v.dictValue)) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    },
    formatInfoType(row, column, cellValue) {
      let dictLabel = "";
      this.infoType.forEach(function (v) {
        if (cellValue === parseInt(v.dictValue)) {
          dictLabel = v.dictLabel;
          return;
        }
      })
      return dictLabel;
    },
    getDict(ditType) {
      this.$api.supplier.system.dict(ditType).then(res => {
        if (res.code === 200) {
          if (ditType === "readStatus") {
            this.readStatus = res.data;
          } else if (ditType === "infoType") {
            this.infoType = res.data;
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    info() {
      this.$router.push({path: '/information/issue', query: {infoType: 2}})
    },
    audit(data) {
      let params = {
        id: data.id,
        auditStatus: 1
      }
      this.updateAudit(params)
    },
    auditError(data) {
      this.form.visible = true
      this.form.model = data
    },
    updateAudit(data) {
      this.$api.supplier.information.update(data).then(res => {
        if (res.code === 200) {
          this.tableUtil.initTable()
          if (data.auditStatus === 0) {
            this.form.visible = false
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    save(formName) {
      this.form.model.auditStatus = 0
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateAudit(this.form.model)
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
    }
  }
}
</script>

<style scoped>
/deep/ .el-table .cell {
  overflow: hidden;
  white-space: nowrap;
}

/deep/ .el-button {
  padding: 0 7px;
}
</style>
