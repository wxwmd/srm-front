<template>
  <div class="jz-supplier-container">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="标题" prop="title" required>
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="发布类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择发布类型">
          <el-option label="企业新闻" :value="1"></el-option>
          <el-option label="企业公告" :value="2"></el-option>
          <el-option label="行业动态" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置可见性" prop="visible" v-if="form.type === 2">
        <el-select v-model="form.visible">
          <el-option label="所有企业用户和部分供应商" :value="0"></el-option>
          <el-option label="所有用户" :value="1"></el-option>
          <el-option label="企业用户" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择供应商" prop="visiblePersonList" v-if="form.visible === 0 && form.type === 2">
        <el-transfer
            filterable
            filter-placeholder="请输入供应商"
            :titles="['供应商列表', '可见供应商']"
            v-model="visiblePersonList"
            :data="supplierList">
        </el-transfer>
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
        <el-button v-if="show" type="info" @click="submit('form','暂存')">暂存</el-button>
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
  name: "Issue",
  data() {
    return {
      form: {
        type: '',
        title: '',
        content: '',
      },
      visiblePersonList: [],
      supplierList: [],
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
      rules: {
        type: [
          {required: true, message: '请选择发布类型', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'},
        ],
        visible: [
          { required: true, message: '可见性不能为空', trigger: 'blur' }
        ],
        content: [
          {required: true, message: '内容不能为空', trigger: 'blur'},
        ]
      },
      currentApi: '',
      show: true
    }
  },
  created() {
    this.uploadUrl = this.$api.management.system.resource.upload
    if (this.$route.query.id !== undefined) {
      this.show = false
      this.$api.supplier.news.getDetail(this.$route.query.id).then(res => {
        if (res.code === 200) {
          this.form = res.data
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
      this.$api.supplier.news.getVisible(this.$route.query.id).then(res => {
        if (res.code === 200) {
          res.data.forEach(person => {
            this.visiblePersonList.push(person.personId)
          })
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
    }
    this.getSupplier()
  },
  mounted() {
    addQuillTitle();
  },
  methods: {
    changeQuillEditor() {
      this.$refs['form'].validateField('content');
    },
    getSupplier() {
      this.$api.supplier.system.getAllSupplier().then(res => {
        if (res.code === 200) {
          res.data.forEach(item => {
            this.supplierList.push({label: item.username, key: item.userId})
          })
        } else {
          this.$message.error(res.code + ':' + res.msg)
        }
      })
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
      if (this.$route.query.id !== undefined) {
        this.currentApi = this.$api.supplier.news.update
      } else {
        this.currentApi = this.$api.supplier.news.add
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let contentSize = this.form.content.length / 1024 / 1024;
          if (contentSize > 5) {
            this.$message.error('内容不得超过5M');
            return;
          }

          let form = this.form;
          form.visiblePersonList = this.visiblePersonList;
          this.currentApi(form).then(result => {
            if (result.code === 200) {
              this.$message.success(status + '成功')
              this.$router.push({path: '/news/management/issue'});
              this.resetForm('form');
            } else {
              this.$message.error(result.code + ':' + result.msg)
            }
          })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>
.el-form {
  padding-top: 10px;
  width: 100%;
}

/deep/ .el-select {
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

/deep/ .ql-editor, .ql-blank {
  min-height: 380px;
}

/deep/ .ql-editor > p {
  font-size: 14px;
}

/deep/ .ql-snow .ql-picker {
  height: 40px;
}

/deep/ .avatar-uploader {
  line-height: 0;
}
</style>
