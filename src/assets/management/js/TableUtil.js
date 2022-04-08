import Message from 'element-ui/packages/message'
import MessageBox from 'element-ui/packages/message-box'

class TableUtil {
  constructor (apis, model, moduleName) {
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
    this.initTable()
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
      this.module.apis.remove(this.table.currentRow.id).then(res => {
        if (res.code === 200){
          if (this.table.total % 10 === 1) {
            this.filter.page = this.filter.page > 1 ? this.filter.page - 1 : 1;
          }
          this.initTable();
          this.table.currentRow = null
          if (success !== null && success !== undefined) {
            success()
          }
        } else {
          Message.error(res.msg)
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
}
export default TableUtil
