<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>Api管理</span>
      <span>/</span>
      <span>Api Management</span>
    </div>
      <!--  Toolbar  -->
      <div class="jz-module-toolbar-admin">
        <div>
          <el-button size="mini" type="primary" plain @click="add()">添加</el-button>
          <el-button size="mini" type="primary" plain @click="update()">修改</el-button>
          <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>
        </div>
      </div>
      <!--  Table  -->
      <div class="jz-module-table-admin">
        <el-table highlight-current-row
                  @row-click="selectedRow"
                  :data="tableUtil.table.tableData"
                  row-key="id"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="apiName" label="Api名称"/>
          <el-table-column prop="permissionName" label="关联权限"/>
          <el-table-column prop="apiPath" label="菜单路径" width="200"/>
          <el-table-column prop="requestMethod" label="请求方式"/>
          <el-table-column prop="pathRegex" label="路径正则"/>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{scope.row.status === 0 ? "正常" : "失效"}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" :formatter="formatTime" width="180"/>
        </el-table>
      </div>
      <!--  Form  -->
      <div class="jz-form">
        <el-dialog :title= "tableUtil.form.title" :visible.sync="tableUtil.form.visible" destroy-on-close width="666px">
          <el-form :model="tableUtil.module.model" ref="form" :rules="form.formRules" label-width="80px" @submit.native.prevent>
            <el-form-item label="API名称" prop="apiName">
              <el-input class="jz-input" v-model="tableUtil.module.model.apiName" :disabled="!tableUtil.table.isAdd"/>
            </el-form-item>
            <el-form-item label="关联权限" prop="permissionId">
              <el-cascader :options="form.permissionList" :props="form.props" v-model="tableUtil.module.model.permissionId" :show-all-levels="false" style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item label="Api路径"  prop="apiPath">
              <el-input class="jz-input" v-model="tableUtil.module.model.apiPath"></el-input>
            </el-form-item>
            <el-form-item label="路径正则"  prop="pathRegex">
              <el-input class="jz-input" v-model="tableUtil.module.model.pathRegex"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="requestMethod">
              <el-select class="jz-input" v-model="tableUtil.module.model.requestMethod" style="width: 100%">
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select class="jz-input" v-model="tableUtil.module.model.status" style="width: 100%">
                <el-option label="正常" :value="0"></el-option>
                <el-option label="失效" :value="1"></el-option>
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
import iconList from '@/assets/management/js/el-icon'
import TableTreeUtil from '@/assets/management/js/TableTreeUtil'
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: 'Api',
  data () {
    return {
      form: {
        permissionList: [],
        props: {
          label: 'permissionName',
          value: 'id'
        }
      },
      dialog: {
        visible: false,
        iconList: iconList
      },
      tableUtil: {}
    }
  },
  created () {
    this.tableUtil = new TableTreeUtil(this.$api.management.system.api, {}, 'Api');
    this.getPermissionList()
  },
  methods: {
    selectedRow (row) {
      this.tableUtil.selectedRow(row)
    },
    add () {
      this.tableUtil.add()
    },
    update () {
      this.tableUtil.update()
    },
    remove () {
      this.tableUtil.remove(null)
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.tableUtil.module.model.children;
          let length = this.tableUtil.module.model.permissionId.length;
          this.tableUtil.module.model.permissionId = this.tableUtil.module.model.permissionId[length - 1];
          this.tableUtil.save()
        }
      })
    },
    formatTime (row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    getPermissionList () {
      this.$api.management.system.permission.getApi().then(result => {
        this.form.permissionList = result.data;
        this.cleanChildren(this.form.permissionList)
      })
    },
    cleanChildren (list) {
      for (let item of list) {
        if (item.children.length > 0) {
          this.cleanChildren(item.children)
        } else {
          delete item['children'];
          // item.remove('children')
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
