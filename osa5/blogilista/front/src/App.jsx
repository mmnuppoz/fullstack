import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogVisible, setBlogVisible] = useState(false)
  const noteFormRef = useRef()
  const [updateBlogs, setUpdateBlogs] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {

    noteFormRef.current.toggleVisibility()

     try {
      const returnedNote = await blogService.create(blogObject, user.token);
      setBlogs(blogs.concat(returnedNote));
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      setErrorMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('Adding new blog failed. Fill all boxes')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateLike = async (blog, id) => {
    try {
      await blogService.addLike(blog, id)

      setUpdateBlogs(!updateBlogs)
      setErrorMessage(['Successfully liked blog', true])
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(['like not added', false])
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.error('error liking a blog', error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => {
    return (
    <div>
      <Notification message={errorMessage} />
      <LoginForm
        username = {username}
        setUsername = {setUsername}
        password = {password}
        setPassword = {setPassword}
        handleLogin = {handleLogin}
      />
    </div>
    )
  }

  const blogForm = () => (
    <div>
      <Togglable buttonLabel = 'new blog' ref={noteFormRef} >
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>

      {!user && loginForm()}
      {user && <div>
        <Notification message={errorMessage} />
        <p>{user.name} logged in</p>
        <button onClick={handleLogOut}>Logout</button>
        {blogForm()}
        {user && blogs
          .filter(blog => blog.user && blog.user.username === user.username)
          .sort((a,b) => b.likes - a.likes)
          .map(blog =>
          <Blog key={blog.id} blog={blog} updateLike={updateLike} />
        )}
        </div>
      }     
    </div>
  )
}

export default App