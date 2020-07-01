const {User, Article} = require('../model/model')
const { sign } = require('jsonwebtoken')
const { sk } = require('../config/config')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')

const successRes = (result, msg='成功') => {
  return {
    code: 0,
    result,
    msg
  }
}

const errorRes = (msg='失败') => {
  return {
    code: 1,
    msg
  }
}

module.exports = {
  async login (ctx) {
    console.log(ctx.request)
    const {name, password} = ctx.request.body
    const user = await User.findOne({name, password})
    console.log(user)
    if (user) {
      const token = sign({name: user.name, _id: user._id}, sk, {expiresIn: '12h'})
      ctx.body = successRes(token)
    } else {
      ctx.body = errorRes('用户名或密码错误!')
    }
  },
  async regin (ctx, next) {
    console.log(ctx)
    let user = ctx.request.body
    user.createTime = new Date()
    const newUser = new User(user)
    try {
      await newUser.save()
      ctx.body = successRes(newUser)
    } catch (error) {
      console.log(error)
      next(error)
    }
    
  },
  async addArticle (ctx, next) {
    let article = ctx.request.body
    article.time = new Date()
    const newArticle = new Article(article)
    try {
      let res = await newArticle.save()
      ctx.body = successRes(res)
    } catch (error) {
      next(error)
    }
  },

  async getArticles (ctx, next) {
    try {
      let res = await Article.find()
      ctx.body = successRes(res)
    } catch (error) {
      next(error)
    }
  },

  async getArticleById (ctx, next) {
    // console.log(ctx.params)
    try {
      let id = ctx.params.id
      let art = await Article.findById(id)
      let res = await Article.findByIdAndUpdate(id, {
        lastViewTime: new Date(),
        views: art.views ? art.views + 1 : 1,
      }, {
        new: true
      })
      ctx.body = successRes(res)
    } catch (error) {
      next(error)
    }
  },

  async updateArticle (ctx, next) {
    let id = ctx.params.id
    let content = ctx.request.body
    try {
      let res = await Article.findByIdAndUpdate(id, content, {
        new: true
      })
      ctx.body = successRes(res)
    } catch (error) {
      next(error)
    }
  },

  async deleteArticle (ctx, next) {
    let id = ctx.params.id
    try {
      let res = await Article.findByIdAndRemove(id)
      ctx.body = successRes(res)
    } catch (error) {
      next(error)
    }
  },

  async upload (ctx, next) {
    // console.log(ctx.req)
    const form = formidable({ multiples: true })
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, '../../public/upload')
    try {
      const r =  await new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
          if (err) {
            reject(err)
            return
          }
          const res = Object.values(files).map((file) => {
            // console.log(file)
            // const [, type] = file.type.split('/')
            // const oldPath = file.path
            // const newPath = path.join(__dirname, `../../public/upload/${new Date().valueOf() + '.' + type}`)
            // fs.rename(oldPath, newPath, (err) => {
            //   console.log(err)
            // })
            // fs.unlink(oldPath, err => console.log(err))
            const name = file.path.split('\\').pop()
            const newPath = '/upload/' + name
            return 'http://localhost:9001' + newPath
          })
          // console.log(res)
          resolve(res)
        })
      })
      // console.log(r)
      ctx.body = {
        errno: 0,
        data: r
      }
    } catch (error) {
      next(error)
    }
  }
}