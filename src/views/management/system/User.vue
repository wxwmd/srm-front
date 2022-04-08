<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>用户管理</span>
      <span>/</span>
      <span>User Management</span>
    </div>
    <!--  ToolBar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-button type="primary" size="mini" plain @click="add()">添加</el-button>
        <el-button type="primary" size="mini" plain @click="update()">修改</el-button>
        <el-button type="danger" size="mini" plain @click="remove()">删除</el-button>
        <el-button type="warning" size="mini" plain @click="resetPwd()">重置密码</el-button>
      </div>
    </div>
    <!--  Table  -->
    <div class="jz-module-table-admin">
      <el-table highlight-current-row
                :data="tableUtil.table.tableData"
                @row-click="selectedRow"
                style="width:100%">
        <el-table-column type="index" width="50"/>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="roleId" label="角色">
          <template slot-scope="scope">
            {{ getRoleName(scope.row.roleId) }}
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型">
          <template slot-scope="scope">
            {{ scope.row.userType === 0 ? "采购员" : (scope.row.userType === 1 ? '供应商' : (scope.row.userType === 2 ? '后台管理员' : (scope.row.userType === 3 ? '企业用户' : ''))) }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="150"/>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? "正常" : "锁定" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatTime"/>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button size="mini" :type="lockBtnStyle(scope.row)" @click="lockUser(scope.row)">
              {{ lockBtnContent(scope.row) }}
            </el-button>
          </template>
        </el-table-column>
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
      <el-dialog :title="tableUtil.form.title" :close-on-click-modal="false" :visible.sync="tableUtil.form.visible" destroy-on-close width="600px">
        <el-form :model="tableUtil.module.model" ref="form" :rules='form.formRules' label-width="80px"
                 label-position="left">
          <el-form-item label="用户名" prop="username">
            <el-input class="jz-input" v-model="tableUtil.module.model.username" :disabled="!tableUtil.table.isAdd"/>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="tableUtil.table.isAdd">
            <el-input class="jz-input" type="password" v-model="tableUtil.module.model.password" show-password/>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select class="jz-input" v-model="tableUtil.module.model.roleId" placeholder="" style="width: 100%">
              <el-option
                  v-for="item in form.roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select class="jz-input" v-model="tableUtil.module.model.userType" placeholder="" style="width: 100%">
              <el-option label="采购员" :value="0"></el-option>
              <el-option label="后台管理员" :value="2"></el-option>
              <el-option label="企业用户" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input class="jz-input" v-model="tableUtil.module.model.phone"/>
          </el-form-item>
          <el-form-item label="用户名称" prop="realName">
            <el-input class="jz-input" v-model="tableUtil.module.model.realName"/>
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
// import TableUtil from '@/assets/management/js/TableUtil'
import TableUtil from "@/assets/supplier/js/TableUtil";
import {formatDateTime} from '@/assets/management/js/Utils'

export default {
  name: 'User',
  data() {
    let validateUsername = (rule, value, callback) => {
      if (!this.tableUtil.table.isAdd) {
        callback()
      }
      if (value === '' || value === undefined) {
        callback(new Error('用户名不能为空'))
      } else if (value.length < 4 || value.length > 16) {
        callback(new Error('用户名长度在4到16个字符'))
      } else {
        this.$api.management.system.user.checkUserExist({'name': this.tableUtil.module.model.username}).then((result) => {
          if (result.code === 200) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      }
    };
    return {
      form: {
        formRules: {
          username: [
            {required: true, validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '角色不能为空', trigger: 'blur'}
          ],
          userType: [
            {required: true, message: '用户类型不能为空', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '用户名称不能为空', trigger: 'blur'}
          ]
        },
        roleList: [],
        realNameList: []
      },
      tableUtil: {},
      model: {},
    }
  },
  created() {
    this.tableUtil = new TableUtil(this.$api.management.system.user, {}, '用户');
    this.$api.management.system.role.getRole().then(result => {
      this.form.roleList = result.data;
    });
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
      this.tableUtil.add()
    },
    update() {
      this.tableUtil.update()
    },
    remove() {
      this.tableUtil.remove()
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.tableUtil.save()
        }
      })
    },
    formatTime(row, column, cellValue) {
      return formatDateTime(cellValue)
    },
    // 重置用户密码
    resetPwd() {
      if (!this.tableUtil.table.currentRow) {
        this.$message.warning('请先选择一条记录！');
        return
      }
      let id = this.tableUtil.table.currentRow.id;
      this.$api.management.system.user.resetUserPwd(id).then(() => {
        this.$message.success('重置成功，密码为123456')
      })
    },
    // 锁定与解锁用户
    lockUser(user) {
      if (user.status === 1) {
        user.status = 0;
        this.$api.management.system.user.unlockUser(user).then((result) => {
          if (result.code !== 200) {
            user.status = 1;
            this.$message.error(result.code + ':' + result.msg)
          }
        }).catch(() => {
          user.status = 1
        })
      } else {
        user.status = 1;
        this.$api.management.system.user.lockUser(user).then((result) => {
          if (result.code !== 200) {
            user.status = 0;
            this.$message.error(result.code + ':' + result.msg)
          }
        }).catch(() => {
          user.status = 0
        })
      }
    },
    lockBtnContent(user) {
      return user.status === 0 ? '锁定' : '解锁'
    },
    lockBtnStyle(user) {
      return user.status === 0 ? 'danger' : 'primary'
    },
    getRoleName(roleId) {
      for (let role of this.form.roleList) {
        if (role.id === roleId) {
          return role.roleName
        }
      }
    },
    // 导入excel文件
    excelImport() {
      this.tableUtil.upload.uploadName = 'file'
      this.tableUtil.module.apis.importApi = this.$api.supplier.system.import
      this.tableUtil.importCamera()
    },
    // 监听文件上传框
    controlUploadChange(e) {
      this.tableUtil.uploadChange(e)
    },
    templateExport() {
      this.tableUtil.form.currentApi = this.$api.supplier.system.templateExports
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
</style>
