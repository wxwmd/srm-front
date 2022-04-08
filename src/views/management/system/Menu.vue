<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>菜单管理</span>
      <span>/</span>
      <span>Menu Management</span>
    </div>
      <!--  Toolbar  -->
<!--      <div class="jz-module-toolbar-admin">-->
<!--        <div>-->
<!--          <el-button size="mini" type="primary" plain @click="add()">添加</el-button>-->
<!--          <el-button size="mini" type="primary" plain @click="update()">修改</el-button>-->
<!--          <el-button size="mini" type="danger" plain @click="remove()">删除</el-button>-->
<!--        </div>-->
<!--      </div>-->
      <!--  Table  -->
      <div class="jz-module-table-admin">
        <el-table highlight-current-row
                  @row-click="selectedRow"
                  :data="tableUtil.table.tableData"
                  row-key="id"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="menuName" label="菜单名称"/>
          <el-table-column prop="permissionName" label="关联权限"/>
          <el-table-column prop="menuPath" label="菜单路径" width="200"/>
          <el-table-column prop="menuIcon" label="菜单图标" width="300">
            <template slot-scope="scope">
              <i :class="scope.row.menuIcon" class="jz-icon-in-table"></i>
              <span>{{scope.row.menuIcon}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="menuOrder" label="菜单顺序" width="80"/>
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
        <el-dialog :title= "tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close width="666px">
          <el-form :model="tableUtil.module.model" ref="form" :rules="form.formRules" label-width="80px" @submit.native.prevent>
            <el-form-item label="菜单名" prop="menuName">
              <el-input class="jz-input" v-model="tableUtil.module.model.menuName" :disabled="!tableUtil.table.isAdd"/>
            </el-form-item>
            <el-form-item label="上级菜单" prop="pid">
              <el-select class="jz-input" v-model="tableUtil.module.model.pid" placeholder="" :disabled="!tableUtil.table.isAdd" style="width: 100%">
                <el-option-group>
                  <el-option :key="0" label="==ROOT==" :value="0"></el-option>
                </el-option-group>
                <el-option-group
                  v-for="item in tableUtil.table.tableData"
                  :key="item.id">
                  <el-option :key="item.id"
                             :label="item.menuName"
                             :value="item.id"></el-option>
                    <el-option
                        v-for="subItem in item.children"
                        :key="subItem.id"
                        :label="' ├─ ' + subItem.menuName"
                        :value="subItem.id">
                    </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="关联权限" prop="permissionId">
              <el-select class="jz-input" v-model="tableUtil.module.model.permissionId" placeholder="" style="width: 100%">
                <el-option-group
                    v-for="item in form.permissionList"
                    :key="item.id">
                  <el-option :key="item.id" :label="item.permissionName" :value="item.id"></el-option>
                  <el-option-group
                      v-for="subItem in item.children"
                      :key="subItem.id">
                    <el-option :key="subItem.id" :label="' ├─ ' + subItem.permissionName" :value="subItem.id"></el-option>
                    <el-option
                      v-for="subMenu in subItem.children"
                      :key="subMenu.id"
                      :label="' ├─├─ ' + subMenu.permissionName"
                      :value="subMenu.id">
                    </el-option>
                  </el-option-group>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="顺序"  prop="menuOrder">
              <el-input class="jz-input" v-model="tableUtil.module.model.menuOrder"></el-input>
            </el-form-item>
            <el-form-item label="路径"  prop="menuPath">
              <el-input class="jz-input" v-model="tableUtil.module.model.menuPath"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select class="jz-input" v-model="tableUtil.module.model.status" style="width: 100%">
                <el-option label="正常" :value="0"></el-option>
                <el-option label="失效" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图标"  prop="menuIcon" class="jz-icon-btn">
              <i :class="tableUtil.module.model.menuIcon" class="jz-icon-form" v-if="hasIcon()"></i>
              <el-button type="primary" plain @click="dialog.visible = true">{{iconContent()}}</el-button>
            </el-form-item>
          </el-form>
          <div class="jz-form-btn">
            <el-button type="primary" plain @click="save('form')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!--  Dialog  -->
      <el-dialog title="选择图标" fullscreen :close-on-click-modal="false" :visible.sync="dialog.visible">
      <div class="jz-icon-list">
          <span v-for="icon in dialog.iconList" :key="icon" @click="selectOneIcon(icon)">
            <i :class="icon"></i>
          </span>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import iconList from '@/assets/management/js/el-icon'
import TableTreeUtil from '@/assets/management/js/TableTreeUtil'
import {formatDateTime} from '@/assets/management/js/Utils'
export default {
  name: 'Menu',
  data () {
    return {
      form: {
        permissionList: [],
        formRules: {
          menuName: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          pid: [
            {required: true, message: '上级菜单不能为空', trigger: 'blur'}
          ],
          permissionId: [
            {required: true, message: '关联权限不能为空', trigger: 'blur'}
          ],
          menuOrder: [
            {required: true, message: '顺序不能为空', trigger: 'blur'}
          ],
          menuPath: [
            {required: true, message: '路径不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          menuIcon: [
            {required: true, message: '图标不能为空', trigger: 'blur'}
          ]
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
    this.tableUtil = new TableTreeUtil(this.$api.management.system.menu, {}, '菜单')
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
      //将string类型转换为number类型，便于修改时回显
      if (this.tableUtil.table.currentRow !== null){
        this.tableUtil.table.currentRow.permissionId = parseInt(this.tableUtil.table.currentRow.permissionId)
      }
      this.tableUtil.update()
    },
    remove () {
      this.tableUtil.remove(null)
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.tableUtil.module.model.children;
          this.tableUtil.save()
        }
      })
    },
    formatTime (row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    selectOneIcon (icon) {
      this.tableUtil.module.model.menuIcon = icon;
      this.dialog.visible = false
    },
    hasIcon () {
      return this.tableUtil.module.model.menuIcon !== undefined
    },
    iconContent () {
      return this.tableUtil.module.model.menuIcon ? '重新选择' : '选择图标'
    },
    getPermissionList () {
      this.$api.management.system.permission.getMenu().then(result => {
        this.form.permissionList = result.data
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
  .jz-module-title{
    margin-bottom: 10px;
  }
  .jz-icon-list{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .jz-icon-list span{
    margin: 1px 2px;
    font-size: 30px;
    border: 1px solid #CCC;
  }
  .jz-icon-list span i{
    font-size: 30px;
    padding: 30px;
  }
  .jz-icon-list span i:hover{
    cursor: pointer;
    background-color: #EEE;
  }
  .jz-icon-form{
    padding: 10px;
    font-size: 20px;
    border: 1px solid #CCC;
    margin-right: 10px;
  }
  .jz-icon-in-table{
    font-size: 15px;
    margin-right: 10px;
  }
</style>
