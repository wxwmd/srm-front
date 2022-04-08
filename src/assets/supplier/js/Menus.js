const Menus = [
  {
    id: '1',
    menuName: '首页',
    icon: 'el-icon-s-Home',
    url: '/home',
    children: []
  },
  {
    id: '2',
    menuName: '信息交流',
    icon: 'el-icon-s-Home',
    url: '/information/issue',
    children: [
      {
        id: '20',
        menuName: '信息发布',
        icon: 'el-icon-user-solid',
        url: '/information/issue'
      },{
        id: '21',
        menuName: '待回复信息',
        icon: 'el-icon-user-solid',
        url: '/information/reply'
      },{
        id: '22',
        menuName: '查询信息',
        icon: 'el-icon-user-solid',
        url: '/information/inquire'
      }
    ]
  },
  {
    id: '3',
    menuName: '供应商协同',
    icon: 'el-icon-s-Home',
    url: '/collaboration',
    children: [
      {
        id: '30',
        menuName: '进厂不合格通知',
        icon: 'el-icon-user-solid',
        url: '/collaboration/notify'
      },{
        id: '31',
        menuName: '供应商技术、厂址变更',
        icon: 'el-icon-user-solid',
        url: '/collaboration/change'
      },{
        id: '32',
        menuName: '索赔信息管理',
        icon: 'el-icon-user-solid',
        url: '/collaboration/claim'
      },{
        id: '33',
        menuName: '总成件组件',
        icon: 'el-icon-user-solid',
        url: '/collaboration/assembly'
      },{
        id: '34',
        menuName: '技术图档下载',
        icon: 'el-icon-user-solid',
        url: '/collaboration/technicalData'
      },{
        id: '35',
        menuName: '常用资料管理',
        icon: 'el-icon-user-solid',
        url: '/collaboration/frequentlyData'
      },{
        id: '36',
        menuName: '物料参数管理',
        icon: 'el-icon-user-solid',
        url: '/collaboration/materialsParameter'
      },{
        id: '37',
        menuName: '技术资料交流',
        icon: 'el-icon-user-solid',
        url: '/collaboration/technicalExchange'
      }
    ]
  },
  {
    id: '4',
    menuName: '采购业务',
    icon: 'el-icon-s-Home',
    url: '/procurement',
    children: [
      {
        id: '40',
        menuName: '计划信息查询',
        icon: 'el-icon-user-solid',
        url: '/procurement/plan/overview',
        children: [
          {
            id: '401',
            menuName: '供需总览',
            icon: 'el-icon-user-solid',
            url: '/procurement/plan/overview'
          },{
            id: '402',
            menuName: '2+4月需求计划',
            icon: 'el-icon-user-solid',
            url: '/procurement/plan/sixRequirement'
          },
          {
            id: '403',
            menuName: '未来十三周需求查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/plan/thirteenWeek'
          },{
            id: '404',
            menuName: '双周供需核查表',
            icon: 'el-icon-user-solid',
            url: '/procurement/plan/doubleWeek'
          }
        ]
      },{
        id: '41',
        menuName: '采购信息查询与维护',
        icon: 'el-icon-user-solid',
        url: '/procurement/infoMaintenance/inventory',
        children: [
          {
            id: '410',
            menuName: '供应商库存查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/inventory'
          },{
            id: '411',
            menuName: '供应商库存导入',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/import'
          },
          {
            id: '412',
            menuName: '供应商生产计划导入',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/productionPlan'
          }, {
            id: '413',
            menuName: '采购订单确认',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/orderConfirm'
          },{
            id: '414',
            menuName: '采购订单状态查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/orderStatus'
          },{
            id: '415',
            menuName: '再计划时间确认查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/replan'
          },{
            id: '416',
            menuName: '采购订单调整',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/adjust'
          },{
            id: '417',
            menuName: '供应商基础数据维护',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/basicsData'
          },{
            id: '418',
            menuName: '装车单维护（订单查询）',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/shippingOrder'
          },{
            id: '419',
            menuName: '装车单维护（维护装车单）',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/upShipping'
          },{
            id: '420',
            menuName: '装车单维护（查询装车单）',
            icon: 'el-icon-user-solid',
            url: '/procurement/infoMaintenance/shipping'
          }
        ]
      },{
        id: '42',
        menuName: '库存信息查询',
        icon: 'el-icon-user-solid',
        url: '/procurement/inventory/consignment',
        children: [
          {
            id: '421',
            menuName: '寄售物资结收发存',
            icon: 'el-icon-user-solid',
            url: '/procurement/inventory/consignment'
          }, {
            id: '422',
            menuName: '直送入库信息查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/inventory/warehousing'
          },{
            id: '423',
            menuName: '外协分包库存查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/inventory/outsourcing'
          }
        ]
      },{
        id: '43',
        menuName: '财务结算管理',
        icon: 'el-icon-user-solid',
        url: '/procurement/finance/invoicing',
        children: [
          {
            id: '430',
            menuName: '标准物资开票管理',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/invoicing'
          },{
            id: '431',
            menuName: '标准物资发票查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/bill'
          },
          {
            id: '432',
            menuName: '寄售物资开票管理',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/consignment/invoicing'
          },{
            id: '433',
            menuName: '寄售物资发票查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/consignment/bill'
          },{
            id: '434',
            menuName: '返利红字发票维护',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/rebate'
          },{
            id: '435',
            menuName: '实际付款情况查询',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/payment'
          },{
            id: '436',
            menuName: '账面余额',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/balance'
          },{
            id: '437',
            menuName: '明细账',
            icon: 'el-icon-user-solid',
            url: '/procurement/finance/account'
          }
        ]
      },{
        id: '44',
        menuName: '直送装车单查询与打印',
        icon: 'el-icon-user-solid',
        url: '/procurement/loading',
        children: []
      },{
        id: '45',
        menuName: '冻结积待退货',
        icon: 'el-icon-user-solid',
        url: '/procurement/returned/purchase',
        children: []
      }
    ]
  },
  {
    id: '5',
    menuName: '供应商质量管理',
    icon: 'el-icon-s-tools',
    url: '/quality/experiment',
    children: [
      {
        id: '51',
        menuName: '供应商实验报告管理',
        icon: 'el-icon-user-solid',
        url: '/quality/experiment',
        children: []
      },{
        id: '52',
        menuName: 'QM反馈单',
        icon: 'el-icon-user-solid',
        url: '/quality/feedback',
        children: []
      },{
        id: '53',
        menuName: '出厂报告查询',
        icon: 'el-icon-user-solid',
        url: '/quality/factory',
        children: []
      },{
        id: '54',
        menuName: '供应商质量信息查询',
        icon: 'el-icon-user-solid',
        url: '/quality/information',
        children: []
      }
    ]
  },
  {
    id: '6',
    menuName: '供应商管理',
    icon: 'el-icon-s-tools',
    url: '/system/user',
    children: [
      {
        id: '41',
        menuName: '用户管理',
        icon: 'el-icon-user-solid',
        url: '/system/user'
      }
    ]
  }
];

export default Menus
