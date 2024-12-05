const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const user = request.user
  console.log(user)

  if (!user) {
    return response.status(400).json({ error: ' user not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  // response.status(201).json(savedBlog)
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const user = request.user

  
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }
  
  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
 

  if (! blog.user._id.toString() === user.id.toString() ) {
    return response.status(403).json({ error: 'only the user who added the blog can delete it' })
  }
  
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const { title, author, url, likes } = request.body;
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' }
    );
    
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' })
  }
})


module.exports = blogsRouter