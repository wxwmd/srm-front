const actions = {
  setSystem (context, systemInfo) {
    context.commit('initSystem', systemInfo)
  },
  setUser (context, userInfo) {
    context.commit('initUser', userInfo)
  },
  cleanUser (context) {
    context.commit('removeUser')
  },
  setCurrentMenu (context, menu) {
    context.commit('setCurrentMenu', menu)
  },
  setCurrentSubMenu (context, menu) {
    context.commit('setCurrentSubMenu', menu)
  },
  setMenus (context, menus) {
    context.commit('setMenus', menus)
  }
};

export default actions
