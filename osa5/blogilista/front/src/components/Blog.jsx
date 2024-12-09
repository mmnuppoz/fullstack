import React, { useState } from 'react'

const Blog = ({ blog, updateLike, removeBlog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const handleDelete = () => {
    if (
      window.confirm('Are you sure you want to remove this blog?') ===
			true
    ) {
      removeBlog(blog.id)
    }
  }

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      url: blog.url,
      author: blog.author,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    updateLike(updatedBlog, blog.id)
    blog.likes = updatedBlog.likes
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return(
    <div style={blogStyle} >
      <div>
        {blog.title} {blog.author}
        <button id='viewBlog' onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
        {visible && (
          <div>
            <p>{blog.url}</p>
            <p>likes {blog.likes} <button id='likeBlog' onClick={handleLike}>like</button></p>
            <p>{blog.user.name}</p>
            {blog.user.username === user.username && (
              <button id='deleteBlog' onClick={handleDelete}>delete</button>
            )}
          </div>
        )}
      </div>
    </div>

  )

}

export default Blog