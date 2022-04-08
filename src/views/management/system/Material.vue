<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>物料管理</span>
      <span>/</span>
      <span>Material Management</span>
    </div>
    <!--  Toolbar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.materialNumber" placeholder="物料号"/>
        <el-input size="mini" class="jz-input" clearable v-model="tableUtil.filter.materialName" placeholder="物料名称"/>
        <el-button size="mini" type="primary" plain @click="doSearch()">查询</el-button>
      </div>
      <div>
        <el-button size="mini" type="primary" plain @click="add()">添加</el-button>
        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>
<!--        <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>-->
<!--        <el-button size="mini" type="primary" plain @click="templateExport()">物料模板导出</el-button>
        <el-popover class="jz-import" placement="top" width="320" v-model="tableUtil.upload.visible">
          <div class="jz-upload">
            <a href="javascript:;">
              选择文件<input type="file" @change="controlUploadChange"/>
            </a>
            <input type="text" v-model="tableUtil.upload.fileName"/>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="tableUtil.upload.visible = false">取消</el-button>
            <el-button size="mini" type="primary" @click="excelImport">导入</el-button>
          </div>
          <el-button size="mini" type="primary" class="export" slot="reference" plain>物料导入</el-button>
        </el-popover>-->
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
        <el-table-column prop="materialNumber" label="物料编码" width="90px"/>
        <el-table-column prop="materialName" label="物料名称" width="150px"/>
        <el-table-column prop="materialDescription" label="物料描述" width="150px"/>
        <el-table-column prop="buyerNumber" :formatter="formatBuyerNumber" label="采购员" width="90"/>
        <el-table-column prop="specification" label="规格" width="150px"/>
        <el-table-column prop="unit" label="单位"/>
        <el-table-column prop="utf1" label="最低补量"/>
        <el-table-column prop="trafficStabilityClassification" label="流量稳定性分类" width="110"/>
        <el-table-column prop="trafficClassification" label="流量分类"/>
        <el-table-column prop="riskClassification" label="风险分类"/>
        <el-table-column prop="plant" label="工厂"/>
        <el-table-column prop="minimalPackage" label="舍入值(最小包装)" width="120"/>
        <el-table-column prop="minimumQuantity" label="最小批量"/>
        <el-table-column prop="deliveryFrequency" label="送货频次" width="120"/>
        <el-table-column prop="purchaseDay" label="采购周期"/>
        <el-table-column prop="procurementType" :formatter="formatProcurementType" label="采购类型"/>
        <el-table-column prop="category" label="品类"/>
        <el-table-column prop="socialGeneralityClassification" label="社会通用性分类" width="120"/>
        <el-table-column prop="supplyMode" label="供货方式"/>
        <el-table-column prop="purchaseGroup" label="采购组"/>
        <el-table-column prop="utf1" label="扩展属性1"/>
        <el-table-column prop="utf2" label="扩展属性2"/>
        <el-table-column prop="utf3" label="扩展属性3"/>
        <el-table-column prop="utf4" label="扩展属性4"/>
        <el-table-column prop="utf5" label="扩展属性5"/>
        <el-table-column prop="utf6" label="扩展属性6"/>
        <el-table-column prop="utf7" label="扩展属性7"/>
        <el-table-column prop="utf8" label="扩展属性8"/>
        <el-table-column prop="utf9" label="扩展属性9"/>
        <el-table-column prop="utf10" label="扩展属性10"/>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close width="800px">
        <el-form class="jz-form-body" :model="tableUtil.module.model" ref="form" :rules='formRules'
                 label-width="120px">
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="物料编码" prop="materialNumber">
              <el-input class="jz-input" :disabled="!tableUtil.table.isAdd"
                        v-model="tableUtil.module.model.materialNumber"/>
            </el-form-item>
            <el-form-item label="物料名称" prop="materialName">
              <el-input class="jz-input" v-model="tableUtil.module.model.materialName"/>
            </el-form-item>
          </el-form-item>
          <el-form-item label="物料描述" prop="materialDescription">
            <el-input class="jz-input" v-model="tableUtil.module.model.materialDescription"/>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="采购员" prop="buyerNumber">
              <el-select class="jz-input" v-model="tableUtil.module.model.buyerNumber" style="width: 100%">
                <el-option
                    v-for="item in realNameList"
                    :key="item.value"
                    :label="item.realName"
                    :value="item.realName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="规格" prop="specification">
              <el-input class="jz-input" v-model="tableUtil.module.model.specification"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="单位" prop="unit">
              <el-input class="jz-input" v-model="tableUtil.module.model.unit"/>
            </el-form-item>
            <el-form-item label="风险分类" prop="riskClassification">
              <el-input class="jz-input" v-model="tableUtil.module.model.riskClassification"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="流量稳定性分类" prop="trafficStabilityClassification">
              <el-input class="jz-input" v-model="tableUtil.module.model.trafficStabilityClassification"/>
            </el-form-item>
            <el-form-item label="流量分类" prop="trafficClassification">
              <el-input class="jz-input" v-model="tableUtil.module.model.trafficClassification"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="工厂" prop="plant">
              <el-input class="jz-input" v-model="tableUtil.module.model.plant"/>
            </el-form-item>
            <el-form-item label="舍入值" prop="minimalPackage">
              <el-input class="jz-input" v-model="tableUtil.module.model.minimalPackage"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="最小批量" prop="minimumQuantity">
              <el-input class="jz-input" v-model="tableUtil.module.model.minimumQuantity"/>
            </el-form-item>
            <el-form-item label="送货频次" prop="deliveryFrequency">
              <el-input class="jz-input" v-model="tableUtil.module.model.deliveryFrequency"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="采购周期" prop="purchaseDay">
              <el-input class="jz-input" v-model="tableUtil.module.model.purchaseDay"/>
            </el-form-item>
            <el-form-item label="采购类型" prop="procurementType">
              <el-select class="jz-input" v-model="tableUtil.module.model.procurementType" style="width: 100%">
                <el-option label="标准" value="1"></el-option>
                <el-option label="寄售" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="品类" prop="category">
              <el-input class="jz-input" v-model="tableUtil.module.model.category"/>
            </el-form-item>
            <el-form-item label="社会通用性分类" prop="socialGeneralityClassification">
              <el-input class="jz-input" v-model="tableUtil.module.model.socialGeneralityClassification"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="供货方式" prop="supplyMode">
              <el-input class="jz-input" v-model="tableUtil.module.model.supplyMode"/>
            </el-form-item>
            <el-form-item label="采购组" prop="purchaseGroup">
              <el-input class="jz-input" v-model="tableUtil.module.model.purchaseGroup"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="扩展属性1" prop="utf1">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf1"/>
            </el-form-item>
            <el-form-item label="扩展属性2" prop="utf2">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf2"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="扩展属性3" prop="utf3">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf3"/>
            </el-form-item>
            <el-form-item label="扩展属性4" prop="utf4">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf4"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="扩展属性5" prop="utf5">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf5"/>
            </el-form-item>
            <el-form-item label="扩展属性6" prop="utf6">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf6"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="扩展属性7" prop="utf7">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf7"/>
            </el-form-item>
            <el-form-item label="扩展属性8" prop="utf8">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf8"/>
            </el-form-item>
          </el-form-item>
          <el-form-item class="jz-form-flex" label-width="0">
            <el-form-item label="扩展属性9" prop="utf9">
              <el-input class="jz-input" v-model="tableUtil.module.model.utf9"/>
            </el-form-item>
            <el-form-item label="扩展属性10" prop="utf10">
              <el-input class="jz-input10" v-model="tableUtil.module.model.utf10"/>
            </el-form-item>
          </el-form-item>
          <!--          <el-form-item label="最低补量" prop="utf1">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf1"/>
                    </el-form-item>
                    <el-form-item label="固定前置天数" prop="utf2">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf2"/>
                    </el-form-item>
                    <el-form-item label="变动前置天数" prop="utf3">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf3"/>
                    </el-form-item>
                    <el-form-item label="批量" prop="utf4">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf4"/>
                    </el-form-item>
                    <el-form-item label="品号属性" prop="utf5">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf5"/>
                    </el-form-item>
                    <el-form-item label="补货倍量" prop="utf6">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf6"/>
                    </el-form-item>
                    <el-form-item label="安全库存" prop="utf7">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf7"/>
                    </el-form-item>
                    <el-form-item label="工作中心" prop="utf8">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf8"/>
                    </el-form-item>
                    <el-form-item label="工单单别" prop="utf9">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf9"/>
                    </el-form-item>
                    <el-form-item label="工时" prop="utf10">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf10"/>
                    </el-form-item>
                    <el-form-item label="仓库" prop="utf11">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf11"/>
                    </el-form-item>
                    <el-form-item label="供应商" prop="utf12">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf12"/>
                    </el-form-item>
                    <el-form-item label="补货政策" prop="utf13">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf13"/>
                    </el-form-item>
                    <el-form-item label="物料提交人" prop="utf14">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf14"/>
                    </el-form-item>
                    <el-form-item label="核准状态" prop="utf15">
                      <el-input class="jz-input" v-model="tableUtil.module.model.utf15"/>
                    </el-form-item>-->
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {formatDateTime} from '@/assets/management/js/Utils'
import TableUtil from "@/assets/supplier/js/TableUtil";

