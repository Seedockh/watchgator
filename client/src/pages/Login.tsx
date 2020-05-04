import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, FormGroup, FormControl, Button } from 'rsuite'

import User from '../core/user'
import { ApiHook } from '../models/ApiHook';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const values = { email, password }

  const [{ user }, dispatch] = User.GlobalState()
  const history = useHistory()

  const [fetchState, setFetchState] = useState<ApiHook<any>>({
    isLoading: false
  })

  const setUser = (res: any) => {
    dispatch({ type: 'setUser', payload: res.data.user })
    dispatch({ type: 'setToken', payload: res.meta.token })
  }

  const redirectRegister = () => {
    history.push('/register')
  }

  const handleSubmit = async () => {
    setFetchState({ isLoading: true })
    const res = await fetch(`${process.env.REACT_APP_API_URI}/auth/signin`, {
      method: "POST",
      body: JSON.stringify(values),
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
    <Container style={{ marginTop: 200 }}>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={10}>
            <Panel header={<h3>Login</h3>} bordered>
              <Form fluid>
                <FormGroup>
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl name="name" onChange={value => setEmail(value)} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl name="password" type="password" onChange={value => setPassword(value)} />
                  <Button appearance="link">Forgot password?</Button>
                </FormGroup>
                <FormGroup className='flex flex-column flex-align-center'>
                  {!fetchState.isLoading && fetchState.error ? <h5>{JSON.stringify(fetchState.error)}</h5> : null}
                  <Button appearance="primary" style={{ width: 150 }} onClick={handleSubmit} loading={fetchState.isLoading}>Login</Button>
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