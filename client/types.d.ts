interface User {
  nickname?: string
}

interface UserState {
  user: User | null
}

declare module 'react-coverflow'
type UserAction = { type: 'setUser'; payload: User|null }
type UserReducer = (prevState: UserState, action: UserAction) => UserState
