


declare module 'react-coverflow'

type UserAction = { type: string; payload: User|null }
type UserReducer = (prevState: UserState, action: UserAction) => UserState
