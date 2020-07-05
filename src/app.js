const Koa = require('koa')
const BodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const logger = require('koa-logger')
const static = require('koa-static')
const path = require('path')
const {
  port
} = require('./config/config')

const router = require('./route/router')
const app = new Koa()

app.use(static(path.join(__dirname, '../public')))

app.use(BodyParser())

app.use(logger())


app.use(router.routes()).use(router.allowedMethods())

const handleError = (ctx, error) => {
  if (error) {
    ctx.status = error.status
    ctx.body = error.message
  }
}

// app.use(handleError)

// 连接数据库
const uri = 'mongodb://localhost:27017/pomegranate'
const connect = mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('数据库连接成功!')
  }
  
})

app.listen(port, () => {
  console.log(`the app is listening on port ${port}`)
})
