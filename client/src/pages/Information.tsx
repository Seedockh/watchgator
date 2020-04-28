import React, { useState } from 'react'
import { Form, Container, Content, Panel, Button, FormControl, Icon, ControlLabel, FormGroup, Uploader, Alert, Loader } from "rsuite"

import { Sidebar } from '../widget/sidebar/Sidebar'
import logo from "../assets/logo.png";
import { FileType } from 'rsuite/lib/Uploader';

const Information = () => {
    const [uploading, setUploading] = useState(false);
    const [fileInfo, setFileInfo] = useState(undefined);

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
                        title: 'Profile',
                        icon: 'user',
                        path: "/profile"
                    },
                    {
                        title: 'Home',
                        icon: 'home',
                        path: "/"
                    },

                ]} />
                <Content style={{ marginRight: 100 }}>
                    <Panel>
                    <Form>
                        <div className="flex-colums">
                            <Uploader
                                fileListVisible={false}
                                listType="picture"
                                action="//jsonplaceholder.typicode.com/posts/"
                                onUpload={file => {
                                    setUploading(true);
                                    previewFile(file.blobFile, (value : any) => {
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
                                            <Icon icon="avatar" size="5x" />
                                        )}
                                </button>
                            </Uploader>
                            <FormGroup >
                                <ControlLabel>Username</ControlLabel>
                                <FormControl name="nickname" />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>Email address</ControlLabel>
                                <FormControl name="email" />
                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>Old password</ControlLabel>
                                <FormControl name="old_password" type="password" />
                            </FormGroup>


                            <FormGroup>
                                <ControlLabel>New password</ControlLabel>
                                <FormControl name="new_password" type="password" />
                            </FormGroup>

                            <Button appearance="primary" >
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

export default Information