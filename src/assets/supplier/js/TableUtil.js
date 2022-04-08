import Message from 'element-ui/packages/message'
import MessageBox from 'element-ui/packages/message-box'
import common from "@/assets/supplier/js/common";

class TableUtil {
  constructor (apis, model, moduleName, isQuery) {
    this.filter = {
      limit: 10,
      page: 1
    };
    this.table = {
      currentRow: null,
      tableData: [],
      total: 0,
      isAdd: true
    };
    this.form = {
      visible: false,
      title: '',
      currentApi: ''
    };
    this.module = {
      apis: apis,
      model: model,
      moduleName: moduleName
    };
    this.upload = {
      uploadName: '',
      visible: false,
      file: '',
      fileName: '文件支持：xls / xlsx，大小：<=2MB'
    };
    if(isQuery == undefined) {
      this.initTable()
    }
  }
  pageSizeChange (limit) {
    this.filter.limit = limit;
    this.initTable()
  }
  pageCurrentChange (page) {
    this.filter.page = page;
    this.initTable()
  }
  selectedRow (row) {
    this.table.currentRow = row
  }
  initTable () {
    let self = this;
    this.module.apis.getAll(this.filter).then(result => {
      if (result.code === 200) {
        let res = result.data;
        self.table.tableData = res.records;
        self.table.total = res.total
      } else {
        Message.error(result.msg)
      }
    })
  }
  add () {
    for (let k in this.module.model) {
      this.module.model[k] = ''
    }
    this.form.visible = true;
    this.form.title = '添加 ' + this.module.moduleName + ' 信息';
    this.table.isAdd = true;
    this.form.currentApi = this.module.apis.add;
  }
  update () {
    if (this.table.currentRow) {
      this.module.model = Object.assign({}, this.table.currentRow)
    } else {
      Message.error('请先选择一条记录！');
      return
    }
    this.form.visible = true;
    this.form.title = '修改 ' + this.module.moduleName + ' 信息';
    this.table.isAdd = false;
    this.form.currentApi = this.module.apis.update;
  }
  remove (success) {
    if (!this.table.currentRow) {
      Message.error('请先选择一条记录！');
      return
    }
    MessageBox.confirm('确认操作, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.module.apis.remove(this.table.currentRow.id).then(() => {
        if (this.table.total % 10 === 1) {
          this.filter.page = this.filter.page > 1 ? this.filter.page - 1 : 1;
        }
        this.initTable();
        this.table.currentRow = null
        if (success !== null && success !== undefined) {
          success()
        }
      })
    }).catch(() => {});
  }
  save () {
    this.form.visible = false;
    this.form.currentApi(this.module.model).then(result => {
      if (result.code === 200) {
        this.initTable()
      } else {
        Message({customClass: 'messageTip', type: 'error', message: result.msg })
      }
    })
  }
  export(){
    this.form.currentApi("blob",this.filter).then(res => {
      if(res.data.size > 0) {
        common.blobDownLoad(res);
      }else {
        Message.success('数据为空,无法导出');
      }
    })
  }
  // 导入excel文件
  importCamera() {
    if (this.upload.file === ''){
      Message.error('请先选择文件')
    } else {
      let self = this
      let FormDatas = new FormData()
      FormDatas.append(this.upload.uploadName, this.upload.file)
      let uploadUrl = this.module.apis.importApi
      uploadUrl(FormDatas).then((res) => {
        let result = res.data
        if (result.code === 200) {
          self.upload.visible = false
          Message.success('批量导入成功')
          // self.initData()
          self.initTable()
        } else {
          Message.error(result.code + ':' + result.msg)
        }
      })
    }
  }
  uploadChange(e) {
    let file = e.currentTarget.files[0]
    let fileName = file.name
    let suffix = fileName.substring(fileName.lastIndexOf('.'))
    if (suffix !== '.xls' && suffix !== '.xlsx') {
      Message.error('文件格式错误')
      return
    }
    if (file.size / 1024 / 1024 > 2) {
      Message.error('文件超出了2M')
      return
    }
    let simpleName = fileName.substring(0, fileName.lastIndexOf('.'))
    if (simpleName.length > 15) {
      simpleName = simpleName.substring(0, 12) + '...' + simpleName.substring(simpleName.length - 3, simpleName.length)
    }
    this.upload.fileName = simpleName + suffix
    this.upload.file = file
  }
}
export default TableUtil
