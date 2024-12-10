import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Create a new blog'), async () => {

  const user = userEvent.setup()
  const createBlog = vi.fn()

  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: "Testi Kirjoittaja",
    url: "http://testejä.com",
    likes: 1,
    user: {
      name: "Testi Käyttäjä",
      id: "123456789"
    }
  }

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('title here')
  const inputAuthor = screen.getByPlaceholderText('author here')
  const inputUrl = screen.getByPlaceholderText('url here')
  const button = screen.getByText('create')

  await userEvent.type(inputTitle, blog.title)
  await userEvent.type(inputAuthor, blog.author)
  await userEvent.type(inputUrl, blog.url)
  await userEvent.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Component testing is done with react-testing-library')
  expect(createBlog.mock.calls[0][0].author).toBe('Testi Kirjoittaja')
  expect(createBlog.mock.calls[0][0].url).toBe('http://testejä.com')

}