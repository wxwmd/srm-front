import ajax from './ajax'

let api = {
  authc: {
    login: data => ajax.post('/login', data),
    logout: () => ajax.post('/logout'),
    register: data => ajax.post('/register', data),
  },
  management: {
    system: {
      user: {
        getAll: data => ajax.get('/sys/user', data),
        add: data => ajax.post('/sys/user', data),
        update: data => ajax.put('/sys/user', data),
        remove: id => ajax.delete('/sys/user/' + id),
        resetUserPwd: id => ajax.put('/sys/user/'+ id + '/pwd'),
        updatePassword: data => ajax.put('/sys/user/password', data),
        lockUser: data => ajax.put('/sys/user/lock', data),
        unlockUser: data => ajax.put('/sys/user/unlock', data),
        checkUserExist: data => ajax.get('/sys/user/check/name', data)
      },
      role: {
        getAll: data => ajax.get('/sys/role', data),
        add: data => ajax.post('/sys/role/permission', data),
        update: data => ajax.put('/sys/role/permission', data),
        remove: id => ajax.delete('/sys/role/' + id),
        checkRoleExist: data => ajax.get('/sys/role/name/' + data),
        getRole: data => ajax.get('/sys/role/supplier/not', data),
      },
      permission: {
        getAll: data => ajax.get('/sys/permission', data),
        getTree: data => ajax.get('/sys/permission/tree', data),
        add: data => ajax.post('/sys/permission', data),
        update: data => ajax.put('/sys/permission', data),
        remove: id => ajax.delete('/sys/permission/' + id),
        checkPermissionExist: data => ajax.put('/sys/permission/check/name', data),
        getPermissionForRole: id => ajax.get('/sys/permission/role/' + id),
        getMenu: () => ajax.get('/sys/permission/menu'),
        getApi: () => ajax.get('/sys/permission/api')
      },
      menu: {
        getAll: data => ajax.get('/sys/resource/menu', data),
        getTree: data => ajax.get('/sys/resource/menu/tree', data),
        add: data => ajax.post('/sys/resource/menu', data),
        update: data => ajax.put('/sys/resource/menu', data),
        remove: id => ajax.delete('/sys/resource/menu/' + id),
        getMenuTreeForRole: id => ajax.get('/sys/resource/menu/role/' + id)
      },
      api: {
        getAll: data => ajax.get('/sys/resource/api', data),
        getTree: data => ajax.get('/sys/resource/api/tree', data),
        add: data => ajax.post('/sys/resource/api', data),
        update: data => ajax.put('/sys/resource/api', data),
        remove: id => ajax.delete('/sys/resource/api/' + id)
      },
      resource: {
        getAll: data => ajax.get('/sys/resource', data),
        update: data => ajax.put('/sys/resource', data),
        upload: ajax.baseUrl + '/upload',
      },
      dictType:{
        getAll: data => ajax.get('/sys/dict/type', data),
        add: data => ajax.post('/sys/dict/type', data),
        update: data => ajax.put('/sys/dict/type', data),
        remove: id => ajax.delete('/sys/dict/type/' + id),
        refreshCache: data => ajax.get('/sys/dict/refresh', data),
      },
      dictData:{
        getAll: data => ajax.get('/sys/dict/data', data),
        add: data => ajax.post('/sys/dict/data', data),
        update: data => ajax.put('/sys/dict/data', data),
        remove: id => ajax.delete('/sys/dict/data/' + id)
      },
      tableConfig:{
        getAll: data => ajax.get('/sys/table/config', data),
        add: data => ajax.post('/sys/table/config', data),
        update: data => ajax.put('/sys/table/config', data),
        remove: id => ajax.delete('/sys/table/config/' + id),
        templateExports: (responseType, data) => ajax.gets('/interface/erp/comm/server/template/exports',responseType, data),
        import: data => ajax.posts('/interface/erp/comm/server/import', data),
        docxExports: (responseType, data) => ajax.gets('/interface/erp/comm/server/docx/export',responseType, data),
      },
      filedConfig:{
        getAll: data => ajax.get('/sys/filed/config', data),
        add: data => ajax.post('/sys/filed/config', data),
        update: data => ajax.put('/sys/filed/config', data),
        remove: id => ajax.delete('/sys/filed/config/' + id),
      },
      sqlConfig:{
        getAll: data => ajax.get('/sys/sql/config', data),
        add: data => ajax.post('/sys/sql/config', data),
        update: data => ajax.put('/sys/sql/config', data),
        remove: id => ajax.delete('/sys/sql/config/' + id),
        run: data => ajax.post('/sys/sql/config/manual/run', data),
      },
      template:{
        getAll: data => ajax.get('/syn/template', data),
        add: data => ajax.post('/syn/template', data),
        update: data => ajax.put('/syn/template', data),
        remove: id => ajax.delete('/syn/template/' + id),
        upload: ajax.baseUrl + '/syn/template/upload',
        download: (responseType, data) => ajax.gets('/syn/template/download',responseType, data),
      },
      loginLog: {
        getAll: data => ajax.get('/sys/user/log', data),
      },
      operationLog: {
        getAll: data => ajax.get('/sys/user/operate', data),
      }
    }
  },
  supplier: {
    system: {
      dict: data => ajax.get('/sys/dict/' + data),
      updatePassword: data => ajax.put('/sys/user/password', data),
      forgetPassword: data => ajax.put('/sys/user/forget', data),
      getAllSupplier: data => ajax.get('/sys/supplier/all', data),
      getSupplier: id => ajax.get('/sys/supplier/' + id),
      updateSupplier: data => ajax.put('/sys/supplier', data),
      import: data => ajax.posts('/sys/supplier/import', data),
      templateExports: (responseType, data) => ajax.gets('/sys/supplier/export',responseType, data),
      dataRefresh: data => ajax.get('/interface/erp/comm/server/refresh', data),
    },
    news: {
      getAll: data => ajax.get('/info/message', data),
      add: data => ajax.post('/info/message', data),
      update: data => ajax.put('/info/message', data),
      remove: id => ajax.delete('/info/message/' + id),
      getDetail: id => ajax.get('/info/message/' + id),
      getHomeNew: data => ajax.get('/info/message/newest', data),
      getTop: data => ajax.put('/info/message/top', data),
      getVisible: id => ajax.get('/info/message/mid/person/' + id),
    },
    information:{
      getAll: data => ajax.get('/info/communication', data),
      add: data => ajax.post('/info/communication', data),
      update: data => ajax.put('/info/communication', data),
      getDetail: id => ajax.get('/info/communication/' + id),
      batchUpLoad: data => ajax.post('/info/communication/upload/batch', data),
      singleDownLoad: (responseType,data) => ajax.gets('/info/communication/download',responseType, data),
      remove: id => ajax.delete('/info/communication/' + id)
    },
    collaboration: {
      change: {
        getAll: data => ajax.get('/syn/change', data),
        add: data => ajax.post('/syn/change', data),
        update: data => ajax.put('/syn/change', data),
        remove: id => ajax.delete('/syn/change/' + id),
        upload: ajax.baseUrl + '/syn/change/document/upload',
        download: (responseType, data) => ajax.gets('/syn/change/download',responseType, data),
      },
      claim: {
        getAll: data => ajax.get('/syn/claim', data),
        add: data => ajax.post('/syn/claim', data),
        update: data => ajax.put('/syn/claim', data),
        remove: id => ajax.delete('/syn/claim/' + id),
        getClaim: id => ajax.get('/syn/claim/' + id),
        upload: ajax.baseUrl + '/syn/claim/document/upload',
        download: (responseType, data) => ajax.gets('/syn/claim/download',responseType, data),
      },
      assembly: {
        getAll: data => ajax.get('/syn/aggregat', data),
        update: data => ajax.put('/syn/aggregat', data),
        export: (responseType, data) => ajax.gets('/syn/aggregat/export',responseType, data),
        upload: ajax.baseUrl + '/syn/aggregat/document/upload',
        download: (responseType, data) => ajax.gets('/syn/aggregat/download',responseType, data),
      },
      technical: {
        getAll: data => ajax.get('/syn/technical', data),
        add: data => ajax.post('/syn/technical', data),
        update: data => ajax.put('/syn/technical', data),
        getVisible: id => ajax.get('/syn/mid/technical/person/technicalDataId/' + id),
        upload: ajax.baseUrl + '/syn/technical/upload',
        download: (responseType, data) => ajax.gets('/syn/technical/download',responseType, data),
        bulkUpload: data => ajax.put('/syn/technical/batch/update/technicalData', data),
        batchUpLoad: data => ajax.post('/syn/technical/upload/multi', data)
      },
      materialsParameter: {
        getAll: data => ajax.get('/syn/design', data),
      },
      frequently:{
        getAll: data => ajax.get('/syn/frequently', data),
        add: data => ajax.post('/syn/frequently', data),
        update: data => ajax.put('/syn/frequently', data),
        remove: id => ajax.delete('/syn/frequently/' + id),
        getVisible: id => ajax.get('/syn/mid/frequently/person/frequentlyUsedDataId/' + id),
        upload: ajax.baseUrl + '/syn/frequently/upload',
        download: (responseType, data) => ajax.gets('/syn/frequently/download',responseType, data),
      },
      technicalExchange:{
        getAll: data => ajax.get('/syn/technical/information', data),
        add: data => ajax.post('/syn/technical/information', data),
        update: data => ajax.put('/syn/technical/information', data),
        remove: id => ajax.delete('/syn/technical/information/' + id),
        getVisible: id => ajax.get('/syn/mid/technicalInformation/person/technicalInformationId/' + id),
        upload: ajax.baseUrl + '/syn/technical/information/upload',
        download: (responseType, data) => ajax.gets('/syn/technical/information/download',responseType, data),
      }
    },
    procurement:{
      plan:{
        overview:{
          getAll: data => ajax.get('/bus/supply', data),
          getDeliver: data => ajax.get('/bus/synopsis', data),
          getDate: data => ajax.get('/bus/supply/time', data),
        },
        sixRequirement:{
          getAll: data => ajax.get('/bus/jun', data),
        },
        thirteenWeek:{
          getAll: data => ajax.get('/bus/thirteen', data),
        },
        doubleWeek:{
          getAll: data => ajax.get('/bus/fourteen', data),
        }
      },
      infoMaintenance:{
        inventory:{
          getAll: data => ajax.get('/bus/inventory', data),
        },
        import:{
          getAll: data => ajax.get('/bus/supplier/inventory', data),
          import: data => ajax.posts('/bus/supplier/inventory/import', data),
          export: (responseType, data) => ajax.gets('/bus/supplier/inventory/template/export',responseType, data),
        },
        productionPlan:{
          getAll: data => ajax.get('/bus/production/plan', data),
          import: data => ajax.posts('/bus/production/plan/import', data),
          export: (responseType, data) => ajax.gets('/bus/production/plan/template/export',responseType, data),
        },
        orderStatus:{
          getAll: data => ajax.get('/bus/purchase', data),
          update: data => ajax.put('/bus/purchase', data),
          getUnconfirmed: data => ajax.get('/bus/purchase/unconfirmed', data),
          export: (responseType, data) => ajax.gets('/bus/purchase/export',responseType, data),
          import: data => ajax.posts('/bus/purchase/import', data),
          templateExport: (responseType, data) => ajax.gets('/bus/purchase/template/export',responseType, data),
        },
        replan:{
          getAll: data => ajax.get('/bus/schedule', data),
          update: data => ajax.put('/bus/schedule', data),
          export: (responseType, data) => ajax.gets('/bus/schedule/export',responseType, data),
        },
        basicsData:{
          getAll: data => ajax.get('/bus/supplier', data),
          update: data => ajax.put('/bus/supplier', data),
        },
        shippingOrder:{
          getAll: data => ajax.get('/bus/loading/document/purchase', data),
          getData: ids => ajax.get('/bus/loading/document/purchase?' + ids),
        },
        shipping: {
          getAll: data => ajax.get('/bus/loading/document', data),
          update: data => ajax.put('/bus/loading/document', data),
          remove: id => ajax.delete('/bus/loading/document/' + id),
          upload: ajax.baseUrl + '/bus/loading/document/upload',
          download: (responseType, data) => ajax.gets('/bus/loading/document/download',responseType, data),
          addShipping: data => ajax.post('/bus/loading/document', data),
          getDetailHost: id => ajax.get('/bus/loading/document/' + id),
          getDetail: id => ajax.get('/bus/loading/document/' + id + '/details'),
        }
      },
      inventory:{
        consignment:{
          getAll: data => ajax.get('/bus/consignment/goodssdtr', data),
          getDetail: data => ajax.get('/bus/consignment/goodssdtr/particular', data),
        },
        settlement:{
          getAll: data => ajax.get('/bus/consignment/goodsclose/noticeletter', data),
        },
        warehousing:{
          getAll: data => ajax.get('/bus/direct/information', data),
        },
        outsourcing:{
          getAll: data => ajax.get('/bus/outsourcing/subcontract/inventory', data),
          export: (responseType, data) => ajax.gets('/bus/outsourcing/subcontract/inventory/export',responseType, data),
        }
      },
      finance:{
        invoicing:{
          getAll: data => ajax.get('bus/standard/invoice/out', data),
          verify: data => ajax.post('/bus/standard/invoice/out/verification', data),
          split: data => ajax.put('/bus/standard/invoice/split', data),
          combined: data => ajax.post('/bus/standard/invoice/merge', data),
          export: (responseType, data) => ajax.gets('/bus/standard/invoice/out/export',responseType, data),
          import: data => ajax.posts('/bus/standard/invoice/out/import', data),
          templateExport: (responseType, data) => ajax.gets('/bus/standard/invoice/out/template/export',responseType, data),
        },
        bill:{
          getAll: data => ajax.get('/bus/standard/invoice', data),
          update: data => ajax.put('/bus/standard/invoice', data),
          remove: id => ajax.delete('/bus/standard/invoice/' + id),
          audit: data => ajax.get('/bus/standard/invoice/audit', data),
          getInvoicing: data => ajax.get('/bus/standard/invoice/out/info', data),
        },
        consignmentInvoicing:{
          getAll: data => ajax.get('/bus/consignment/sales/invoice/out', data),
          getOutInvoicePeriod: data => ajax.get('/bus/consignment/sales/invoice/out/interval', data),
          consignmentSplit: data => ajax.put('/bus/consignment/sales/invoice/split', data),
          consignmentCombined: data => ajax.post('/bus/consignment/sales/invoice/merge', data),
          getTotal: data => ajax.post('/bus/consignment/sales/invoice/out/money', data),
          export: (responseType, data) => ajax.gets('/bus/consignment/sales/invoice/out/export',responseType, data),
        },
        consignmentBill:{
          getAll: data => ajax.get('/bus/consignment/sales/invoice', data),
          update: data => ajax.put('/bus/consignment/sales/invoice', data),
          remove: id => ajax.delete('/bus/consignment/sales/invoice/' + id),
          getInvoicing: data => ajax.get('/bus/consignment/sales/invoice/out/info', data),
        },
        actualPayment:{
          getAll: data => ajax.get('/bus/actual/payment', data),
        },
        balance:{
          getAll: data => ajax.get('/bus/book/balance', data),
          export: (responseType, data) => ajax.gets('/bus/book/balance/export',responseType, data),
        },
        account:{
          getAll: data => ajax.get('/bus/detail/account', data),
          export: (responseType, data) => ajax.gets('/bus/detail/account/export',responseType, data),
        },
        rebate:{
          add: data => ajax.post('/bus/rateRed/invoice', data),
        }
      },
      loading:{
        getAll: data => ajax.get('/bus/loading/direct/delivery', data),
        update: data => ajax.put('/bus/loading/direct/delivery', data),
        getDetail: id => ajax.get('/bus/loading/direct/delivery/' + id),
        getDetailList: data => ajax.get('/bus/loading/direct/delivery/detail', data),
      },
      returnedPurchase:{
        getAll: data => ajax.get('/bus/return', data),
      }
    },
    quality:{
      experiment:{
        getAll: data => ajax.get('/bus/supplier/report', data),
        add: data => ajax.post('/bus/supplier/report', data),
        update: data => ajax.put('/bus/supplier/report', data),
        remove: id => ajax.delete('/bus/supplier/report/' + id),
        upload: ajax.baseUrl + '/bus/supplier/report/upload',
        download: (responseType, data) => ajax.gets('bus/supplier/report/downloadFile',responseType, data),
      },
      feedbackForm:{
        getAll: data => ajax.get('/bus/qm/feedback/table', data),
        add: data => ajax.post('/bus/qm/feedback/table', data),
        update: data => ajax.put('/bus/qm/feedback/table', data),
        remove: id => ajax.delete('/bus/qm/feedback/table/' + id),
        getVisible: id => ajax.get('/bus/mid/qm/feedback/table/qmTableId/' + id),
        upload: ajax.baseUrl + '/bus/qm/feedback/table/upload',
        download: (responseType, data) => ajax.gets('/bus/qm/feedback/table/download',responseType, data),
      },
      qualityInformation:{
        getAll: data => ajax.get('/bus/supplier/quality/information', data),
        add: data => ajax.post('/bus/supplier/quality/information', data),
        update: data => ajax.put('/bus/supplier/quality/information', data),
        remove: id => ajax.delete('/bus/supplier/quality/information/' + id),
        getVisible: id => ajax.get('/bus/mid/supplier/quality/information/supplierQualityInformationId/' + id),
        upload: ajax.baseUrl + '/bus/supplier/quality/information/upload',
        download: (responseType, data) => ajax.gets('bus/supplier/quality/information/downloadFile',responseType, data),
      }
    },
    material: {
      getAll: data => ajax.get('/sys/material', data),
      add: data => ajax.post('/sys/material', data),
      update: data => ajax.put('/sys/material', data),
      remove: id => ajax.delete('/sys/material/' + id),
      import: data => ajax.posts('/sys/material/import', data),
      templateExports: (responseType, data) => ajax.gets('/sys/material/export',responseType, data),
    },
    registerAudit: {
      getAll: data => ajax.get('sys/supplier', data),
      update: data => ajax.put('sys/supplier', data),
    }
  }
};

export default api
