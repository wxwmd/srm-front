<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.serverNumber" placeholder="服务单号"/>
        <el-select size="mini" filterable :filter-method="selectValue" v-model="tableUtil.filter.isPay" clearable
                   placeholder="是否付款">
          <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="type !== 1">
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
        <el-table-column label="服务单号">
          <template slot-scope="scope">
            <span @click="downloadDetail(scope.row)" class="jz-name">{{ scope.row.serverNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialsExpense" width="100" label="材料费"/>
        <el-table-column prop="manHourExpense" width="100" label="工时费"/>
        <el-table-column prop="travelExpense" width="100" label="差旅费"/>
        <el-table-column prop="otherExpenses" width="100" label="其他费用"/>
        <el-table-column prop="amount" width="100" label="合计"/>
        <el-table-column prop="isPay" label="是否付款">
          <template slot-scope="scope">
            {{ scope.row.isPay === 1 ? "已付款" : "未付款" }}
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="创建人"/>
        <el-table-column prop="supplierCode" label="索赔对象"/>
        <el-table-column prop="createTime" label="创建时间" width="150" :formatter="formatTime"/>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="claim(scope.row.id)">查看索赔信息</el-button>
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
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="100px">
          <el-form-item label="服务单号" prop="serverNumber">
            <el-input size="small" class="jz-input" :disabled="!tableUtil.table.isAdd"
                      v-model="tableUtil.module.model.serverNumber"/>
          </el-form-item>
          <el-form-item label="材料费" prop="materialsExpense">
            <el-input size="small" class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')"
                      v-model="tableUtil.module.model.materialsExpense"/>
          </el-form-item>
          <el-form-item label="工时费" prop="manHourExpense">
            <el-input size="small" class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')"
                      v-model="tableUtil.module.model.manHourExpense"/>
          </el-form-item>
          <el-form-item label="差旅费" prop="travelExpense">
            <el-input size="small" class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')"
                      v-model="tableUtil.module.model.travelExpense"/>
          </el-form-item>
          <el-form-item label="其他费用" prop="otherExpenses">
            <el-input size="small" class="jz-input" onkeyup="value=value.replace(/[^\d.]/g,'')"
                      v-model="tableUtil.module.model.otherExpenses"/>
          </el-form-item>
          <el-form-item label="索赔对象" prop="supplierCode">
            <el-select size="small" filterable v-model="tableUtil.module.model.supplierCode" placeholder="请选择供应商">
              <el-option
                  v-for="item in supplierList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="详情" prop="documentUrl">
            <el-upload
                ref="uploadDetail"
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
          <el-form-item label="是否付款" prop="isPay">
            <el-radio v-model="tableUtil.module.model.isPay" :label="1">是</el-radio>
            <el-radio v-model="tableUtil.module.model.isPay" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="jz-form">
      <el-dialog title="索赔信息" :close-on-click-modal="false" :visible.sync="visible" width="1200px">
        <button class="jz-btn" style="margin-bottom: 10px" @click="reply(3,infoId,id,supplierCode,createUser)">回复
        </button>
        <el-input type="text" v-model="ruleForm.userId" v-if="false"></el-input>
        <div class="jz-module-table">
          <el-table highlight-current-row
                    border
                    size="mini"
                    :header-cell-style="{background:'#f9f9f9'}"
                    :data="infoData"
                    style="width:100%">
            <el-table-column type="index" width="50"/>
            <el-table-column show-overflow-tooltip prop="title" label="标题">
              <template slot-scope="scppe">
                <router-link :to="'/information/' + scppe.row.id">
                  <span style="color: #337ab7;">{{ scppe.row.title }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="type" :formatter="formatInfoType" label="类型" width="100px"/>
            <el-table-column prop="sender" label="发件人" width="200px"/>
            <el-table-column prop="recipient" label="收件人" width="200px"/>
            <el-table-column prop="recipientReadStatus" :formatter="formatReadStatus" label="状态" width="100px"/>
            <el-table-column prop="createTime" :formatter="formatTime" label="时间" width="150px"/>
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
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'
import {formatDateTime} from "@/assets/management/js/Utils";
import common from "@/assets/supplier/js/common";

export default {
  name: "Claim",
  data() {
    return {
      selectListCopy: [{
        value: '0',
        label: '未付款'
      }, {
        value: '1',
        label: '已付款'
      }],
      value: '',
      selectList: [{
        value: '0',
        label: '未付款'
      }, {
        value: '1',
        label: '已付款'
      }],
      type: this.$store.state.user.type,
      tableUtil: {},
      visible: false,
      infoData: [],
      infoType: [],
      infoStatus: [],
      readStatus: [],
      infoId: "",
      supplierCode: "",
      createUser: "",
      id: "",
      Info: {
        page: 1,
        limit: 10
      },
      form: {
        formRules: {
          serverNumber: [
            {required: true, message: '服务单号不能为空', trigger: 'blur'}
          ],
          materialsExpense: [
            {required: true, message: '材料费不能为空', trigger: 'blur'}
          ],
          manHourExpense: [
            {required: true, message: '工时费不能为空', trigger: 'blur'}
          ],
          travelExpense: [
            {required: true, message: '差旅费不能为空', trigger: 'blur'}
          ],
          otherExpenses: [
            {required: true, message: '其他费用不能为空', trigger: 'blur'}
          ],
          supplierCode: [
            {required: true, message: '索赔对象不能为空', trigger: 'blur'}
          ],
          isPay: [
            {required: true, message: '是否付款不能为空', trigger: 'blur'}
          ],
          documentUrl: [
            {required: true, message: '详情不能为空', trigger: 'blur'}
          ]
        },
        uploadUrl: '',
        headers: {
          credential: localStorage.getItem('jaezi-credential')
        }
      },
      supplierList: [],
      documentUrl: '',
    }
  },
  created() {
    this.getDict("infoType");
    this.getDict("infoStatus");
    this.getDict("readStatus");
    this.tableUtil = new TableUtil(this.$api.supplier.collaboration.claim, {}, '索赔信息管理');
    this.form.uploadUrl = this.$api.supplier.collaboration.claim.upload
    this.getSupplier()
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    selectValue(val) {
      this.value = val;
      if (val) { //val存在
        this.selectList = this.selectListCopy.filter((item) => {
          if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        })
      } else { //val为空时，还原数组
        this.selectList = this.selectListCopy;
      }
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
      if (this.tableUtil.module.model.documentUrl !== undefined && this.tableUtil.module.model.documentUrl !== '' && this.tableUtil.module.model.documentUrl !== null) {
        this.tableUtil.module.model.documentName = this.tableUtil.module.model.serverNumber + '详情'
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.tableUtil.module.model.amount = parseFloat(this.tableUtil.module.model.manHourExpense) + parseFloat(this.tableUtil.module.model.materialsExpense) + parseFloat(this.tableUtil.module.model.otherExpenses) + parseFloat(this.tableUtil.module.model.travelExpense)
            this.tableUtil.save()
          }
        })
      } else {
        this.$message.error('请上传文件')
      }
    },
    getSupplier() {
      let filter = {type: 'claim'};
      this.$api.supplier.system.getAllSupplier(filter).then(res => {
        if (res.code === 200) {
          this.supplierList = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    success(res) {
      this.$refs.uploadDetail.clearFiles();
      this.documentUrl = res.data
      this.tableUtil.module.model.documentUrl = res.data
    },
    downloadDetail(data) {
      if (data.documentUrl !== null) {
        let params = {// 参数
          id: data.id,
          fileName: data.documentName
        };
        this.$api.supplier.collaboration.claim.download("blob", params).then(res => {
          common.blobDownLoad(res);
        })
      } else {
        this.$message.error('请上传详情文件')
      }
    },
    claim(id) {
      this.visible = true
      this.$api.supplier.collaboration.claim.getClaim(id).then(res => {
        if (res.code === 200) {
          this.infoData = res.data.infoList
          this.infoId = res.data.infoId
          this.id = res.data.id
          this.supplierCode = res.data.supplierCode
          this.createUser = res.data.createUser
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
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
          if (ditType == "readStatus") {
            this.readStatus = res.data;
          } else if (ditType == "infoType") {
            this.infoType = res.data.filter(function (value) {
              return parseInt(value.dictValue) === 3;
            })
          } else if (ditType == "infoStatus") {
            this.infoStatus = res.data;
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    reply(infoType, infoId, id, supplierCode, createUser) {
      let username = "";
      let userType = this.$store.state.user.type;
      if (userType == 0 || userType == 3) {
        username = supplierCode;
      } else {
        username = createUser;
      }
      this.$router.push({
        path: '/information/issue',
        query: {infoType: infoType, infoId: infoId, id: id, username: username}
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
/deep/ .el-table .cell {
  overflow: hidden;
  white-space: nowrap;
}

/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
}

/deep/ .el-form-item {
  width: 50%;
}

.jz-name {
  cursor: pointer;
}

.jz-name:hover {
  color: #4499ff;
}
</style>
