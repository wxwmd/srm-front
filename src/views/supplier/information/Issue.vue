<template>
  <div class="jz-supplier-container">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="发件人" prop="sender" required>
        <el-input v-model="form.sender" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="收件人" prop="recipient" required>
        <el-select filterable v-model="form.recipient" placeholder="请选择收件人">
          <el-option
              v-for="(item,index) in recipientList"
              :key="index"
              :label="item.realName + '【' + item.username + '】'"
              :value="item.realName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="发布类型" prop="type">
        <el-select v-model="form.type" @input.native="filterData" placeholder="请选择发布类型">
          <el-option
              v-for="(item,index) in infoTypeList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传附件" prop="accessory">
        <el-upload
            action=""
            :on-remove="fileRemove"
            :auto-upload="false"
            :on-change="fileChange"
            ref="upload"
            :show-file-list="true">
          <el-button slot="trigger" size="small" type="primary">添加附件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            name="file"
            :headers="header"
            :show-file-list="false"
            list-type="picture"
            :multiple="false"
            :on-success="uploadSuccess">
        </el-upload>
        <quill-editor v-model="form.content" ref="myQuillEditor" :options="editorOption"
                      @change="changeQuillEditor"></quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('form','发布')">发布</el-button>
        <!--                <el-button type="info" @click="submit('form','暂存')">暂存</el-button>-->
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{header: 1}, {header: 2}], // 1、2 级标题
  [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表
  [{script: "sub"}, {script: "super"}], // 上标/下标
  [{indent: "-1"}, {indent: "+1"}], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{size: ["small", false, "large", "huge"]}], // 字体大小
  [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
  [{color: []}, {background: []}], // 字体颜色、字体背景颜色
  [{font: []}], // 字体种类
  [{align: []}], // 对齐方式
  ["clean"], // 清除文本格式
  ["image"] // 链接、图片、视频
];

import {addQuillTitle} from '@/assets/management/js/quill-title.js'

export default {
  name: 'issue',
  data() {
    return {
      form: {
        type: '',
        title: '',
        content: '',
      },
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            }
          }
        }
      },
      uploadUrl: "", // 这里写你要上传的图片服务器地址
      header: {
        credential: localStorage.getItem('jaezi-credential')
      },
      fileList: [],
      infoTypeList: [],
      recipientList: [],
      rules: {
        type: [
          {required: true, message: '发布类型不能为空', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'},
        ],
        content: [
          {required: true, message: '内容不能为空', trigger: 'blur'},
        ],
        sender: [
          {required: true, message: '发件人不能为空', trigger: 'blur'}
        ],
        recipient: [
          {required: true, message: '收件人不能为空', trigger: 'blur'}
        ],
      },
      infoType: 1,
      infoId: 0,
      claimId: 0,
      username: "",
    }
  },
  mounted() {
    addQuillTitle();
  },
  created() {
    this.uploadUrl = this.$api.management.system.resource.upload
    if (this.$route.query.infoType != undefined) {
      this.infoType = this.$route.query.infoType;
      this.infoId = this.$route.query.infoId;
      this.claimId = this.$route.query.id;
      this.username = this.$route.query.username;
    }
    this.getDict()
    this.getRecipient()
    this.form.sender = this.$store.state.user.realName;
  },
  methods: {
    changeQuillEditor() {
      this.$refs['form'].validateField('content');
    },
    uploadSuccess(res) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code === 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data.url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
    },
    submit(formName, status) {
      if (status === '暂存') {
        this.form.status = 0
      } else if (status === '发布') {
        this.form.status = 1
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contentSize = this.form.content.length / 1024 / 1024;
          if (contentSize > 5) {
            this.$message.error('内容不得超过5M');
            return;
          }

          if (this.fileList.length == 0) {
            this.infoSubmit(status);
          } else {
            let formData = new FormData();
            // eslint-disable-next-line no-unused-vars
            let fileList = this.fileList;
            for (let index in fileList) {
              let size = fileList[index].size / 1024 / 1024;
              if (size > 10) {
                this.$message.error('文件【' + fileList[index].name + '】大小不得超过10M');
                return;
              }
              formData.append(fileList[index].uid, fileList[index].raw);
            }

            this.$api.supplier.information.batchUpLoad(formData).then(result => {
              if (result.code === 200) {
                this.form.accessoryCollection = JSON.stringify(result.data);
                this.infoSubmit(status);
              } else {
                this.$message.error(result.code + ':' + result.msg)
              }
            })
          }
        }
      })
    },
    fileChange(file, fileList) {
      this.fileList = fileList;
    },
    fileRemove(file, fileList) {
      this.fileList = fileList;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getDict() {
      this.$api.supplier.system.dict('infoType').then(res => {
        if (res.code === 200) {
          let infoType = this.infoType;
          this.infoTypeList = res.data.filter(function (value) {
            return parseInt(value.dictValue) === parseInt(infoType);
          })
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    getRecipient() {
      let userType = this.$store.state.user.type;
      let username = this.username;
      let filter = {};
      filter.realName = this.$store.state.user.realName;
      filter.infoUserType = userType;
      filter.status = 0;
      this.$api.management.system.user.getAll(filter).then(res => {
        if (res.code === 200) {
          if (username) {
            if (userType == 0 || userType == 3) {
              this.recipientList = res.data.records
            } else {
              this.recipientList = res.data.records.filter(function (value) {
                return value.username === username;
              })
            }
          } else {
            this.recipientList = res.data.records
          }
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    },
    infoSubmit(status) {
      let infoType = this.infoType;
      if (parseInt(infoType) === 3) {
        this.form.infoId = this.infoId;
        this.form.claimId = this.claimId;
      }
      this.$api.supplier.information.add(this.form).then(result => {
        if (result.code === 200) {
          this.$message.success(status + '成功')
          this.$refs.upload.clearFiles();
          this.resetForm('form');
          if (parseInt(infoType) === 3) {
            this.$router.push({path: '/collaboration/claim'})
          }
          if (parseInt(infoType) === 2) {
            this.$router.push({path: '/collaboration/notify'})
          }
          if (parseInt(infoType) === 1) {
            this.$router.push({path: '/information/inquire'})
          }
        } else {
          this.$message.error(result.code + ':' + result.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form {
  padding-top: 10px;
  width: 100%;
}

/deep/ .el-select .el-input__inner {
  width: 100% !important;
}

/deep/ .el-input__inner {
  width: 100%;
}

/deep/ .el-form-item__label {
  font-size: 14px;
}

/deep/ .ql-editor, /deep/ .ql-blank {
  min-height: 265px;
}

/deep/ .ql-editor > p {
  font-size: 14px;
}

/deep/ .el-select {
  width: 100%;
}

/deep/ .ql-snow .ql-picker {
  height: 40px;
}

/deep/ .avatar-uploader {
  line-height: 0;
}

/deep/ .el-upload {
  width: 80px;
}
</style>
