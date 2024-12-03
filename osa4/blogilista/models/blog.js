const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI
console.log('connecting to', mongoUrl)
mongoose.connect(mongoUrl)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)