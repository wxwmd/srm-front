import Vue from 'vue'
import Router from 'vue-router'
import Message from 'element-ui/packages/message'

const Index = () => import('@/views/Index');
const RegisterArtical = () => import('@/views/RegisterArtical');
const Register = () => import('@/views/Register');
const Login = () => import('@/views/Login');
const ForgetPassword = () => import('@/views/supplier/ForgetPassword');

const MainBoard = () => import('@/views/management/MainBoard');

const User = () => import('@/views/management/system/User');
const Role = () => import('@/views/management/system/Role');
const Menu = () => import('@/views/management/system/Menu');
const Api = () => import('@/views/management/system/Api');
const Permission = () => import('@/views/management/system/Permission');
const Dict = () => import('@/views/management/system/DictType.vue');
const DictData = () => import('@/views/management/system/DictData.vue');
const System = () => import('@/views/management/system/System.vue');
const TableConfig = () => import('@/views/management/system/TableConfig.vue');
const FiledConfig = () => import('@/views/management/system/FiledConfig.vue');
const SqlConfig = () => import('@/views/management/system/SqlConfig.vue');
const Template = () => import('@/views/management/system/Template.vue');
const LoginLog = () => import('@/views/management/system/LoginLog.vue');
const OperationLog = () => import('@/views/management/system/OperationLog.vue');

const Layout = () => import('@/views/supplier/Layout');
const SubLayout = () => import('@/views/supplier/SubLayout');
const Home = () => import('@/views/supplier/Home');
const Password = () => import('@/views/supplier/UpdatePassword');

const NewIssue =() => import('@/views/supplier/news/Issue');
const NewManagement =() => import('@/views/supplier/news/Management');
const News = () => import('@/views/supplier/news/List');
const NewsDetails = () => import('@/views/supplier/news/Details');
const Principle = () => import('@/views/supplier/admittance/Principle');
const Process = () => import('@/views/supplier/admittance/Process');
const ManagementDetails = () => import('@/views/supplier/news/ManagementDetails');

const InformationIssue = () => import('@/views/supplier/information/Issue');
const InformationReply = () => import('@/views/supplier/information/Reply');
const InformationInquire = () => import('@/views/supplier/information/Inquire');
const InformationDetails = () => import('@/views/supplier/information/Details');

const CollNotify = () => import('@/views/supplier/collaboration/Notify');
const CollChange = () => import('@/views/supplier/collaboration/Change');
const CollClaim = () => import('@/views/supplier/collaboration/Claim');
const CollAssembly = () => import('@/views/supplier/collaboration/Assembly');
const CollTechnicalData = () => import('@/views/supplier/collaboration/TechnicalData');
const CollFrequentlyData = () => import('@/views/supplier/collaboration/FrequentlyData');
const CollTechnicalExchange = () => import('@/views/supplier/collaboration/TechnicalExchange');

const PlanOverview = () => import('@/views/supplier/procurement/plan/Overview');
const PlanDoubleWeek = () => import('@/views/supplier/procurement/plan/DoubleWeek');
const PlanSixRequirement = () => import('@/views/supplier/procurement/plan/SixRequirement');
const PlanThirteenWeek = () => import('@/views/supplier/procurement/plan/ThirteenWeek');


const InfoInventory = () => import('@/views/supplier/procurement/infoMaintenance/Inventory');
const InfoImport = () => import('@/views/supplier/procurement/infoMaintenance/Import');
const InfoProductionPlan = () => import('@/views/supplier/procurement/infoMaintenance/ProductionPlan');
const InfoOrderConfirm = () => import('@/views/supplier/procurement/infoMaintenance/OrderConfirm');
const InfoOrderStatus = () => import('@/views/supplier/procurement/infoMaintenance/OrderStatus');
const InfoReplan = () => import('@/views/supplier/procurement/infoMaintenance/Replan');
const InfoAdjust = () => import('@/views/supplier/procurement/infoMaintenance/Adjust');
const InfoBasicsData = () => import('@/views/supplier/procurement/infoMaintenance/BasicsData');
const InfoShippingOrder = () => import('@/views/supplier/procurement/infoMaintenance/ShippingOrder');
const InfoUpShipping= () => import('@/views/supplier/procurement/infoMaintenance/UpShipping');
const InfoShipping = () => import('@/views/supplier/procurement/infoMaintenance/Shipping');

