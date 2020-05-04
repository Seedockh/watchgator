import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import User from '../core/user'
import { ApiHook } from '../models/ApiHook';

const BaseLoginRegister = (props: any) => {
    const [{ user }, dispatch] = User.GlobalState()
    const history = useHistory()

    const [fetchState, setFetchState] = useState<ApiHook<any>>({
        isLoading: false
    })

    useEffect(() => {
        // do something once here
        if (user) {
            history.push('/')
        } else {
            handleSubmit()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    const setUser = (res: any) => {
        dispatch({ type: 'setUser', payload: res.data.user })
        dispatch({ type: 'setToken', payload: res.meta.token })
    }


    const handleSubmit = async () => {
        const endUrl = props.isLogin ? "signin" : "signup"
        const url = `${process.env.REACT_APP_API_URI}/auth/${endUrl}`;

        setFetchState({ isLoading: true })
        const res = await fetch(`${url}`, {
            method: "POST",
            body: JSON.stringify(props.values),
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

    return fetchState
}

export default BaseLoginRegister;