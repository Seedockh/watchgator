import { Navbar, Nav, Dropdown, Icon } from "rsuite"
import React, { FunctionComponent, CSSProperties } from "react";

const iconStyles: CSSProperties = {
    width: 56,
    height: 56,
    lineHeight: '56px'
};

type NavTogglePros = {
    expand: boolean;
    onChange: () => void;
}

export const NavToggle: FunctionComponent<NavTogglePros> = ({ expand, onChange }) => (
    <Navbar appearance="subtle" className="nav-toggle">
        <Navbar.Body>
            <Nav>
                <Dropdown
                    placement="topStart"
                    trigger="click"
                    renderTitle={children => {
                        return <Icon className='text-center' style={iconStyles} icon="cog" />;
                    }}
                >
                    <Dropdown.Item>Help</Dropdown.Item>
                    <Dropdown.Item>Settings</Dropdown.Item>
                    <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
            </Nav>

            <Nav pullRight>
                <Nav.Item onClick={onChange} className='text-center' style={{ width: 56 }}>
                    <Icon icon={expand ? 'angle-left' : 'angle-right'} />
                </Nav.Item>
            </Nav>
        </Navbar.Body>
    </Navbar>
);