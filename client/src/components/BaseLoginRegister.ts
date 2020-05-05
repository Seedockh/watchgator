import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { UserGlobalState } from '../core/user'
import { useApiFetch } from '../hooks/api/useApiFetch'

export const BaseLoginRegister = (props: any) => {
    const [{ user }, dispatch] = UserGlobalState()
    const history = useHistory()

    const fetchState = useApiFetch<any>()

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

        fetchState.setLoading(true)
        const res = await fetch(`${url}`, {
            method: "POST",
            body: JSON.stringify(props.values),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 400) {
            fetchState.setError("Email or password incorrect")
        } else {
            res.json().then(res => {
                fetchState.setLoading(false)
                setUser(res)
            }).catch(fetchState.setError);
        }
    }

    return fetchState
}