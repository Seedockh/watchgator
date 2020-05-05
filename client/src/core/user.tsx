import React, { createContext, useReducer, useContext } from 'react'
import { User } from '../models/api/User'

export interface UserState {
  user: User | null
  token: string | null
}

type UserContext = [UserState, React.Dispatch<UserAction>]

const Context = createContext<UserContext>([
  {
    user: null,
    token: null
  },
  () => { }
])

interface ProviderArgs {
  initialState: UserState
  reducer: UserReducer
  children: React.ReactNode
}

export const UserProvider = ({ initialState, reducer, children }: ProviderArgs): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={[ state, dispatch ]}>
      {children}
    </Context.Provider>
  )
}

export const UserGlobalState = () => useContext(Context)