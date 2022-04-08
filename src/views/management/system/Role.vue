<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>角色管理</span>
      <span>/</span>
      <span>Role Management</span>
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
                :data="tableUtil.table.tableData"
                @row-click="selectedRow"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="roleName" label="名称"/>
        <el-table-column prop="roleType" label="角色类型" :formatter="formatterRole"/>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"/>
        <el-table-column prop="remark" label="描述"/>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close
                 width="800px">
        <el-form class="jz-form-body" :model="tableUtil.module.model" ref="form" :rules='form.formRules'
                 label-width="80px">
          <el-form-item label="名称" prop="roleName">
            <el-input class="jz-input" v-model="tableUtil.module.model.roleName" :disabled="!tableUtil.table.isAdd"/>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input class="jz-input" v-model="tableUtil.module.model.remark"/>
          </el-form-item>
          <el-form-item label="角色类型" prop="roleType">
            <el-select @change="roleTypeChange" class="jz-input" v-model="tableUtil.module.model.roleType"
                       style="width: 100%">
              <!--              <el-option label="供应商/企业" :value="1"></el-option>-->
              <!--              <el-option label="后台管理员" :value="2"></el-option>-->
              <el-option
                  v-for="(item,index) in roleTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="jz-form-item-group">
            <el-form-item label="菜单权限" prop="permissionIds">
              <el-tree show-checkbox check-strictly
                       :data="form.permission.menuTree"
                       node-key="id"
                       ref="menuTree"
                       highlight-current :props="form.permission.props" class="jz-form-item jz-card jz-tree">
              </el-tree>
            </el-form-item>
            <!--            <el-form-item label="Api权限" prop="permissionIds">
                          <el-tree show-checkbox
                                   :data="form.permission.apiTree"
                                   node-key="id"
                                   ref="apiTree"
                                   highlight-current :props="form.permission.props" class="jz-form-item jz-card jz-tree">
                          </el-tree>
                        </el-form-item>-->
          </div>
        </el-form>
        <div class="jz-form-btn">
          <el-button type="primary" plain @click="save('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TableUtil from '@/assets/management/js/TableUtil'
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: 'Role',
  data() {
    let validateRoleName = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('名称不能为空'))
      } else {
        if (this.tableUtil.table.isAdd) {
          this.$api.management.system.role.checkRoleExist(value).then((result) => {
            if (result.data) {
              callback(new Error('该角色名称已经存在'))
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
          roleName: [
            {required: true, validator: validateRoleName, trigger: 'blur'}
          ],
          roleType: [
            {required: true, message: '角色类型不能为空', trigger: 'blur'}
          ],
        },
        permission: {
          title: '',
          visible: false,
          model: {},
          menuTree: [],
          apiTree: [],
          props: {
            children: 'children',
            label: 'permissionName'
          }
        }
      },
      tableUtil: {},
      roleTypeList: [
        {value:'1',name:'后台管理员'},
        {value:'2',name:'正式供应商'},
        {value:'4',name:'采购员'},
        {value:'5',name:'企业人员'},
        {value:'6',name:'企业人员-新闻管理'}
      ]
    }
  },
  created() {
    // this.getDict();
    this.tableUtil = new TableUtil(this.$api.management.system.role, {}, '角色');
    // this.getPermissions()
  },
  methods: {
    pageSizeChange(limit) {
      this.tableUtil.pageSizeChange(limit)
    },
    pageCurrentChange(page) {
      this.tableUtil.pageCurrentChange(page)
    },
    selectedRow(row) {
      this.tableUtil.selectedRow(row)
    },
    add() {
      this.form.permission.menuTree = [];
      this.tableUtil.add()
    },
    update() {
      this.tableUtil.update();
      this.getPermissions();
      this.$api.management.system.permission.getPermissionForRole(this.tableUtil.table.currentRow.id).then(result => {
        this.tableUtil.table.currentRow.permissionIds = result.data;
        this.$nextTick(function () {
          this.$refs.menuTree.setCheckedKeys(this.tableUtil.table.currentRow.permissionIds);
          // this.$refs.apiTree.setCheckedKeys(this.tableUtil.table.currentRow.permissionIds)
        })
      });
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let permissionIds = this.$refs.menuTree.getCheckedKeys();
          // permissionIds.push(...this.$refs.apiTree.getCheckedKeys());
          this.tableUtil.module.model.permissionIds = permissionIds;
          this.tableUtil.save();
        }
      })
    },
    formatterRole(row, column, cellValue) {
      let roleTypeName = ''
      this.roleTypeList.forEach(type => {
        if (cellValue === type.value) {
          roleTypeName = type.name
        }
      })
      return roleTypeName
    },
    // 格式化创建时间
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    beforeClose(done) {
      // this.cleanVerifyMessage()
      this.$refs.menuTree.setCheckedKeys([]);
      // this.$refs.apiTree.setCheckedKeys([]);
      done()
    },
    getPermissions() {
      let filter = {};
      if (this.tableUtil.module.model.roleType == 1 || this.tableUtil.module.model.roleType == 7) {
        filter.permissionType = 2;
      } else {
        filter.permissionType = 1;
      }
      this.$api.management.system.permission.getTree(filter).then((result) => {
        if (result.code === 200) {
          this.form.permission.menuTree = [];
          for (let permission of result.data) {
            this.form.permission.menuTree.push(permission);
            // if (permission.permissionType === "Menu") {
            //   this.form.permission.menuTree.push(permission)
            // } else if (permission.permissionType === "Api") {
            //   this.form.permission.apiTree.push(permission)
            // }
          }
        } else {
          this.$message.error(result.code + ':' + result.msg)
        }
      })
    },
    roleTypeChange(value) {
      if (value) {
        this.getPermissions();
      }
    },
    // getDict() {
    //   this.$api.supplier.system.dict('roleType').then(res => {
    //     if (res.code === 200) {
    //       this.roleTypeList = res.data
    //     } else {
    //       this.$message.error(res.code + ':' + res.msg)
    //     }
    //   })
    // },
  }
}
</script>
<style scoped>
.jz-tree {
  height: 321px;
  overflow-y: auto;
}

.jz-form-item-group {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.jz-form-item-group > div {
  flex: 1;
}
</style>
