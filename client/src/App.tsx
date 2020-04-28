import React from 'react'
import { Route } from 'react-router-dom'
import 'rsuite/dist/styles/rsuite-dark.css';

import { Login, Home } from './pages'
import User from './core/user';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Information from './pages/Information';

const user = localStorage.getItem('user')

const userInitialState = {
  user: user ? JSON.parse(user) : null,
}

// Define your reducer actions here
const reducer = (prevState: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'setUser':
      if (!action.payload) {
        localStorage.removeItem('user')
        return { ...prevState, user: null }
      }

      const user = { ...prevState.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(user))
      return { ...prevState, user }
    default:
      return prevState
  }
}

function App(): JSX.Element {
  return (
    <User.Provider initialState={userInitialState} reducer={reducer}>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/information" component={Information} />
    </User.Provider>
  )
}

export default App
