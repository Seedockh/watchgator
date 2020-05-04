import React, { FunctionComponent } from 'react'

type FilterSectionProps = {
    title: string;
    subtitle?: string;
}

export const FilterSection: FunctionComponent<FilterSectionProps> = ({ title, subtitle, children }) => (
    <div className='mb-6'>
        <h5 className='mb-4'>{title} {subtitle && <small>{subtitle}</small>}</h5>
        {children}
    </div>
)