const InvConsignment = () => import('@/views/supplier/procurement/inventory/Consignment');
const InvSettlement = () => import('@/views/supplier/procurement/inventory/Settlement');
const InvWarehousing = () => import('@/views/supplier/procurement/inventory/Warehousing');
const InvOutsourcing = () => import('@/views/supplier/procurement/inventory/Outsourcing');

const FinanceInvoicing = () => import('@/views/supplier/procurement/finance/Invoicing');
const FinanceBill = () => import('@/views/supplier/procurement/finance/Bill');
const FinanceConsignmentInvoicing = () => import('@/views/supplier/procurement/finance/ConsignmentInvoicing');
const FinanceConsignmentBill = () => import('@/views/supplier/procurement/finance/ConsignmentBill');
const FinanceRebate = () => import('@/views/supplier/procurement/finance/Rebate');
const FinanceActualPayment = () => import('@/views/supplier/procurement/finance/ActualPayment');
const FinanceBalance = () => import('@/views/supplier/procurement/finance/Balance');
const FinanceAccount = () => import('@/views/supplier/procurement/finance/Account');

const Loading = () => import('@/views/supplier/procurement/Loading');
const ReturnedPurchase = () => import('@/views/supplier/procurement/ReturnedPurchase');

const QualityExperiment = () => import('@/views/supplier/quality/Experiment');
const QualityFeedbackForm = () => import('@/views/supplier/quality/FeedbackForm');
const QualityFactoryReport = () => import('@/views/supplier/quality/FactoryReport');
const QualityInformation = () => import('@/views/supplier/quality/QualityInformation');

const Material = () => import('@/views/supplier/material/Material.vue');

const RegisterAudit = () => import('@/views/supplier/registerAudit/RegisterAudit.vue');

Vue.use(Router);

