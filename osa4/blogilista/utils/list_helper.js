const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogsArray) => {
    return blogsArray.reduce((total, blog) => total + blog.likes, 0)
}

module.exports = {
    dummy,
    totalLikes
}