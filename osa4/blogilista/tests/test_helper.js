const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: "Blogipostaus1",
      author: "Testi1",
      url: "http.testi.com",
      likes: 1
    },
    {
      title: "Blogipostaus2",
      author: "Testi2",
      url: "http.testi2.com",
      likes: 2
    },
  ]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
}