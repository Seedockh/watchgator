import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, FormGroup, FormControl, Button } from 'rsuite'
import useInput from '../core/useInput'
import User from '../core/user'

const Profile = () => {
  const { value: email } = useInput('')
  const [{ user }, dispatch] = User.GlobalState()
  const history = useHistory()

  useEffect(() => {
    // do something once here
    console.log('Login page called !')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(`user: ${JSON.stringify(user)}`)
  }, [user])

  const login = (): void => {
    dispatch({ type: 'setUser', payload: { email } })
    console.log('User handled !')
    alert('Check your console.log !')
    // redirect to next view :
    history.push('/home')
  }

  const redirectLogin = () => {
      history.push('/login')    
  } 

  return (
    <Container style={{ marginTop: 50 }}>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={10}>
            <img src="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4" alt="profile" style={{width: 100, border: 1, borderRadius: 280}}/>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  )
}
export default Profile;