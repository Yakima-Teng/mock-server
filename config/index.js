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
    '/manage2/dept/findAllDept': domain.zhangbiaoyan,
    '/blog': domain.server1,
    '/blog/details': domain.server2,
    '/wechat': domain.server2
  },
  // 读取固定的JSON文件内容作为返回值
  jsonTable: {
    '/manage2/dept/findPage': 'manage2-dept-findPage.json',
    '/manage2/dept/findAllDept': 'manage2-dept-findAllDept.json',
    '/manage2/dept/save': 'manage2-dept-save.json',
    '/manage2/funcDis/findLevel2Menu': 'manage2-funcDis-findLevel2Menu.json',
    '/manage2/funcDis/findFVo': 'manage2-funcDis-findFVo.json',
    '/manage2/funcDis/saveF': 'manage2-funcDis-saveF.json'
  },
  // 读取用户自定义的内容，可以在此处使用第三方数据模拟工具（默认已经预装了mockjs模块，开箱即用）
  customTable: {
    '/great/what': 'what'
  }
}

module.exports = config
