const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const proxyMiddleware = require('http-proxy-middleware')
const md = new require('markdown-it')()
const opn = require('opn')
const body = require('stream-body')

const config = require('./config')

let app = express()

// allow cross-origin ajax request
app.all('*', (req, res, next) => {
  console.log(`[${req.method}] ${req.url} ${new Date()}`)
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS')
  next()
})

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// enable uploading large file
app.use(bodyParser.json({ limit: '100000kb' }))
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '100000kb'
}))

app.use(cookieParser())
app.use(config.root, express.static(path.join(__dirname, 'public'), {
  index: 'index.html',
  maxAge: 60 * 60 * 1000
}))

app.get('/yakima', (req, res, next) => {
  fs.readFile(path.join(__dirname, 'README.md'), (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    const readme = md.render(data.toString())
    res.send(readme)
  })
})

// proxy api requests
Object.keys(config.proxyTable).forEach(context => {
  let options = config.proxyTable[context]
  options = {
    target: options,
    changeOrigin: true,
    onProxyRes (proxyRes, req, res) {
      body.parse(proxyRes, (err, data) => {
        const fileName = `${req.url.split('#')[0].split('?')[0].split(/^\//)[1].replace(/\//g, '-')}.json`
        fs.writeFile(path.join(__dirname, 'mock', 'proxy', fileName), JSON.stringify(data, null, 2), err => {
          if (err) { console.log(err) }
        })
      })
    }
  }
  app.use(proxyMiddleware(context, options))
})

// response row json file content
Object.keys(config.jsonTable).forEach(context => {
  let fileName = config.jsonTable[context]
  app.all(context, (req, res, next) => {
    fs.readFile(path.join(__dirname, 'mock', 'json', `${fileName}.json`), (err, data) => {
      if (err) {
        console.log(err)
        return
      }
      res.json(JSON.parse(data.toString()))
    })
  })
})

// response custom content
Object.keys(config.customTable).forEach(context => {
  app.all(context, (req, res, next) => {
    const filePathAndName = path.join(__dirname, 'mock', 'custom', `${config.customTable[context]}.js`)
    const content = require(filePathAndName)
    res.json(content)
  })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers (will print stacktrace)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    error: err
  })
})

app.set('port', config.port)

const server = http.createServer(app)

server.listen(config.port)
server.on('error', onError)
server.on('listening', onListening)

// Event listener for HTTP server "error" event.
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('Listening on ' + bind)
  // opn(`http://localhost:${config.port}/yakima`)
}

