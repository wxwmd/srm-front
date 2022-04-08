<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>权限管理</span>
      <span>/</span>
      <span>Permission Management</span>
    </div>
    <!--  Toolbar  -->
<!--    <div class="jz-module-toolbar-admin">-->
<!--      &lt;!&ndash;        <div>-->
<!--                <el-select class="jz-input" clearable v-model="tableUtil.filter.permissionType" placeholder="权限类型">-->
<!--                  <el-option label="Api" value="Api"></el-option>-->
<!--                  <el-option label="Menu" value="Menu"></el-option>-->
<!--                </el-select>-->
<!--                <el-button type="primary" plain @click="doSearch()">查询</el-button>-->
<!--              </div>&ndash;&gt;-->
<!--      <div>-->
<!--        <el-button size="mini" type="primary" plain @click="add()">添加</el-button>-->
<!--        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>-->
<!--        <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>-->
<!--      </div>-->
<!--    </div>-->
    <!--  Table  -->
    <div class="jz-module-table-admin">
      <el-table highlight-current-row
                @row-click="selectedRow"
                :data="tableUtil.table.tableData"
                row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="permissionName" label="权限名称"/>
        <el-table-column prop="permissionCode" label="权限标识"/>
<!--        <el-table-column prop="permissionType" label="权限类型"/>-->
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? "正常" : "锁定" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"/>

        <!--        <el-table-column prop="permissionMenu"  label="权限菜单"/>-->
      </el-table>
    </div>
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close
                 width="666px">
        <el-form class="jz-form-body" :model="tableUtil.module.model" ref="form" :rules='form.formRules'
                 label-width="80px">
          <!--          <el-form-item label="权限类型" prop="permissionType">-->
          <!--            <el-radio v-model="tableUtil.module.model.permissionType" label="Api" border>Api</el-radio>-->
          <!--            <el-radio v-model="tableUtil.module.model.permissionType" label="Menu" border>Menu</el-radio>-->
          <!--          </el-form-item>-->
          <el-form-item label="权限菜单" prop="permissionType">
            <el-select class="jz-input" v-model="tableUtil.module.model.permissionType" style="width: 100%">
              <el-option label="供应商/企业/采购员菜单" :value="1"></el-option>
              <el-option label="后台管理员菜单" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称" prop="permissionName">
            <el-input class="jz-input" v-model="tableUtil.module.model.permissionName"
                      :disabled="!tableUtil.table.isAdd"/>
          </el-form-item>
          <el-form-item label="上级权限" prop="pid">
            <el-select class="jz-input" v-model="tableUtil.module.model.pid" placeholder=""
                       :disabled="!tableUtil.table.isAdd" style="width: 100%">
              <el-option-group>
                <el-option :key="0" label="==ROOT==" :value="0"></el-option>
              </el-option-group>
              <el-option-group
                  v-for="item in tableUtil.table.tableData"
                  :key="item.id">
                <el-option :key="item.id"
                           :label="item.permissionName"
                           :value="item.id"></el-option>
                <el-option
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    :label="' ├─ ' + subItem.permissionName"
                    :value="subItem.id">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="权限标识" prop="permissionCode">
            <el-input class="jz-input" v-model="tableUtil.module.model.permissionCode"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select class="jz-input" v-model="tableUtil.module.model.status" style="width: 100%">
              <el-option label="正常" :value="0"></el-option>
              <el-option label="锁定" :value="1"></el-option>
            </el-select>
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
import TableTreeUtil from '@/assets/management/js/TableTreeUtil'
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: 'Permission',
  data() {
    let validatePermissionName = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('名称不能为空'))
      } else {
        if (this.tableUtil.table.isAdd) {
          this.$api.management.system.permission.checkPermissionExist(value).then((result) => {
            if (result.data) {
              callback(new Error('该权限名称已经存在'))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
    };
    return {
      form: {
        formRules: {
          permissionName: [
            {required: true, validator: validatePermissionName, trigger: 'blur'}
          ],
          pid: [
            {required: true, message: '上级权限不能为空', trigger: 'blur'}
          ],
          permissionCode: [
            {required: true, message: '权限标识不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          permissionType: [
            {required: true, message: '权限菜单不能为空', trigger: 'blur'}
          ],
        }
      },
      tableUtil: {}
    }
  },
  created() {
    this.tableUtil = new TableTreeUtil(this.$api.management.system.permission, {}, '权限');
  },
  methods: {
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    add() {
      this.tableUtil.add();
      this.tableUtil.filter = {};
      this.tableUtil.initTable()
    },
    update() {
      this.tableUtil.update();
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save();
        }
      })
    },
    // 格式化创建时间
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    doSearch() {
      this.tableUtil.initTable()
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
  .jz-module-title{
    margin-bottom: 10px;
  }
</style>
