const { test, after, beforeEach } = require('node:test')
const assert = require('assert');
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

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

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the first blog is about Blogipostaus1', async () => {
  const response = await api.get('/api/blogs')

  const title = response.body.map(e => e.title)
  assert(title.includes('Blogipostaus1'))
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  after(async () => {
    await mongoose.connection.close()
  })

test('the indentifier field is named id'), async () => {
  const response = await api.get('/api/blogs')
  const blogToCheck = response.body[0]
  expect(blogToCheck.id).toBeDefined
}

test.only('blog can be added and it is valid'), async () => {

  const newBlog = {
    title: 'Testi',
    author: 'Kirjoittaja',
    url: 'http.blogi.com',
    likes: 1000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogs = blogsAtEnd.map((n) => n.title)

  expect(blogs).toContainEqual('Testi')

}

test('set likes value to 0 if not given'), async () => {
  
  const newBlog = {
    title: 'Testi',
    author: 'Kirjoittaja',
    url: 'http.blogi.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogs = blogsAtEnd.map((n) => n.likes)

  expect(blogs).toContainEqual(0)
    
}