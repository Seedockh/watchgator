import React, { FunctionComponent, useState } from 'react'
import { Modal, Button, Grid, TagPicker, Icon, Input, List } from 'rsuite'
import { MinMax } from '../../models/MinMax'
import { FilterSection } from './FilterSection'
import { FilterRangeSlider } from './FilterRangeSlider'
import { useAllCategories, useSearchActors } from '../../hooks/api/useApi'
import { ItemDataType } from 'rsuite/lib/@types/common'
import { Actor } from '../../models/Actor'
import { TagList } from '../TagList'

type FiltersDialogProps = {
    isOpen: boolean;
    onClose: () => void;
}

export const FiltersDialog: FunctionComponent<FiltersDialogProps> = ({ isOpen, onClose }) => {
    const { isLoading: categoriesLoading, data: categories } = useAllCategories();
    const { data: actors, search: searchActor, query: queryActor } = useSearchActors();

    const [rating, setRating] = useState<MinMax>({ min: 7, max: 10 })
    const [year, setYear] = useState<MinMax>({ min: 2000, max: 2020 })
    const [selectedActors, setSelectedActors] = useState<Actor[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const categoriesToInputData = (): ItemDataType[] => {
        if (!categories) return []
        return categories.map((cat) => ({ value: cat, label: cat }))
    }
    console.log(selectedCategories);
    
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
                            onSelect={setSelectedCategories}
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
                        <Input className='mt-3' value={queryActor} onChange={searchActor} placeholder="Search an actor" />

                        <TagList
                            className='mt-3 mb-3'
                            tags={selectedActors}
                            renderTag={(a) => `${a.firstname} ${a.lastname}`}
                            onClose={(actor) => {
                                setSelectedActors(selectedActors.filter(({ id }) => id !== actor.id))
                            }}
                        />

                        <List bordered hover autoScroll>
                            {actors?.results[0]?.filter((a) => selectedActors.findIndex((sa) => sa.id === a.id) === -1).slice(0, 10).map((actor) => (
                                <div key={actor.id} onClick={() => {
                                    if (selectedActors.findIndex(({ id }) => id === actor.id) === -1) {
                                        setSelectedActors([...selectedActors, actor])
                                    }
                                    searchActor('')
                                }}>
                                    <List.Item>{actor.firstname} {actor.lastname}</List.Item>
                                </div>
                            ))}
                        </List>
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
