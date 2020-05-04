import React, { FunctionComponent } from 'react'
import { RangeSlider } from 'rsuite'
import { MinMax } from '../../models/api/MinMax'

type FilterRangeSliderProps = {
    range: MinMax;
    value: MinMax;
    step: number;
    onChange: (value: MinMax) => void;
}

export const FilterRangeSlider: FunctionComponent<FilterRangeSliderProps> = ({ range, value, step, onChange }) => {
    const sliderMark = (mark: number): string => {
        if (mark === range.min || mark === range.max || mark === value.min || mark === value.max) {
            return `${mark}`;
        }
        return '';
    }

    return <RangeSlider
        className='ml-4 mt-5 mr-6'
        graduated
        progress
        value={[value.min, value.max]}
        onChange={value => {
            onChange({ min: value[0], max: value[1] })
        }}
        min={range.min}
        max={range.max}
        step={step}
        renderMark={mark => sliderMark(mark)}
    />
}
