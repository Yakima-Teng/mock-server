const domain = {
  server1: 'http://yakima.duapp.com/',
  server2: 'http:localhost:6060',
  zhangbiaoyan: 'http://192.168.1.155:8080'
}

const config = {
  port: '3000',
  // 将public目录映射成为url中root对应的目录
  root: '/test',
  // 代理请求，将请求转发至其他服务器，然后返回相应的内容
  proxyTable: {
    // '/manage2': domain.zhangbiaoyan,
    '/blog': domain.server1,
    '/blog/details': domain.server2,
    '/wechat': domain.server2
  },
  // 读取固定的JSON文件内容作为返回值
  jsonTable: [
    '/manage2/intention/list',
    '/manage2/order/list',
    '/manage2/insurance/query',
    '/manage2/courier/list',
    '/manage2/salemanManage/list',
    '/manage2/commission/commissionPayDetailList',
    '/manage2/commission/commissionPayList',
    '/manage2/dopay/list',
    '/manage2/salemanManage/list',
    '/manage2/courier/list',
    '/manage2/courier/save',
    '/manage2/dept/findPage',
    '/manage2/dept/findAllDept',
    '/manage2/dept/save',
    '/manage2/dept/save',
    '/manage2/funcDis/findLevel2Menu',
    '/manage2/funcDis/findFVo',
    '/manage2/funcDis/saveF',
    '/manage2/main/privilege',
    '/manage2/main/login',
    '/manage2/main/logout',
    '/manage2/role/update',
    '/manage2/role/save',
    '/manage2/role/queryDetails',
    '/manage2/role/list',
    '/manage2/manageUser/save',
    '/manage2/manageUser/delete',
    '/manage2/manageUser/queryDetails',
    '/manage2/manageUser/list',
    '/manage2/manageUser/update'
  ],
  // 读取用户自定义的内容，可以在此处使用第三方数据模拟工具（默认已经预装了mockjs模块，开箱即用）
  customTable: [
    '/great/what'
  ]
}

module.exports = config
