const { test, after, beforeEach, before } = require('node:test')
const assert = require('assert');
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog');
const User = require('../models/user')
const { execSync } = require('child_process');

/*before(async () => {
  await createUser()
})

const createUser = async () => {
  try {
    await User.deleteMany({})
    const newUser = {
      username: 'Testaaja',
      password: 'salasana',
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    return response.body
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

const loginUser = async () => {
  try {
    const userToLogIn = {
      username: 'Testaaja',
      password: 'salasana',
    }

    const response = await api
      .post('/api/login')
      .send(userToLogIn)
      .expect(200)

    return response.body.token
  } catch (error) {
    console.error('Error logging in:', error) 
    return null
  } 
}*/

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

/*test.only('the first blog is about Blogipostaus1', async () => {
  const aToken = await loginUser()
  console.log(aToken)
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${aToken}`) 
  const title = response.body.map(e => e.title)
  assert(title.includes('Blogipostaus1'))
})*/

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  

test('the indentifier field is named id'), async () => {
  const response = await api.get('/api/blogs')
  const blogToCheck = response.body[0]
  expect(blogToCheck.id).toBeDefined
}

test('blog can be added and it is valid'), async () => {

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

test('blog can not be added without title or url'), async () => {

  const newBlog = {
    title: '',
    author: 'Kirjoittaja',
    url: 'http.blogi.com',
    likes: 1000
  }

  const newBlog2 = {
    title: 'otsikkoOn',
    author: 'Kirjoittaja',
    url: '',
    likes: 100,
  }

  const newBlog3 = {
    title: '',
    author: 'Kirjoittaja',
    url: '',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .send(newBlog2)
    .send(newBlog3)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

}

test('blog post can be deleted', async () =>{

  const newBlog = {
    title: 'Testi',
    author: 'Kirjoittaja',
    url: 'http.blogi.com',
    likes: 1000
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogToDeleted = response.body
  console.log('Blog ID to delete:', blogToDeleted.id)

  await api
    .delete(`/api/blogs/${blogToDeleted.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  
  const titles = blogsAtEnd.map(r => r.title)
  assert.strictEqual(titles.includes(blogToDeleted.title), false)

})

test('blog post can be edited', async () => {

  const newBlog = {
    title: 'Testi',
    author: 'Kirjoittaja',
    url: 'http.blogi.com',
    likes: 1000
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogToEdit = response.body

  const editBlog = {
    title: 'Testi',
    author: 'Kirjoittaja',
    url: 'http.blogi.com',
    likes: 1001
  }

  const putResponse = await api
    .put(`/api/blogs/${blogToEdit.id}`)
    .send(editBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToEdit.id)
  assert.strictEqual(updatedBlog.likes, 1001)

})

/* Testataan käyttäjää */


beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  assert(usernames.includes(newUser.username))
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('Username already taken'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails with proper statuscode and message if username is too short', async () => {

  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mi',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('username must be at least 3 characters long'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)

})

test('creation fails with proper statuscode and message if password is too short', async () => {

  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'mluukkai',
    name: 'Superuser',
    password: 'mm',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert(result.body.error.includes('password must be at least 3 characters long'))

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)

})

after(async () => {
  await mongoose.connection.close()
})