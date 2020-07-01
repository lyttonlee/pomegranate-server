const Router = require('koa-router')
const {sk} = require('../config/config')
const jwt = require('koa-jwt')({secret: sk})
const {
  login,
  regin,
  addArticle,
  getArticles,
  getArticleById,
  deleteArticle,
  updateArticle,
  upload
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

module.exports = router