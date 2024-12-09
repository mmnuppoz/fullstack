import React from 'react';
const BlogForm = ({ newTitle, setNewTitle, newAuthor, setNewAuthor, newUrl, setNewUrl, addBlog }) => (
  <form onSubmit={addBlog}>
    <div>
      title: 
      <input
        type="text"
        value={newTitle}
        name="Title"
        onChange={({ target }) => setNewTitle(target.value)}
      />
    </div>
    <div>
      author: 
      <input
        type="text"
        value={newAuthor}
        name="Author"
        onChange={({ target }) => setNewAuthor(target.value)}
      />
    </div>
    <div>
      url: 
      <input
        type="text"
        value={newUrl}
        name="Url"
        onChange={({ target }) => setNewUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>      
)
export default BlogForm;