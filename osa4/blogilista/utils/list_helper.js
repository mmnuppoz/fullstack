const lodash  = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogsArray) => {
    return blogsArray.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogsArray) => {
    if (blogsArray.length === 0) {
      return null    
    }
  
    let mostLikedBlog = blogsArray[0]
  
    blogsArray.forEach((blog) => {
      if (blog.likes >= mostLikedBlog.likes) {
        mostLikedBlog = blog
      }
    })
  
    return {
      title: mostLikedBlog.title,
      author: mostLikedBlog.author,
      likes: mostLikedBlog.likes
    }
}

const mostBlogs = (blogsArray) => {
  if (blogsArray.length === 0) {
    return null    
  }

  const authorBlogCounts = lodash.countBy(blogsArray, 'author')
  const authorWithMostBlogs = lodash.maxBy(Object.keys(authorBlogCounts), (author) => authorBlogCounts[author])

  return {
    author: authorWithMostBlogs,
    blogs: authorBlogCounts[authorWithMostBlogs]
  }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}