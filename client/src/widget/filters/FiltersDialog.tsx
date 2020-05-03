import React, { FunctionComponent, useState, useEffect } from 'react'
import { Modal, Button, Grid, TagPicker, Icon, Input, List } from 'rsuite'
import { FilterSection } from './FilterSection'
import { FilterRangeSlider } from './FilterRangeSlider'
import { useAllCategories, useSearchActors } from '../../hooks/api/useApi'
import { ItemDataType } from 'rsuite/lib/@types/common'
import { TagList } from '../TagList'
import { MovieFilter } from '../../models/MovieFilter'

type FiltersDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: MovieFilter) => void;
    initFilters?: MovieFilter;
}

const kDefaultFilters: MovieFilter = {
    rating: { min: 7, max: 10 },
    years: { min: 2000, max: 2020 },
    categories: [],
    actors: []
}

export const FiltersDialog: FunctionComponent<FiltersDialogProps> = ({ isOpen, onClose, onApplyFilters, initFilters }) => {
    const { isLoading: categoriesLoading, data: categories } = useAllCategories();
    const { data: actors, search: searchActor, query: queryActor } = useSearchActors();

    const [filters, setFilters] = useState<MovieFilter>(kDefaultFilters)

    useEffect(() => {
        setFilters(initFilters ?? kDefaultFilters)
    }, [isOpen])

    const categoriesToInputData = (): ItemDataType[] => {
        if (!categories) return []
        return categories.map((cat) => ({ value: cat, label: cat }))
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
                            value={filters.categories}
                            onSelect={(value) => {
                                setFilters({ ...filters, categories: value })
                            }}
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
                            value={filters.years}
                            range={{ min: 1950, max: 2020 }}
                            step={1}
                            onChange={(years) => {
                                setFilters({ ...filters, years })
                            }}
                        />
                    </FilterSection>
                    <FilterSection title="Rating">
                        <FilterRangeSlider
                            value={filters.rating}
                            range={{ min: 0, max: 10 }}
                            step={0.5}
                            onChange={(rating) => {
                                setFilters({ ...filters, rating })
                            }}
                        />
                    </FilterSection>
                    <FilterSection title="Actors">
                        <Input className='mt-3' value={queryActor} onChange={searchActor} placeholder="Search an actor" />

                        <TagList
                            className='mt-3 mb-3'
                            tags={filters.actors}
                            renderTag={(a) => `${a.firstname} ${a.lastname}`}
                            onClose={(actor) => {
                                setFilters({ ...filters, actors: filters.actors.filter(({ id }) => id !== actor.id) })
                            }}
                        />

                        <List bordered hover autoScroll>
                            {actors?.results[0]?.filter((a) => filters.actors.findIndex((sa) => sa.id === a.id) === -1).slice(0, 10).map((actor) => (
                                <div key={actor.id} onClick={() => {
                                    if (filters.actors.findIndex(({ id }) => id === actor.id) === -1) {
                                        setFilters({ ...filters, actors: [...filters.actors, actor] })
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
                <Button onClick={() => {
                    onClose();
                    onApplyFilters(filters);
                }} appearance="primary">Apply filters</Button>
            </Modal.Footer>
        </Modal>
    )
}
