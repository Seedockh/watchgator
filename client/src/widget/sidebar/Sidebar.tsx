import React, { useState, CSSProperties, FunctionComponent } from 'react'
import { Sidenav, Sidebar as RSidebar, Button, Nav, Dropdown, Toggle } from 'rsuite'
import { useHistory } from 'react-router-dom'

import { ExpandBtn } from './ExpandBtn'
import Icon, { IconNames } from 'rsuite/lib/Icon';
import logo from '../../assets/logo.png';
import { User } from '../../models/api/User';

const headerStyles: CSSProperties = {
    overflow: 'hidden'
};

const imageStyles: CSSProperties = {
    maxWidth: 150,
    width: '100%'
};

type SubItem = {
    title: string
    path: string
}

type Item = {
    title: string
    icon: IconNames
    items?: SubItem[]
}

type SidebarProps = {
    items: Item[]
    userConnected?: User | null
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ items, userConnected }) => {
    const [expand, setExpand] = useState(true)
    const history = useHistory()

    const handleToggle = () => {
        setExpand(!expand);
    }

    const logged = () => <>
        <img src={userConnected?.avatar ? userConnected?.avatar : logo} alt="Watchgator" style={imageStyles} />
        {expand && <>
            <br />
            <h4 className="mt-2">{userConnected?.nickname}</h4>
            {/* <Nav>
                <Nav.Item icon={<Icon icon="edit" />} onClick={() => history.push('/profile')}>
                    Profile
                </Nav.Item>
                <Nav.Item icon={<Icon icon="list-ul" />} onClick={() => history.push('/playlists')}>
                    Playlist
                </Nav.Item>
            </Nav> */}
        </>}
    </>

    const notLogged = () => <>
        <img src={logo} alt="Watchgator" style={imageStyles} />
        {expand && <>
            <br />
            <h4 style={{ marginTop: 8 }}>WatchGator</h4>
            <Button
                appearance="ghost"
                block
                onClick={() => {
                    history.push(`/login`)
                }}
            >
                Login
                </Button>
        </>}
    </>

    const navItems: Item[] = [
        ...(userConnected ? [
            {
                title: 'Profile',
                icon: 'edit',
            } as Item,
            {
                title: 'Playlists',
                icon: 'list-ul',
            } as Item
        ] : []),
        ...items
    ]

    return (
        <RSidebar
            style={{ minHeight: '100vh' }}
            width={expand ? 260 : 56}
            collapsible
        >
            <Sidenav
                expanded={expand}
                defaultOpenKeys={['3']}
                appearance="default"
                style={{ position: 'relative', height: '100%' }}
            >
                <ExpandBtn expand={expand} onPress={handleToggle} />
                <Sidenav.Header>
                    <div className='pt-5 pb-5 pl-3 pr-3 text-center' style={headerStyles}>
                        {userConnected ? logged() : notLogged()}
                    </div>
                </Sidenav.Header>
                <hr />
                <Sidenav.Body>
                    <Nav>
                        {navItems.map((item, index) => {
                            if (!item.items) {
                                return (
                                    <Nav.Item key={index} eventKey={index} active icon={<Icon icon={item.icon} />}>
                                        {item.title}
                                    </Nav.Item>
                                )
                            }
                            return <Dropdown
                                key={index}
                                eventKey={index}
                                trigger="hover"
                                title={item.title}
                                icon={<Icon icon={item.icon} />}
                                placement="rightStart"
                            >
                                {item.items.map((subItem, subIndex) => (
                                    <Dropdown.Item key={`${index}-${subIndex}`} eventKey={`${index}-${subIndex}`}>
                                        <>
                                            <Toggle checkedChildren={<Icon icon="check" />} unCheckedChildren={<Icon icon="close" />} />
                                            <span style={{ marginLeft: 12 }}>{subItem.title}</span>
                                        </>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        })}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </RSidebar>
    )
}
