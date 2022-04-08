import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);

let localStorageKey = 'qy-supplier-platform-user';
const state = {
  system: JSON.parse(localStorage.getItem('qy-supplier-platform-system')) ||  {
    adminName: '',
    webName: '',
    logoUrl: '',
    imageUrl:'',
    version: 'v1.0'
  },
  user: JSON.parse(localStorage.getItem(localStorageKey)) || {
    userId: '',
    roleId: '',
    username: '',
    type:'',
    roleType: '',
    quota:'',//供应商限额
    realName:'',
    lastLoginTime:'',
    currentMenu: '0',
    currentSubMenu: [],
    menus: []
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions
});
export default store