export default {
  name: 'Material',
  data() {
    return {
      formRules:{
        materialNumber: [
          {required: true, message:'物料编码不能为空', trigger: 'blur'}
        ],
        materialName: [
          {required: true, message:'物料名称不能为空', trigger: 'blur'}
        ]
      },
      tableUtil: {},
      realNameList: [],
      form: {
        formRules: {
          materialNumber: [
            {required: true, message: '物料号不能为空', trigger: 'blur'}
          ]
        },
        model:{}
      }
    }
  },
  created() {
    this.getRealName()
    this.tableUtil = new TableUtil(this.$api.management.system.material, {}, '物料')
  },
  methods: {
    selectedRow(row) {
      row.id = row.materialNumber;
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
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
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
    getRealName() {
      let filter = {};
      filter.userType = 0;
      filter.status = 0
      this.$api.management.system.user.getAll(filter).then(res => {
        if (res.code === 200) {
          this.realNameList = res.data.records
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    // 导入excel文件
    excelImport() {
      this.tableUtil.upload.uploadName = 'file'
      this.tableUtil.module.apis.importApi = this.$api.management.system.material.import
      this.tableUtil.importCamera()
    },
    // 监听文件上传框
    controlUploadChange(e) {
      this.tableUtil.uploadChange(e)
    },
    templateExport() {
      this.tableUtil.form.currentApi = this.$api.management.system.material.templateExports
      this.tableUtil.export()
    },
    formatBuyerNumber(row, column, cellValue) {
      let dictLabel = "";
      this.realNameList.forEach(function (v) {
        if (cellValue === v.realName) {
          dictLabel = v.username;
          return;
        }
      })
      return dictLabel;
    },
    getDict(type) {
      this.$api.supplier.system.dict(type).then(res => {
        if (res.code === 200) {
          if (type === 'problem') {
            this.problemList = res.data
          } else if (type === 'mainMaterials') {
            this.mainList = res.data
          } else if (type === 'proposedSupplies') {
            this.supplieList = res.data
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    formatProcurementType(row, column, cellValue) {
      if (parseInt(cellValue) === 1) {
        return "标准";
      } else if (parseInt(cellValue) === 2) {
        return "寄售";
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

.jz-input {
  width: 200px;
  margin-right: 10px;
}

.jz-form-flex /deep/ .el-form-item__content {
  display: flex;
}

.jz-form-flex /deep/ .el-form-item {
  width: 50%;
}

/deep/ .el-form-item .jz-input {
  width: 100%;
  margin-right: 0;
}
</style>
