const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const blog = await Blog.findByIdAndDelete(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
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