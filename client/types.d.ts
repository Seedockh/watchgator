interface User {
  uuid: string
  nickname: string
  avatar?: string
  email: string
}

interface UserState {
  user: User | null
  token: string | null
}

declare module 'react-coverflow'

type UserAction = { type: string; payload: User|null }
type UserReducer = (prevState: UserState, action: UserAction) => UserState
