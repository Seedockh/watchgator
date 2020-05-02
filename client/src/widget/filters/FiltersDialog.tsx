import React, { FunctionComponent, useState } from 'react'
import { Modal, Button, Grid, TagPicker } from 'rsuite'
import { MinMax } from '../../models/MinMax'
import { FilterSection } from './FilterSection'
import { FilterRangeSlider } from './FilterRangeSlider'
import { useAllCategories } from '../../hooks/api/useApi'
import { ItemDataType } from 'rsuite/lib/@types/common'

type FiltersDialogProps = {
    isOpen: boolean;
    onClose: () => void;
}

export const FiltersDialog: FunctionComponent<FiltersDialogProps> = ({ isOpen, onClose }) => {
    const { isLoading: categoriesLoading, data: categories } = useAllCategories();
    const [rating, setRating] = useState<MinMax>({ min: 7, max: 10 })
    const [year, setYear] = useState<MinMax>({ min: 2000, max: 2020 })

    const categoriesToInputData = (): ItemDataType[] => {
        console.log(categories);
        if (!categories) return []
        
        return categories.map((cat) => ({ value: cat, label: cat}))
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Advanced filters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid fluid>
                    <FilterSection title="Categories">
                        <TagPicker
                            className='mt-4'
                            data={categoriesToInputData()}
                            placeholder='Select categories'
                            
                            style={{ width: '100%' }}
                        />
                    </FilterSection>
                    <FilterSection title="Year">
                        <FilterRangeSlider
                            value={year}
                            range={{ min: 1950, max: 2020 }}
                            step={1}
                            onChange={setYear}
                        />
                    </FilterSection>
                    <FilterSection title="Rating">
                        <FilterRangeSlider
                            value={rating}
                            range={{ min: 0, max: 10 }}
                            step={0.5}
                            onChange={setRating}
                        />
                    </FilterSection>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} appearance="subtle">Cancel</Button>
                <Button onClick={onClose} appearance="primary">Apply filters</Button>
            </Modal.Footer>
        </Modal>
    )
}
