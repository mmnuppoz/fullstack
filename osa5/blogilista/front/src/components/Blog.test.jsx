import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: "Testi Kirjoittaja",
    url: "http://testejä.com",
    likes: 1
  }

  const component = render(<Blog blog={blog} />)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).not.toHaveTextContent(
    'http://testejä.com'
  )

  expect(component.container).not.toHaveTextContent(
    '1'
  )
  
})

test('url, likes and user is shown when clicking the view button'), async () => {

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

  const user = {
    name: "Testi Käyttäjä",
    id: "123456789"
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user= {user} toggleVisibility={mockHandler} />
  )

  const button = screen.getByText('view')
  await user.click(button)

  expect(component.container).toHaveTextContent(
    'http://testejä.com'
  )

  expect(component.container).toHaveTextContent(
    '1'
  )

  expect(component.container).toHaveTextContent(
    'Testi Käyttäjä'
  )

  expect(component.container).toHaveTextContent(
    '123456789'
  )

}

test('if like button is pressed two times event handler is called twice'), async () => {

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
    
      const user = {
        name: "Testi Käyttäjä",
        id: "123456789"
      }
    
      const mockHandler = vi.fn()
    
      render(
        <Blog blog={blog} user= {user} updateLike={mockHandler} />
      )
    
      const button = screen.getByText('view')
      await user.click(button)

      const likeButton = screen.getByText('like')
      await user.click(likeButton)
      await user.click(likeButton)

      expect(mockHandler.mock.calls).toHaveLength(2)

}