import React, { useState, CSSProperties, FunctionComponent } from 'react'
import { Sidenav, Sidebar as RSidebar, Icon, Nav, Dropdown, Toggle, Button } from 'rsuite'
import { useHistory } from 'react-router-dom'

import { ExpandBtn } from './ExpandBtn'
import { IconNames } from 'rsuite/lib/Icon';
import logo from '../../assets/logo.png';

const headerStyles: CSSProperties = {
    padding: '20px 10px',
    overflow: 'hidden',
    textAlign: 'center',
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
    path?: string
    items?: SubItem[]
}

type SidebarProps = {
    items: Item[]
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ items }) => {
    const [expand, setExpand] = useState(true)
    const history = useHistory()

    const handleToggle = () => {
        setExpand(!expand);
    }

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
                    <div style={headerStyles}>
                        <img src={logo} alt="Watchgator" style={imageStyles} />
                        {expand && (
                            <>
                                <br />
                                <h4 style={{ marginTop: 8 }}>WatchGator</h4>
                                <Button appearance="ghost" block onClick={() => {
                                    history.push(`/login`)}} > Login</Button>
                            </>
                        )}
                    </div>
                </Sidenav.Header>
                <hr />
                <Sidenav.Body>
                    <Nav>
                        {items.map((item, index) => {
                            if (!item.items) {
                                return (
                                    <Nav.Item eventKey={index} active icon={<Icon icon={item.icon} />} onClick={() => history.push(item.path!)}>
                                        {item.title}
                                    </Nav.Item>
                                )
                            }
                            return <Dropdown
                                eventKey={index}
                                trigger="hover"
                                title={item.title}
                                icon={<Icon icon={item.icon} />}
                                placement="rightStart"
                            >
                                {item.items.map((subItem, subIndex) => (
                                    <Dropdown.Item eventKey={`${index}-${subIndex}`}>
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
