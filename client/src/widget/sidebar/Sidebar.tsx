import React, { useState, CSSProperties, FunctionComponent } from 'react'
import { Sidenav, Sidebar as RSidebar, Icon, Nav, Dropdown, Toggle, Button } from 'rsuite'
import { useHistory } from 'react-router-dom'

import { ExpandBtn } from './ExpandBtn'
import { IconNames } from 'rsuite/lib/Icon';
import logo from '../../assets/logo.png';

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
}

export const Sidebar: FunctionComponent<SidebarProps> = ({ items, children }) => {
    const [expand, setExpand] = useState(true)
    const history = useHistory()

    const handleToggle = () => {
        setExpand(!expand);
    }

    return (
        <RSidebar
            style={{ minHeight: '100vh' }}
            width={expand ? 300 : 56}
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
                        <img src={logo} alt="Watchgator" style={imageStyles} />
                        {expand && (
                            <>
                                <br />
                                <h4 style={{ marginTop: 8 }}>WatchGator</h4>
                                <Button appearance="ghost" block onClick={() => {
                                    history.push(`/login`)
                                }} > Login</Button>
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
                                        <Toggle
                                            checkedChildren={<Icon icon="check" />}
                                            unCheckedChildren={<Icon icon="close" />}
                                        />
                                        <span style={{ marginLeft: 12 }}>{subItem.title}</span>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown>
                        })}
                        {expand && children}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </RSidebar>
    )
}
