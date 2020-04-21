import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, FormGroup, FormControl, Button } from 'rsuite'
import useInput from '../core/useInput'
import User from '../core/user'

const Register = () => {
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
    <Container style={{ marginTop: 200 }}>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={10}>
            <Panel header={<h3>Register</h3>} bordered>
              <Form fluid>
              <FormGroup>
                  <ControlLabel>Pseudo</ControlLabel>
                  <FormControl name="nickname" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl name="email" />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl name="password" type="password" />
                </FormGroup>
                <FormGroup style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                  <Button appearance="primary" style={{ width: 150 }}>Register</Button>
                  <FormGroup style={{ display: "flex", flexDirection: "row", alignItems: "baseline", marginTop: 10 }}>
                    <ControlLabel> Already have a account ?</ControlLabel>
                    <Button onClick={redirectLogin} appearance="link"> Sign in</Button>
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
export default Register;