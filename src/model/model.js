const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  password: String,
  createTime: {
    type: Date,
    default: new Date()
  }
})

const ArticleSchema = new Schema({
  _id: String,
  title: String,
  content: String,
  time: Date,
  views: Number,
  lastViewTime: Date
})

const Article = mongoose.model('article', ArticleSchema)

const User = mongoose.model('user', UserSchema)

module.exports = {
  Article,
  User
}
