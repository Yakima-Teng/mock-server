# mock-server

服务器端数据模拟，方便前端工程师独立于后端进行开发。支持跨域访问，支持post大文件（不会在硬盘上进行存储）。

本程序根据个人的实际使用情况在操作的简便性和功能的丰富性之间做了适当的取舍，“返回静态JSON数据”时不对请求方式（POST、GET这种）进行区分，只针对请求地址进行响应。如果想要根据根据请求方式进行区别响应，可使用“请求代理”或“返回JS自定义数据”。

适用于前端为http请求，后端返回json数据的场景。

说明：本文档中“配置文件”指的是config目录下的index.js文件

说明：如要在服务器启动时自动打开一个说明文档页面和一个ajax测试页面，请取消app.js文件中结尾处的两处注释。

## 截图

![](https://raw.githubusercontent.com/Yakima-Teng/mock-server/master/screenshots/ajax-demo.png)

![](https://raw.githubusercontent.com/Yakima-Teng/mock-server/master/screenshots/console.png)

Established by Yakima Teng

## 请求代理

修改配置文件中的config.proxyTable即可。示例如下：

```
proxyTable: {
  '/blog': 'http://yakima.duapp.com/',
  '/blog/details': 'http://localhost:6060',
  '/wechat': 'http:localhost:6060'
}
```

如上配置对应的描述如下：

- 本地发出的请求地址以/blog开头的请求会被转发到yakima.duapp.com/域名下相同的路径。即本地发出的/blog/v1/pages将会收到yakima.duapp.com/blog/v1/pages请求的响应结果。
- 这里采用“越具体的配置，优先级越高”的规则，即如果本地发出的请求以/blog/details开头，则采用/blog/details规则匹配的代理域名而非/blog规则匹配的代理域名。

说明：程序会自动对代理请求返回的结果进行备份，备份目录为/mock/proxy，生成的文件名是根据请求地址自动生成的。大部分时候不需要搭理这些备份文件。

## 返回JSON静态数据

修改配置文件中的config.jsonTable即可。示例配置如下：

```
jsonTable: [
  '/manage2/intention/list',
  '/manage2/carInsurance/queryDetails',
  '/manage2/carInsurance/updateQuotation',
  '/manage2/order/list',
  '/manage2/order/queryDetails',
  '/manage2/order/updateSalesman',
  '/manage2/order/update'
]
```

如上配置对应的描述如下：

若本地发起了请求地址为“/manage2/intention/list”的请求，则服务器会将/mock/json/manage2-intention-list.json的内容予以返回。

注意：需要在启动服务器之前，先在/mock/json目录下手动建立对应的json文件，并自行填充数据；如果您未手动新建json文件，程序会自动帮你新建一个内容为“{}”的json文件，内容还需您自行填充。一般来说用后面这种方法会比较方便，修改了文件后程序会自动重启的，不需要重复操作命令行工具。

小技巧：可以将程序在/mock/proxy目录下生成的备份文件拷贝至此处使用。

## 返回JS自定义数据

修改配置文件中的config.customTable即可。示例配置如下：

```
customTable: {
  '/great/what': 'what'
}
```

如上配置对应的描述如下：

若本地发起了请求地址为/great/what,则服务器会将/mock/custom/what.js文件中导出的函数予以调用，并将函数返回值发送至前端。

注意：需要在启动服务器之前，先在/mock/custom目录下手动建立对应的js文件，在改js文件中通过module.exports导出一个函数，该函数需要返回一个json数据；另外，该函数可接收一个表示请求的req参数，从而可以根据req来判断请求方式、传参等来动态输入自定义内容。

说明：之所以在自定义js文件中导出函数而非直接导出数据，是为了便于服务器返回随机数据。

说明：程序内置了mockjs模块（[官方文档](http://mockjs.com/)），可以直接使用这个模块生成一些随机数据。

如下为一份使用了mockjs模块自定义数据的js文件的内容：

```
const Mock = require('mockjs')

const returnRes = (req) => {
  return Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'id|+1': 1
    }],
    // 请求方式
    method: req.method,
    // 传参
    params: (() => {
      if (req.method === 'POST') {
        return req.body
      } else if (req.method === 'GET') {
        return req.query
      }
    })()
  })
}

module.exports = returnRes
```

## 设置服务端口

修改配置文件中的config.port字段，默认启用端口号为3000。

## 设置静态文件根路径的访问地址

将您的前端文件或其他静态文件放置于public目录下，然后修改配置文件中的config.root，config.root的值将与public目录直接映射。config.root的默认值为"/test"，即"/test/index.html"将会访问public目录下的index.html文件。

说明：

- 访问"/test"和访问"/test/index.html"访问的是同一个文件，因为程序设定的默认首页为index.html。

## License

The MIT License (MIT)
