import React, { FunctionComponent, CSSProperties } from 'react'
import { Icon } from 'rsuite'

const btnStyle: CSSProperties = {
    position: 'absolute',
    right: -20,
    bottom: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: '12px 20px'
}

const iconStyle: CSSProperties = {
    verticalAlign: 'middle',
    textAlign: 'center'
}

type ExpandBtnProps = {
    expand: boolean
    onPress: () => void
}

export const ExpandBtn: FunctionComponent<ExpandBtnProps> = (props) => {
    return (
        <div style={btnStyle} onClick={props.onPress}>
            <Icon size="lg" icon={props.expand ? 'angle-left' : 'angle-right'} style={iconStyle} />
        </div>
    )
}
