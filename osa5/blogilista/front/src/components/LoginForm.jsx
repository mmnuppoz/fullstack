import React from 'react'

const loginForm = ({ username, setUsername, password, setPassword, handleLogin }) => (
  <form onSubmit={handleLogin}>
    <div>
      username
      <input
        data-testid='username'
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
      <input
        data-testid='password'
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

export default loginForm