<template>
  <div class="jz-supplier-container">
    <!--  ToolBar  -->
    <div class="jz-module-toolbar">
      <div>
        <el-input class="jz-input" size="mini" clearable v-if="this.$store.state.user.type !== 1"
                  v-model="tableUtil.filter.supplierCode" placeholder="供应商编码"/>
        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.pOrder" placeholder="采购订单号"/>
        <!--        <el-input class="jz-input" size="mini" clearable v-model="tableUtil.filter.status" placeholder="状态 &#45;&#45;确认、未确认"/>-->
        <el-select size="mini" v-model="tableUtil.filter.status" clearable placeholder="请选择状态">
          <el-option label="确认" :value="1"></el-option>
          <el-option label="未确认" :value="0"></el-option>
        </el-select>
        <button class="jz-btn" @click="doSearch()">查询</button>
      </div>
      <div v-if="this.$store.state.user.type === 1">
        <!--        <el-button type="primary" plain @click="submit()">未确认说明提交</el-button>-->
        <el-button type="primary" plain @click="exportData()">导出</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table">
      <el-table highlight-current-row
                border
                size="mini"
                :header-cell-style="{background:'#f9f9f9'}"
                :data="tableUtil.table.tableData"
                @row-click="selectedRow"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="colorStatus" width="60">
          <template slot-scope="scope">
            <i :class="scope.row.colorStatus === 'yellow' && !scope.row.status ? 'el-icon-s-opportunity jz-yellow' : (scope.row.colorStatus === 'red' && !scope.row.status ? 'el-icon-s-opportunity jz-red' : (scope.row.status == 1 ? 'el-icon-s-opportunity jz-green' : (scope.row.status == 0 ? 'el-icon-s-opportunity jz-red' : '')))"></i>
          </template>
        </el-table-column>
        <el-table-column prop="supplierCode" v-if="this.$store.state.user.type !== 1" label="供应商编码" width="150"/>
        <el-table-column prop="materialNumber" label="物料号" width="110"/>
        <el-table-column prop="materialName" label="物料名称" width="150"/>
        <el-table-column prop="pOrder" label="采购订单" width="110"/>
        <el-table-column prop="status" label="状态" width="">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? "确认" : (scope.row.status == 0 ? "未确认" : "") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" v-if="type === 1 || type === 0">
          <template slot-scope="scope">
            <!--            <el-button size="mini" type="primary" :disabled="scope.row.status == 1" icon="el-icon-check" circle-->
            <!--                       @click="confirm(scope.row)"></el-button>-->
            <!--            <el-button size="mini" type="danger" :disabled="scope.row.status == 1" icon="el-icon-close" circle-->
            <!--                       @click="unconfirmed(scope.row)"></el-button>-->
            <div v-if="type === 1">
              <el-button size="mini" type="primary"
                         :disabled="scope.row.status == 1 || scope.row.unDescription == '已调整' || scope.row.auditStatus == '0'"
                         @click="confirm(scope.row)">确认
              </el-button>
              <el-button size="mini" type="primary"
                         :disabled="scope.row.status == 1 || scope.row.unDescription == '已调整' || scope.row.auditStatus == '0'"
                         @click="unconfirmed(scope.row)">提交未确认说明
              </el-button>
            </div>
            <div v-if="type === 0">
              <el-button size="mini" type="primary"
                         :disabled="(scope.row.status == 0 || scope.row.status == undefined) || scope.row.unDescription == '已调整' || scope.row.auditStatus == '0'"
                         @click="repeal(scope.row)">撤销确认
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="未确认说明" width="200">
          <template slot-scope="scope">
            <el-select v-if="type === 1" size="mini" v-model="scope.row.unDescription"
                       :disabled="scope.row.status == 1 || scope.row.unDescription == '已调整' || scope.row.auditStatus == '0'"
                       placeholder="请选择">
              <el-option label="可按时按量交货" value="可按时按量交货" disabled></el-option>
              <el-option label="因商务、渠道原因不能确定" value="因商务、渠道原因不能确定"></el-option>
              <el-option label="因状态原因不能确认" value="因状态原因不能确认"></el-option>
              <el-option label="其他（手工输入）" value="其他（手工输入）"></el-option>
            </el-select>
            <el-input v-if="scope.row.unDescription === '其他（手工输入）' && type === 1" size="mini"
                      v-model="scope.row.unDescriptionInput"></el-input>
            <span v-if="type !== 1 && scope.row.unDescription !== '其他（手工输入）'">{{ scope.row.unDescription }}</span>
            <span v-if="type !== 1 && scope.row.unDescription === '其他（手工输入）'">{{ scope.row.unDescriptionInput }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="plant" label="工厂" width="120"/>
        <el-table-column prop="project" label="项目"/>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="urgent" label="紧急"/>
        <el-table-column prop="componentIdentity" label="组件标识"/>
        <el-table-column prop="version" label="版本号"/>
        <el-table-column prop="identityInformation" label="标识信息"/>
        <el-table-column prop="qty" label="数量" width="60"/>
        <el-table-column prop="unit" label="单位" width="50"/>
        <el-table-column prop="deliveryDate" label="交货日期" width="100"/>
        <el-table-column prop="createDate" label="建立日期" width="100"/>
        <el-table-column prop="releaseReason" label="发布原因" width="150"/>
        <el-table-column prop="orderReason" label="订单原因" width="150"/>
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
  </div>
</template>

<script>
import TableUtil from '@/assets/supplier/js/TableUtil'

export default {
  name: "OrderConfirm",

  data() {
    return {
      type: this.$store.state.user.type,
      form: {
        formRules: {
          username: [
            {required: true, message: '未确认信息不能为空', trigger: 'blur'}
          ]
        },
      },
      tableUtil: {},
      model: {}
    }
  },
  created() {
    let username = this.$route.query.username;
    if (username) {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.orderStatus, {}, '采购订单确认', false);
      this.tableUtil.filter.username = username;
      this.tableUtil.filter.colorStatus = this.$route.query.colorStatus;
      this.tableUtil.initTable();
    } else {
      this.tableUtil = new TableUtil(this.$api.supplier.procurement.infoMaintenance.orderStatus, {}, '采购订单确认');
    }
  },
  mounted() {
    this.$store.state.user.menus.forEach(menu => {
      if (menu.menuName === '采购业务') {
        this.getMenu(menu)
      }
    })
  },
  methods: {
    getMenu(menu) {
      let currentSubMenu = menu.children
      this.$store.dispatch('setCurrentSubMenu', currentSubMenu)
      let currentMenu = '';
      menu.children.forEach((item, i) => {
        if (item.menuName === '采购信息查询与维护') {
          item.children.forEach((menuChildren, m) => {
            if (menuChildren.menuName === '采购订单确认') {
              currentMenu = menu.children[i].id + '-' + menu.children[i].children[m].id
            }
          })
        }
      })
      this.$store.dispatch('setCurrentMenu', currentMenu)
      this.$bus.$emit('refresh')
    },
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    doSearch() {
      this.tableUtil.initTable()
    },
    //0：未确认 1：已确认
    confirm(data) {
      data.status = '1'
      data.unDescription = '可按时按量交货'
      data.unDescriptionInput = ''
      this.update(data)
    },
    repeal(data) {
      data.status = '0'
      data.unDescription = ''
      data.unDescriptionInput = ''
      this.update(data)
    },
    unconfirmed(data) {
      if (data.unDescription === '' || data.unDescription === null) {
        this.$message.error('请选择未确认说明')
      } else if (data.unDescription === '其他（手工输入）') {
        if (data.unDescriptionInput === '' || data.unDescriptionInput === null) {
          this.$message.error('请填写未确认说明')
        } else {
          data.status = '0'
          this.update(data)
        }
      } else {
        data.status = '0'
        data.unDescriptionInput = ''
        this.update(data)
      }
    },
    update(data) {
      this.$api.supplier.procurement.infoMaintenance.orderStatus.update(data).then(res => {
        if (res.code === 200) {
          if (data.status === '1') {
            this.$message.success(data.plant + '采购订单已确认')
          } else {
            this.$message.success(data.plant + '采购订单未确认说明已提交')
          }
          this.tableUtil.initTable()
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    submit() {
      if (this.model.status == 0) {
        this.$api.supplier.procurement.infoMaintenance.orderStatus.update(this.model).then(res => {
          if (res.code === 200) {
            this.$message.success(this.model.plant + '采购订单未确认说明已提交')
            this.tableUtil.initTable()
          } else {
            this.$message.error(res.code + ':' + res.msg)
          }
        })
      } else {
        this.$message.warning('采购订单状态为已确认，不用填写未确认说明')
      }
    },
    exportData() {
      if (this.tableUtil.filter.pOrder === undefined) {
        this.tableUtil.filter.pOrder = ''
      }
      if (this.tableUtil.filter.releaseReason === undefined) {
        this.tableUtil.filter.releaseReason = ''
      }
      if (this.tableUtil.filter.status === undefined) {
        this.tableUtil.filter.status = ''
      }
      this.tableUtil.form.currentApi = this.$api.supplier.procurement.infoMaintenance.orderStatus.export
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
    },
    // 导入excel文件
    excelImport() {
      this.tableUtil.upload.uploadName = 'file'
      this.tableUtil.module.apis.importApi = this.$api.supplier.procurement.infoMaintenance.orderStatus.import
      this.tableUtil.importCamera()
    },
    // 监听文件上传框
    controlUploadChange(e) {
      this.tableUtil.uploadChange(e)
    },
    templateExport() {
      this.tableUtil.form.currentApi = this.$api.supplier.procurement.infoMaintenance.orderStatus.templateExport
      this.tableUtil.export()
    },
  }
}
</script>

<style scoped>
.jz-upload {
  margin-bottom: 10px;
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
  margin: -11px 10px;
}

/deep/ .el-button--mini.is-circle {
  padding: 0 7px;
}

.jz-red {
  color: red;
}

.jz-yellow {
  color: yellow;
}

.jz-green {
  color: green;
}
</style>
