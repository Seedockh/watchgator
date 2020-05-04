import React from 'react'
import { Route } from 'react-router-dom'
import 'rsuite/dist/styles/rsuite-dark.css';

import { Login, Home } from './pages'
import { UserGlobalState, UserProvider, UserState } from './core/user'
import Register from './pages/Register';
import Profile from './pages/Profile';
import Playlists from './pages/Playlists';
import DetailsPlaylists from './pages/DetailsPlaylist';
import { MovieDetails } from './pages/MovieDetails';
import Information from './pages/Information';

const user = localStorage.getItem('user')
const token = localStorage.getItem('token')


const userInitialState: UserState = {
  user: user ? JSON.parse(user) : null,
  token: token,
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
    case 'setToken':
      if (!action.payload) {
        localStorage.removeItem('token')
        return { ...prevState, token: null }
      }

      const token = { token: prevState.token, ...action.payload }
      localStorage.setItem('token', token.token ?? "")
      return { ...prevState, token: token.token }
    default:
      return prevState
  }
}

const App = () => (
  <UserProvider initialState={userInitialState} reducer={reducer}>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/information" component={Information} />
    <Route path="/movies/:movieId" component={MovieDetails} />
    <Route exact path="/playlists" component={Playlists} />
    <Route exact path="/playlist/:playlistId" component={DetailsPlaylists} />
  </UserProvider>
)

export default App
