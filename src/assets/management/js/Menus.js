const Menus = [
  {
    id: '1',
    menuName: '首页',
    menuIcon: 'el-menuIcon-s-Home',
    menuPath: '/index',
    children: []
  },
  {
    id: '8',
    menuName: '系统管理',
    menuIcon: 'el-menuIcon-s-tools',
    menuPath: '',
    children: [
      {
        id: '80',
        menuName: '用户管理',
        menuIcon: 'el-menuIcon-user-solid',
        menuPath: '/system/user'
      },
      {
        id: '81',
        menuName: '角色管理',
        menuIcon: 'el-menuIcon-s-custom',
        menuPath: '/system/role'
      },
      {
        id: '82',
        menuName: '菜单管理',
        menuIcon: 'el-menuIcon-s-check',
        menuPath: '/system/menu'
      }
    ]
  }
];

export default Menus
