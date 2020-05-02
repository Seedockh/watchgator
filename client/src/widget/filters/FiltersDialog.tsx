import React, { FunctionComponent, useState } from 'react'
import { Modal, Button, Grid, TagPicker, Icon } from 'rsuite'
import { MinMax } from '../../models/MinMax'
import { FilterSection } from './FilterSection'
import { FilterRangeSlider } from './FilterRangeSlider'
import { useAllCategories, useSearchActors } from '../../hooks/api/useApi'
import { ItemDataType } from 'rsuite/lib/@types/common'

type FiltersDialogProps = {
    isOpen: boolean;
    onClose: () => void;
}

export const FiltersDialog: FunctionComponent<FiltersDialogProps> = ({ isOpen, onClose }) => {
    const { isLoading: categoriesLoading, data: categories } = useAllCategories();
    const { isLoading: actorsLoading, data: actors, search: searchActor } = useSearchActors();

    const [rating, setRating] = useState<MinMax>({ min: 7, max: 10 })
    const [year, setYear] = useState<MinMax>({ min: 2000, max: 2020 })

    const categoriesToInputData = (): ItemDataType[] => {
        if (!categories) return []
        return categories.map((cat) => ({ value: cat, label: cat }))
    }

    const actorsToInputData = (): ItemDataType[] => {
        if (!actors || !actors.results) return []
        return actors.results[0].map((actor) => ({
            value: actor.id,
            label: `${actor.firstname} ${actor.lastname}`
        }))
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
                            className='w-100 mt-4'
                            data={categoriesToInputData()}
                            placeholder='Select categories'
                            renderMenu={menu => {
                                if (categoriesLoading) {
                                    return <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
                                        <Icon icon="spinner" spin /> Loading...
                                    </p>
                                }
                                return menu;
                            }}
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
                    <FilterSection title="Actors">
                        <TagPicker
                            className='w-100 mt-4'
                            data={actorsToInputData()}
                            placeholder='Select actors'
                            onSearch={searchActor}
                            renderMenu={menu => {
                                if (actorsLoading) {
                                    return <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
                                        <Icon icon="spinner" spin /> Loading...
                                    </p>
                                }
                                return menu;
                            }}
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
