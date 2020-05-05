import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Form, Container, Content, Panel, Button, FormControl, ControlLabel, FormGroup, Uploader, Alert, Loader, Divider } from "rsuite"

import { Sidebar } from '../widget/sidebar/Sidebar'
import logo from "../assets/logo.png";
import { FileType } from 'rsuite/lib/Uploader';
import { UserGlobalState } from '../core/user';
import { useInput } from '../hooks/useInput';
import { useApiFetch } from '../hooks/api/useApiFetch';

export const Information = () => {
    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState(undefined);
    const [{ user }, dispatch] = UserGlobalState()
    const fetchState = useApiFetch<any>()

    const history = useHistory()

    const [avatar, setAvatar] = useState(user?.avatar ?? logo)
    const nickname = useInput(user?.nickname ?? '')

    const email = useInput(user?.email ?? "")
    const password = useInput("")
    const oldPassword = useInput('')

    if (!user) {
        history.push("/")
    }

    const previewFile = (file: any, callback: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const styles = {
        width: 150,
        height: 150
    };

    const setUser = (res: any) => {
        dispatch({ type: 'setUser', payload: res.data.user })
    }

    const fetchData = async (route: string, values: Object, test: string) => {
        fetchState.setLoading(true)

        const res = await fetch(`${process.env.REACT_APP_API_URI}/user/${route}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        });

        res.json().then(res => {
            // TODO: Handle error
        }).catch(fetchState.setError);
    }

    const updateGlobalInformation = () => {
        fetchData("update", { uuid: user?.uuid, nickname: nickname.value, email: email.value }, "global")
    }

    const updatePassword = () => {
        fetchData("update-password", { uuid: user?.uuid, currentPwd: oldPassword.value, newPwd: password.value }, "password")
    }

    return (
        <div className="sidebar-page">
            <Container>
                <Sidebar items={[
                    {
                        title: 'Update information',
                        icon: 'edit',
                        state: "active",
                        path: "/information"
                    },
                    {
                        title: 'Home',
                        icon: 'home',
                        path: "/"
                    },
                ]} userConnected={user} />
                <Content style={{ marginRight: 100 }}>
                    <Panel>
                        <h3>Update avatar</h3>
                        <Divider />
                        <Form>
                            <div className="flex flex-column flex-align-center mb-5">
                                <Uploader
                                    fileListVisible={false}
                                    listType="picture"
                                    headers={{
                                        'Autorization': `Bearer ${localStorage.getItem('token')}`
                                    }}
                                    action={`${process.env.REACT_APP_API_URI}/user/update-avatar`}
                                    onUpload={file => {
                                        setUploading(true);
                                        previewFile(file.blobFile, (value: any) => {
                                            setFileInfo(value);
                                        });
                                    }}
                                    onSuccess={(response: Object, file: FileType) => {
                                        setUploading(false);
                                        Alert.success('Uploaded successfully');
                                        console.log(response);
                                    }}
                                    onError={() => {
                                        setFileInfo(undefined);
                                        setUploading(false);
                                        Alert.error('Upload failed');
                                    }}
                                >
                                    <button style={styles}>
                                        {uploading && <Loader backdrop center />}
                                        {fileInfo ? (
                                            <img src={fileInfo ? fileInfo : logo} width="100%" height="100%" />
                                        ) : (
                                                <img src={avatar} width="100%" height="100%" />
                                            )}
                                    </button>
                                </Uploader>
                                <Button appearance="primary" >
                                    Update
                            </Button>
                            </div>
                        </Form>
                        <h3>Update global information</h3>
                        <Divider />
                        <Form>
                            <div className="flex flex-column flex-align-center mb-5">
                                <FormGroup >
                                    <ControlLabel>Pseudo</ControlLabel>
                                    <FormControl name="nickname" {...nickname.bind} />
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel>Email address</ControlLabel>
                                    <FormControl name="email" {...email.bind} />
                                </FormGroup>
                                <Button appearance="primary" onClick={updateGlobalInformation}>
                                    Update
                                </Button>
                            </div>
                        </Form>
                        <h3>Update password</h3>
                        <Divider />
                        <Form>
                            <div className="flex  flex-column flex-align-center mb-5">
                                <FormGroup>
                                    <ControlLabel>Old password</ControlLabel>
                                    <FormControl name="currentPwd" type="password" {...oldPassword.bind} />
                                </FormGroup>


                                <FormGroup>
                                    <ControlLabel>New password</ControlLabel>
                                    <FormControl name="newPwd" type="password" {...password.bind} />
                                </FormGroup>
                                {!fetchState.isLoading && fetchState.error ? <h5>{fetchState.error}</h5> : <></>}
                                <Button appearance="primary" onClick={updatePassword}>
                                    Update
                            </Button>
                            </div>
                        </Form>
                    </Panel>
                </Content>
            </Container>
        </div>
    )
}