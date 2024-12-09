import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)

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

  const addBlog = async (event) => {
    event.preventDefault();
    const blogObject = {
      user: user,
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
  
     // Lähetetään uusi muistiinpano palvelimelle
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
      <Notification message={errorMessage} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogOut}>Logout</button>

      <BlogForm
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newAuthor={newAuthor}
        setNewAuthor={setNewAuthor}
        newUrl={newUrl}
        setNewUrl={setNewUrl}
        addBlog={addBlog}
      />
      {user && blogs.filter(blog => blog.user && blog.user.username === user.username).map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )


  return (
    <div>
      <h2>blogs</h2>

      {!user && loginForm()}
      {user && blogForm()}
      
    </div>
  )
}

export default App