const Router = require('koa-router')
const {sk} = require('../config/config')
// const jwt = require('koa-jwt')({secret: sk})
const { verify } = require('jsonwebtoken')

const jwt = async (ctx, next) => {
  // console.log(ctx.request)
  let headers = ctx.request.headers
  let token = ''
  if (headers['authorization']) {
    token = headers['authorization'].split(' ')[1]
  } else {
    ctx.status = 401
    ctx.body = {
      msg: '鉴权失败！'
    }
    return
  }
  try {
    // console.log(token)
    const decode = verify(token, sk)
    // console.log(decode)
    await next()
  } catch (error) {
    if (error) {
      // console.log(error)
      ctx.status = 401
      ctx.body = {
        msg: '鉴权失败！'
      }
    }
  }
}
const {
  login,
  regin,
  addArticle,
  getArticles,
  getArticleById,
  deleteArticle,
  updateArticle,
  upload,
  getUploadToken
} = require('./controller')
const router = new Router({
  prefix: '/pomegranate/api'
})

router
  .get('/articles', getArticles)
  .get('/article/:id', getArticleById)
  .post('/login', login)
  .post('/regin', regin)
  .post('/article', jwt, addArticle)
  .delete('/article/:id', jwt, deleteArticle)
  .put('/article/:id', jwt, updateArticle)
  .post('/upload', jwt, upload)
  .get('/upload/token', getUploadToken)

module.exports = router