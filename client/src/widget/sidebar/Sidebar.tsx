import React, { useState, CSSProperties, FunctionComponent } from 'react'
import { ExpandBtn } from './ExpandBtn'
import { Sidenav, Sidebar as RSidebar, Icon, Nav, Dropdown, Badge } from 'rsuite'
import { SVGIcon } from 'rsuite/lib/@types/common';
import { IconNames } from 'rsuite/lib/Icon';
import logo from '../../assets/logo.png';

const headerStyles: CSSProperties = {
    padding: 20,
    overflow: 'hidden',
    textAlign: 'center'
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

export const Sidebar: FunctionComponent<SidebarProps> = ({ items }) => {
    const [expand, setExpand] = useState(true)

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
                        <img src={logo} style={{ width: '100%' }} />
                        {expand && (
                            <>
                                <br />
                                <h4 style={{ marginTop: 8 }}>WatchGator</h4>
                            </>
                        )}
                    </div>
                </Sidenav.Header>
                <hr />
                <Sidenav.Body>
                    <Nav>
                        {items.map((item, index) => {
                            if (!item.items) {
                                return <Nav.Item eventKey={index} active icon={<Icon icon={item.icon} />}>
                                    {item.title}
                                </Nav.Item>
                            }
                            return <Dropdown
                                eventKey={index}
                                trigger="hover"
                                title={item.title}
                                icon={<Icon icon={item.icon} />}
                                placement="rightStart"
                            >
                                {item.items.map((subItem, subIndex) => (
                                    <Dropdown.Item eventKey={`${index}-${subIndex}`}>{subItem.title}</Dropdown.Item>
                                ))}
                            </Dropdown>
                        })}
                    </Nav>
                </Sidenav.Body>
            </Sidenav>
        </RSidebar>
    )
}
