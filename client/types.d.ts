interface User {
  nickname?: string
}

interface UserState {
  user: User | null
  token: string |  null
}

type UserAction = { type: string; payload: User|null }
type UserReducer = (prevState: UserState, action: UserAction) => UserState
