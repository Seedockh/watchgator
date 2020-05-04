import React, { useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Content, ControlLabel, FlexboxGrid, Form, Panel, FormGroup, FormControl, Button } from 'rsuite'

import { UserGlobalState } from '../core/user'
import { ApiHook } from '../models/ApiHook';

const Register = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const values = { nickname, email, password }

  const [{ user }, dispatch] = UserGlobalState()
  const history = useHistory()
  const [fetchState, setFetchState] = useState<ApiHook<any>>({
    isLoading: false
  })

  if(user) {
    history.push('/')    
  }

  const redirectLogin = () => {
    history.push('/login')
  }

  const setUser = (res: any) => {
    dispatch({ type: 'setUser', payload: res.data.user })
    dispatch({ type: 'setToken', payload: res.meta.token })
  }

  const handleSubmit = async () => {
    setFetchState({ isLoading: true })
    const res = await fetch(`${process.env.REACT_APP_API_URI}/auth/signup`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json()
        .then(res => {
          if(res.error) {    
            const error = res.error.details;

            if(error.detail && error.detail.include('email')) {
              setFetchState({ isLoading: false, error: "User with this email already exist" })
            }
            
            error.forEach((item: any) => {
              const key = Object.keys(item.constraints)[0]
              setFetchState({ isLoading: false, error: item.constraints[key]})
            });

          } else {
            setFetchState({ isLoading: false })
            setUser(res)
          }
        })
        .catch(err => {
          console.log("API ERROR", err);
          setFetchState({ isLoading: false, error: err })
        });
  }

  return (
    <Container style={{ marginTop: "15%" }}>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={10}>
            <Panel header={<h3>Register</h3>} bordered>
              <Form fluid>
                <FormGroup>
                  <ControlLabel>Pseudo</ControlLabel>
                  <FormControl name="nickname"  onChange={(value) => setNickname(value)}/>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Email address</ControlLabel>
                  <FormControl name="email" onChange={(value) => setEmail(value)} />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl name="password" type="password" onChange={(value) => setPassword(value)} />
                </FormGroup>
                <FormGroup className='flex flex-column flex-align-center'>
                {!fetchState.isLoading && fetchState.error ? <h5>{fetchState.error}</h5> : <></>}
                  <Button appearance="primary" style={{ width: 150 }} onClick={handleSubmit}>Register</Button>
                  <FormGroup className='flex mt-3' style={{ alignItems: "baseline"}}>
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