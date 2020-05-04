import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, FormGroup, FormControl, Button } from 'rsuite'

import { UserGlobalState } from '../core/user'
import { ApiHook } from '../models/ApiHook';
import { useInput } from '../hooks/useInput';


const Login = () => {
  const email = useInput('');
  const password = useInput('');

  const [{ user }, dispatch] = UserGlobalState()
  const history = useHistory()

  const [fetchState, setFetchState] = useState<ApiHook<any>>({
    isLoading: false
  })

  if (user) {
    history.push('/')
  }

  const redirectRegister = () => {
    history.push('/register')
  }

  const setUser = (res: any) => {
    dispatch({ type: 'setUser', payload: res.data.user })
    dispatch({ type: 'setToken', payload: res.meta.token })
  }

  const handleSubmit = async () => {        
    setFetchState({ isLoading: true })
    const res = await fetch(`${process.env.REACT_APP_API_URI}/auth/signin`, {
      method: "POST",
      body: JSON.stringify({email: email.value, password: password.value}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 400) {
      setFetchState({ isLoading: false, error: "Email or password incorrect" })
    } else {
      res.json()
        .then(res => {
          setFetchState({ isLoading: false })
          setUser(res)
        })
        .catch(err => {
          console.log("API ERROR", err);
          setFetchState({ isLoading: false, error: err })
        });
    }
  }

  return (
    <Container style={{ marginTop: "15%" }}>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={10}>
            <Panel header={<h3>Login</h3>} bordered>
              <Form fluid>
                <FormGroup>
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl name="name" {...email.bind} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl name="password" type="password" {...password.bind} />
                  <Button appearance="link">Forgot password?</Button>
                </FormGroup>
                <FormGroup className='flex flex-column flex-align-center'>
                  {!fetchState.isLoading && fetchState.error ? <h5>{fetchState.error}</h5> : null}
                  <Button appearance="primary" style={{ width: 150 }} onClick={() => handleSubmit()} loading={fetchState.isLoading}>Login</Button>
                  <FormGroup className='flex mt-3' style={{ alignItems: "baseline" }}>
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