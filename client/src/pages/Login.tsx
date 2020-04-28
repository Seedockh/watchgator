import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, FormGroup, FormControl, Button } from 'rsuite'
import useInput from '../core/useInput'
import User from '../core/user'

const Login = () => {
  const { bind: emailBind } = useInput('')
  const { bind: passwordBind } = useInput('')
  const [{ user }] = User.GlobalState()
  const history = useHistory()

  useEffect(() => {
    // do something once here
    console.log('Login page called !')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log(`user: ${JSON.stringify(user)}`)
  }, [user])

  // const login = (): void => {
  //   dispatch({ type: 'setUser', payload: { email } })
  //   console.log('User handled !')
  //   alert('Check your console.log !')
  //   // redirect to next view :
  //   history.push('/home')
  // }

  const redirectRegister = () => {
    history.push('/register')
  }

  return (
    <Container style={{ marginTop: 200 }}>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={10}>
            <Panel header={<h3>Login</h3>} bordered>
              <Form fluid>
                <FormGroup>
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl name="name" {...emailBind} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl name="password" type="password" {...passwordBind} />
                  <Button appearance="link">Forgot password?</Button>
                </FormGroup>
                <FormGroup className='flex flex-column flex-align-center'>
                  <Button appearance="primary" style={{ width: 150 }} onClick={() => history.push('/')}>Login</Button>
                  <FormGroup className='flex' style={{ alignItems: "baseline", marginTop: 10 }}>
                    <ControlLabel>Don't have account ?</ControlLabel>
                    <Button onClick={redirectRegister} appearance="link"> Sign up</Button>
                  </FormGroup>
                </FormGroup>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content>
    </Container>
  )
}
export default Login;