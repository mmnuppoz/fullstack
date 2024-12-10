const { test, expect, beforeEach } = require('@playwright/test')
const { request } = require('http')
const { describe } = require('node:test')

describe('Blog app', () => {
  
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Testi Testaaja',
        username: 'testaaja',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Toinen Testaaja',
        username: 'tokatestaaja',
        password: 'salainen2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {

    const locator = await page.getByText('blog')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByText('login')).toBeVisible()

  })

  describe('Login', () => {
    
    test('succeeds with correct credentials', async ({page}) =>{
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click() 
  
      await expect(page.getByText('Testi Testaaja logged in')).toBeVisible()
    })

    test('fails with incorrect credentials', async ({page}) =>{
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('väärin')
      await page.getByRole('button', { name: 'login' }).click() 
  
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })

  })

  describe('When logged in', () => {

    beforeEach(async ({page, request}) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click() 
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Otsikko')
      await page.getByTestId('author').fill('Kirjoittaja')
      await page.getByTestId('url').fill('http://testi.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('a new blog Otsikko by Kirjoittaja added')).toBeVisible()
      await expect(page.getByText('Otsikko Kirjoittaja')).toBeVisible()
    })

    describe('When blog has been added', () => {

      beforeEach(async ({page, request}) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Otsikko')
        await page.getByTestId('author').fill('Kirjoittaja')
        await page.getByTestId('url').fill('http://testi.com')
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await expect(page.getByText('Successfully liked blog')).toBeVisible()
      })

      test('blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 0')).toBeVisible()
        await expect(page.getByText('http://testi.com')).toBeVisible()
        await expect(page.getByText('Otsikko Kirjoittaja')).toBeVisible()

        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toBe('Are you sure you want to remove this blog?')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'delete' }).click()
        await expect(page.getByText('Otsikko Kirjoittaja')).not.toBeVisible()

      })

      test('only user who created blog can see delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'Logout' }).click()
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        
        await page.getByTestId('username').fill('tokatestaaja')
        await page.getByTestId('password').fill('salainen2')
        await page.getByRole('button', { name: 'login' }).click() 
        await expect(page.getByText('Otsikko Kirjoittaja')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('delete')).not.toBeVisible()
      })

    })
  
  })

})