const routes = [
  {path: '/', redirect: '/index'},
  {path: '/index', component: Index, meta: {auth: false, title: '??????'}},
  {path: '/login', component: Login, meta: {auth: false, title: '??????'}},
  {path: '/registerArtical', component: RegisterArtical, meta: {auth: false, title: '????????????'}},
  {path: '/register', component: Register, meta: {auth: false, title: '??????'}},
  {path: '/forgetPassword', component: ForgetPassword, meta: {auth: false, title: '????????????'}},
  {
    path: '/admin',
    component: MainBoard,
    children: [
      {path: '', redirect: '/admin/user', meta: {auth: true, title: '????????????'}},
      {path: 'user', component: User, meta: {auth: true, title: '????????????'}},
      {path: 'role', component: Role, meta: {auth: true, title: '????????????'}},
      {path: 'permission', component: Permission, meta: {auth: true, title: '????????????'}},
      {path: 'menu', component: Menu, meta: {auth: true, title: '????????????'}},
      {path: 'api', component: Api, meta: {auth: true, title: 'Api??????'}},
      {path: 'dict', component: Dict, meta: {auth: true, title: '????????????'}},
      {path: 'dictData:id', component: DictData, meta: {requireAuth: true, title: '????????????'}},
      {path: 'system', component: System, meta: {requireAuth: true, title: '????????????'}},
      {path: 'tableConfig', component: TableConfig, meta: {requireAuth: true, title: '???????????????'}},
      {path: 'filedConfig', component: FiledConfig, meta: {requireAuth: true, title: '???????????????'}},
      {path: 'sqlConfig', component: SqlConfig, meta: {requireAuth: true, title: '?????????SQL??????'}},
      {path: 'template', component: Template, meta: {requireAuth: true, title: '????????????'}},
      {path: 'login/log', component: LoginLog, meta: {requireAuth: true, title: '????????????'}},
      {path: 'operation/log', component: OperationLog, meta: {requireAuth: true, title: '????????????'}},
    ]
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {path: '', component: Home, meta: {auth: true, title: '??????'}},
    ]
  },
  {
    path: '/password',
    component: Layout,
    children: [
      {path: '', component: Password, meta: {auth: true, title: '????????????'}},
    ]
  },
  {
    path: '/news/list',
    component: Layout,
    children: [
      {path: '', component: News, meta: {requireAuth: true, title: '????????????'}},
      {path: ':id', component: NewsDetails, meta: {requireAuth: true, title: '????????????'}},
    ]
  },
  {
    path: '/news/management',
    component: SubLayout,
    children: [
      {path: '', component: NewManagement, meta: {requireAuth: true, title: '????????????'}},
      {path: 'issue', component: NewIssue, meta: {requireAuth: true, title: '????????????'}},
      {path: ':id', component: ManagementDetails, meta: {requireAuth: true, title: '????????????'}}
    ]
  },
  {
    path: '/admittance',
    component: Layout,
    children: [
      {path: 'principle', component: Principle, meta: {requireAuth: true, title: '????????????'}},
      {path: 'process', component: Process, meta: {requireAuth: true, title: '????????????'}},
    ]
  },
  {
    path: '/information',
    component: SubLayout,
    children: [
      {path: '', redirect: '/information/reply'},
      {path: 'issue', component: InformationIssue, meta: {requireAuth: true, title: '????????????'}},
      {path: 'reply', component: InformationReply, meta: {requireAuth: true, title: '???????????????'}},
      {path: 'inquire', component: InformationInquire, meta: {requireAuth: true, title: '????????????'}},
      {path: ':id', component: InformationDetails, meta: {requireAuth: true, title: '????????????'}},
    ]
  },
  {
    path: '/collaboration',
    component: SubLayout,
    children: [
      {path: '', redirect: '/collaboration/notify'},
      {path: 'notify', component: CollNotify, meta: {requireAuth: true, title: '?????????????????????'}},
      {path: 'change', component: CollChange, meta: {requireAuth: true, title: '??????????????????????????????'}},
      {path: 'claim', component: CollClaim, meta: {requireAuth: true, title: '??????????????????'}},
      {path: 'assembly', component: CollAssembly, meta: {requireAuth: true, title: '???????????????'}},
      {path: 'technicalData', component: CollTechnicalData, meta: {requireAuth: true, title: '??????????????????'}},
      {path: 'frequentlyData', component: CollFrequentlyData, meta: {requireAuth: true, title: '??????????????????'}},
      {path: 'technicalExchange', component: CollTechnicalExchange, meta: {requireAuth: true, title: '??????????????????'}}
    ]
  },
  {
    path: '/procurement',
    component: SubLayout,
    children: [
      // ??????????????????
      {path: '', redirect: '/procurement/plan/overview'},
      {path: 'plan/overview', component: PlanOverview, meta: {requireAuth: true, title: '????????????'}},
      {path: 'plan/sixRequirement', component: PlanSixRequirement, meta: {requireAuth: true, title: '2+4???????????????'}},
      {path: 'plan/thirteenWeek', component: PlanThirteenWeek, meta: {requireAuth: true, title: '???????????????????????????'}},
      {path: 'plan/doubleWeek', component: PlanDoubleWeek, meta: {requireAuth: true, title: '?????????????????????'}},
      // ???????????????????????????
      {path: 'infoMaintenance/inventory', component: InfoInventory, meta: {requireAuth: true, title: '?????????????????????'}},
      {path: 'infoMaintenance/import', component: InfoImport, meta: {requireAuth: true, title: '?????????????????????'}},
      {path: 'infoMaintenance/productionPlan', component: InfoProductionPlan, meta: {requireAuth: true, title: '???????????????????????????'}},
      {path: 'infoMaintenance/orderConfirm', component: InfoOrderConfirm, meta: {requireAuth: true, title: '??????????????????'}},
      {path: 'infoMaintenance/orderStatus', component: InfoOrderStatus, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'infoMaintenance/replan', component: InfoReplan, meta: {requireAuth: true, title: '??????????????????????????????'}},
      {path: 'infoMaintenance/adjust', component: InfoAdjust, meta: {requireAuth: true, title: '??????????????????'}},
      {path: 'infoMaintenance/basicsData', component: InfoBasicsData, meta: {requireAuth: true, title: '???????????????????????????'}},
      {path: 'infoMaintenance/shippingOrder', component: InfoShippingOrder, meta: {requireAuth: true, title: '?????????????????????????????????'}},
      {path: 'infoMaintenance/upShipping', component: InfoUpShipping, meta: {requireAuth: true, title: '????????????????????????????????????'}},
      {path: 'infoMaintenance/shipping', component: InfoShipping, meta: {requireAuth: true, title: '????????????????????????????????????'}},
      // ??????????????????
      {path: 'inventory/consignment', component: InvConsignment, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'inventory/settlement', component: InvSettlement, meta: {requireAuth: true, title: '???????????????????????????'}},
      {path: 'inventory/warehousing', component: InvWarehousing, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'inventory/outsourcing', component: InvOutsourcing, meta: {requireAuth: true, title: '????????????????????????'}},
      // ??????????????????
      {path: 'finance/invoicing', component: FinanceInvoicing, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'finance/bill', component: FinanceBill, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'finance/consignment/invoicing', component: FinanceConsignmentInvoicing, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'finance/consignment/bill', component: FinanceConsignmentBill, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'finance/rebate', component: FinanceRebate, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'finance/payment', component: FinanceActualPayment, meta: {requireAuth: true, title: '????????????????????????'}},
      {path: 'finance/balance', component: FinanceBalance, meta: {requireAuth: true, title: '????????????'}},
      {path: 'finance/account', component: FinanceAccount, meta: {requireAuth: true, title: '?????????'}},
      // ?????????????????????
      {path: 'loading', component: Loading, meta: {requireAuth: true, title: '??????????????????????????????'}},
      // ??????????????????
      {path: 'returned/purchase', component: ReturnedPurchase, meta: {requireAuth: true, title: '??????????????????'}},
    ]
  },
  {
    path: '/quality',
    component: SubLayout,
    children: [
      {path: '', redirect: '/quality/experiment'},
      {path: 'experiment', component: QualityExperiment, meta: {requireAuth: true, title: '???????????????????????????'}},
      {path: 'feedback', component: QualityFeedbackForm, meta: {requireAuth: true, title: 'QM?????????'}},
      {path: 'factory', component: QualityFactoryReport, meta: {requireAuth: true, title: '??????????????????'}},
      {path: 'information', component: QualityInformation, meta: {requireAuth: true, title: '???????????????????????????'}}
    ]
  },
  {
    path: '/admittance',
    component: Layout,
    children: [
      {path: 'principle', component: Principle, meta: {requireAuth: true, title: '????????????'}},
      {path: 'process', component: Process, meta: {requireAuth: true, title: '????????????'}},
    ]
  },
  {
    path: '/material',
    component: SubLayout,
    children: [
      {path: '', component: Material, meta: {requireAuth: true, title: '????????????'}},
    ]
  },
  {
    path: '/register/audit',
    component: SubLayout,
    children: [
      {path: '', component: RegisterAudit, meta: {requireAuth: true, title: '?????????????????????'}},
    ]
  },
];

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// ???????????????????????????????????????????????????????????????????????????
router.beforeEach((to, from, next) => {
  document.title = to.matched[to.matched.length - 1].meta.title;
  let token = localStorage.getItem('jaezi-credential');
  let hasAuth = token !== null && token.length > 0;
  let needAuth = to.matched.some((record) => record.meta.auth);
  if (needAuth && !hasAuth) {
    next({path: '/login'})
  } else {
    next()
  }
  let user = localStorage.getItem('qy-supplier-platform-user');
  if (user !== null && user !== undefined){
    user = JSON.parse(user);
    if (user.type !== 2){
      if (to.path.indexOf("admin") >= 0) {
        Message.error('???????????????????????????????????????');
        next({path: '/login'})
      } else {
        next()
      }
    } else {
      if (to.path.indexOf("admin") === -1 && to.path !== '/login' && to.path !== '/index') {
        Message.error('???????????????????????????????????????');
        next({path: '/login'})
      } else {
        next()
      }
    }
  }
});

export default router
