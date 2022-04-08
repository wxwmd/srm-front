<template>
  <div class="jz-container">
    <div class="jz-module-title">
      <span>系统设置</span>
      <span>/</span>
      <span>System</span>
    </div>
    <!--  ToolBar  -->
    <div class="jz-module-toolbar-admin">
      <div>
        <el-button size="mini" type="primary" plain @click="update()">修改</el-button>
      </div>
    </div>
    <div class="jz-system">
      <div class="jz-system-list">
        <span>部署运维平台名称：</span>
        <span>{{ system.adminName }}</span>
      </div>
      <div class="jz-system-list">
        <span>供应商平台名称：</span>
        <span>{{ system.webName }}</span>
      </div>
      <div class="jz-system-list jz-system-logo">
        <span>Logo：</span>
        <div class="jz-system-img">
          <img :src="system.logoUrl" alt="">
        </div>
      </div>
      <div class="jz-system-list jz-system-process">
        <span>准入流程图：</span>
        <div class="jz-system-img">
          <img :src="system.imageUrl" alt="">
        </div>
      </div>
    </div>
    <!--  Form  -->
    <div class="jz-form">
      <el-dialog :title="form.title" :close-on-click-modal="false" :visible.sync="form.visible" destroy-on-close width="600px">
        <el-form :model="form.model" ref="form" :rules='form.formRules' label-width="140px">
          <el-form-item label="部署运维平台名称" prop="adminName">
            <el-input class="jz-input" v-model="form.model.adminName"/>
          </el-form-item>
          <el-form-item label="供应商平台名称" prop="webName">
            <el-input class="jz-input" v-model="form.model.webName"/>
          </el-form-item>
          <el-form-item label="Logo" prop="logoUrl">
            <el-upload
                :action="form.uploadUrl"
                :headers="form.headers"
                :show-file-list="false"
                :limit="1"
                :on-success="uploadLogoSuccess" :before-upload="beforeUpload">
              <img v-if="form.model.logoUrl" :src="form.model.logoUrl" class="jz-update-img">
              <i v-else class="el-icon-plus jz-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="准入流程图" prop="imageUrl">
            <el-upload
                :action="form.uploadUrl"
                :headers="form.headers"
                :show-file-list="false"
                :limit="1"
                :on-success="uploadSuccess" :before-upload="beforeUpload">
              <img v-if="form.model.imageUrl" :src="form.model.imageUrl" class="jz-update-img">
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
export default {
  name: "System",
  data() {
    return {
      form: {
        title: '修改系统设置',
        visible: false,
        model: {
          adminName: '',
          webName: '',
          logoUrl: '',
          imageUrl: ''
        },
        formRules: {
          adminName: [
            {required: true, message: '部署运维平台名称不能为空', trigger: 'blur'}
          ],
          webName: [
            {required: true, message: '供应商平台名称不能为空', trigger: 'blur'}
          ],
          logoUrl: [
            {required: true, message: 'logo不能为空', trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: '准入流程图不能为空', trigger: 'blur'}
          ]
        },
        uploadUrl: '',
        headers: {
          credential: localStorage.getItem('jaezi-credential')
        }
      },
      system: {}
    }
  },
  created() {
    this.initData()
    this.form.uploadUrl = this.$api.management.system.resource.upload
  },
  methods: {
    initData() {
      let filter = {id: 1};
      this.$api.management.system.resource.getAll(filter).then(res => {
        if (res.code === 200) {
          let data = ''
          data = res.data.records[0].config
          this.system = JSON.parse(data)
        }
      })
    },
    update() {
      this.form.visible = true
      this.form.model = Object.assign({}, this.system)
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 上传成功事件
    uploadLogoSuccess(res) {
      this.form.model.logoUrl = res.data.url
    },
    uploadSuccess(res) {
      this.form.model.imageUrl = res.data.url
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let config = ''
          config = JSON.stringify(this.form.model)
          let data = {id: 1, config: config}
          this.$api.management.system.resource.update(data).then(res => {
            if (res.code === 200) {
              this.form.visible = false
              this.initData()
            } else {
              this.$message.error(res.code + ':' + res.msg)
            }
          })
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
.jz-system {
  margin: 0 0 10px;
  width: 100%;
  background-color: #FFF;
  border: 1px solid #DDD;
  padding: 20px;
}

.jz-system-list {
  width: 100%;
  display: flex;
  line-height: 40px;
}

.jz-system-list span {
  display: block;
  width: auto;
}

.jz-system-list span:first-child {
  text-align: right;
  font-weight: bold;
  width: 150px;
}

.jz-system-logo .jz-system-img {
  width: 150px;
  /*height: 300px;*/
  margin-top: 10px;
}

.jz-system-process .jz-system-img {
  width: 600px;
  /*height: 300px;*/
  margin-top: 10px;
}

.jz-system-img img {
  width: 100%;
  border: 1px solid #999;
  /*height: 100%;*/
}

/deep/ .el-upload {
  /*width: 100px;*/
  /*height: 100px;*/
  /*line-height: 100px;*/
  /*border: 1px solid #DCDFE6;*/
}

.jz-uploader-icon {
  font-size: 30px;
  color: #999;
  padding: 50px;
  border: 1px solid #DCDFE6;
}

.jz-update-img {
  width: 200px;
  border: 1px solid #DCDFE6;
}
</style>
