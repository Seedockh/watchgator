import React, { CSSProperties, FunctionComponent } from 'react'
import { IconButton, Icon } from 'rsuite'

const iconStyle: CSSProperties = {
    fontSize: 35,
    width: 80,
    height: 80,
    padding: '16px 0'
}
const btnStyle: CSSProperties = {
    width: 80,
    height: 80
}

type FilterButtonProps = {
    onClick: () => void
}

export const FilterButton: FunctionComponent<FilterButtonProps> = ({ onClick }) => (
    <IconButton
        icon={<Icon icon="filter" style={iconStyle} />}
        circle
        color='green'
        size="lg"
        style={btnStyle}
        className='bottomRightFixed rs-panel-shaded'
        onClick={onClick}
    />
)
