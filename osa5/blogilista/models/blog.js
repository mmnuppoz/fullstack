const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI
console.log('connecting to', mongoUrl)
mongoose.connect(mongoUrl)

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  user: {
    username: String,
    name: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
  
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)