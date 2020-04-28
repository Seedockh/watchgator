import React, { FunctionComponent, CSSProperties } from 'react'
import { Icon, IconButton } from 'rsuite'

const btnStyle: CSSProperties = {
    position: 'absolute',
    right: -23,
    top: 63,
}

type ExpandBtnProps = {
    expand: boolean
    onPress: () => void
}

export const ExpandBtn: FunctionComponent<ExpandBtnProps> = (props) => (
    <IconButton
        icon={<Icon icon={props.expand ? 'angle-left' : 'angle-right'} />}
        circle
        size="lg"
        onClick={props.onPress}
        style={btnStyle}
    />
)