let localStorageKey = 'qy-supplier-platform-user';
const mutations = {
  initSystem (state, systemInfo) {
    state.system.adminName = systemInfo.adminName;
    state.system.webName = systemInfo.webName;
    state.system.logoUrl = systemInfo.logoUrl;
    state.system.imageUrl = systemInfo.imageUrl;
    localStorage.setItem('qy-supplier-platform-system', JSON.stringify(state.system))
  },
  initUser (state, userInfo) {
    state.user.userId = userInfo.id;
    state.user.roleId = userInfo.roleId;
    state.user.username = userInfo.username;
    state.user.type = userInfo.userType;
    state.user.roleType = userInfo.roleType;
    state.user.quota = userInfo.quota;
    state.user.lastLoginTime = userInfo.lastLoginTime
    state.user.realName = userInfo.realName
    localStorage.setItem(localStorageKey, JSON.stringify(state.user))
  },
  removeUser (state) {
    state.user.userId = '';
    state.user.roleId = '';
    state.user.username = '';
    state.user.type = '';
    state.user.roleType = '';
    state.user.quota = '';
    state.user.realName = '';
    state.user.lastLoginTime = '';
    state.user.currentMenu = '0';
    state.user.currentSubMenu = [];
    state.user.menus = [];
    localStorage.setItem(localStorageKey, JSON.stringify(state.user))
  },
  setCurrentMenu (state, menu) {
    state.user.currentMenu = menu;
    localStorage.setItem(localStorageKey, JSON.stringify(state.user))
  },
  setCurrentSubMenu (state, menu) {
    state.user.currentSubMenu = menu;
    localStorage.setItem(localStorageKey, JSON.stringify(state.user))
  },
  setMenus (state, menus) {
    state.user.menus = menus;
    localStorage.setItem(localStorageKey, JSON.stringify(state.user))
  }
};

export default mutations
