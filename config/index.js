const domain = {
  server1: 'http://yakima.duapp.com/',
  server2: 'http:localhost:6060'
}

const config = {
  port: '3000',
  // 将public目录映射成为url中root对应的目录
  root: '/test',
  // 代理请求，将请求转发至其他服务器，然后返回相应的内容
  proxyTable: {
    '/blog': domain.server1,
    '/hello/world': domain.server2,
    '/wechat': domain.server2
  },
  // 读取固定的JSON文件内容作为返回值
  jsonTable: {
    '/world/example': 'example'
  },
  // 读取用户自定义的内容，可以在此处使用第三方数据模拟工具（默认已经预装了mockjs模块，开箱即用）
  customTable: {
    '/great/what': 'what'
  }
}

module.exports = config
