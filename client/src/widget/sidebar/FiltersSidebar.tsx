import React, { useState, useEffect, FunctionComponent } from 'react'
import { useApiFetch, useApiFetchSearch } from '../../hooks/api/useApiFetch';
import { Actor } from '../../models/api/Actor';
import { MovieFilter } from '../../models/MovieFilter';
import { getCategories, searchActor } from '../../core/api/Api';
import { ItemDataType } from 'rsuite/lib/@types/common';
import { TagPicker, Icon, Input, Loader, List, Button } from 'rsuite';
import { FilterSection } from '../../widget/filters/FilterSection';
import { FilterRangeSlider } from '../../widget/filters/FilterRangeSlider';
import { TagList } from '../../widget/TagList';
import { Sidebar } from './Sidebar';
import { ActorAvatar } from '../ActorAvatar';

type FiltersSidebarProps = {
    initFilters?: MovieFilter;
    onApplyFilters: (filters: MovieFilter) => void;
}

const kDefaultFilters: MovieFilter = {
    rating: { min: 0, max: 10 },
    years: { min: 1960, max: 2020 },
    runtime: { min: 0, max: 400 },
    metaScore: { min: 0, max: 100 },
    categories: [],
    actors: []
}

export const FiltersSidebar: FunctionComponent<FiltersSidebarProps> = ({ initFilters, onApplyFilters }) => {
    const categoriesFetch = useApiFetch<string[]>({ isLoading: true });
    const actorsFetch = useApiFetchSearch<Actor[], string>();

    const [filters, setFilters] = useState<MovieFilter>(kDefaultFilters)

    useEffect(() => {
        setFilters(initFilters ?? kDefaultFilters)
        getCategories()
            .then(categoriesFetch.setData)
            .catch(categoriesFetch.setError)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSearchActor = (query: string) => {
        actorsFetch.search(query);
        console.log(query);

        actorsFetch.setLoading(true)
        searchActor(query)
            .then(actorsFetch.setData)
            .catch(actorsFetch.setError)
    }

    const categoriesToInputData = (): ItemDataType[] => {
        if (!categoriesFetch.data) return []
        return categoriesFetch.data.map((cat) => ({ value: cat, label: cat }))
    }

    const onReset = () => {
        setFilters(kDefaultFilters);
        onApplyFilters(kDefaultFilters)
    }

    const displayActor = (): Actor[] => {
        return actorsFetch.data
            ?.filter((a) => filters.actors.findIndex(({ id }) => id === a.id) === -1)
            .slice(0, 10) ?? []
    }

    return (
        <Sidebar items={[]}>
            <div className="p-3">
                <FilterSection title="Categories">
                    <TagPicker
                        className='w-100'
                        data={categoriesToInputData()}
                        placeholder='Select categories'
                        value={filters.categories}
                        onChange={(value) => {
                            setFilters({ ...filters, categories: value })
                        }}
                        onSelect={(value) => {
                            setFilters({ ...filters, categories: value })
                        }}
                        renderMenu={menu => {
                            if (categoriesFetch.isLoading) {
                                return <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
                                    <Icon icon="spinner" spin /> Loading...
                                    </p>
                            }
                            return menu;
                        }}
                    />
                </FilterSection>
                <FilterSection title="Year" subtitle={`${filters.years.min} - ${filters.years.max}`}>
                    <FilterRangeSlider
                        value={filters.years}
                        range={kDefaultFilters.years}
                        step={1}
                        onChange={(years) => {
                            setFilters({ ...filters, years })
                        }}
                    />
                </FilterSection>
                <FilterSection title="Rating" subtitle={`${filters.rating.min} - ${filters.rating.max}`}>
                    <FilterRangeSlider
                        value={filters.rating}
                        range={kDefaultFilters.rating}
                        step={0.5}
                        onChange={(rating) => {
                            setFilters({ ...filters, rating })
                        }}
                    />
                </FilterSection>
                <FilterSection title="Actors">
                    <Input className='mt-3' value={actorsFetch.query} onChange={onSearchActor} placeholder="Search an actor" />

                    <TagList
                        className='mt-3 mb-3'
                        tags={filters.actors}
                        renderTag={(a) => `${a.firstname} ${a.lastname}`}
                        onClose={(actor) => {
                            setFilters({ ...filters, actors: filters.actors.filter(({ id }) => id !== actor.id) })
                        }}
                    />



                    {actorsFetch.isLoading && <Loader />}
                    {!actorsFetch.isLoading && (actorsFetch.data?.length ?? 0) > 0 && (
                        <List bordered hover>
                            {displayActor().map((actor) => (
                                <div key={actor.id} onClick={() => {
                                    if (filters.actors.findIndex(({ id }) => id === actor.id) === -1) {
                                        setFilters({ ...filters, actors: [...filters.actors, actor] })
                                    }
                                    onSearchActor('')
                                }}>
                                    <List.Item style={{ fontSize: 14 }}>
                                        <div className='flex flex-align-center'>
                                            <ActorAvatar actor={actor} />
                                            <span className='ml-3' style={{ flex: 1 }}>{actor.firstname} {actor.lastname}</span>
                                        </div>
                                    </List.Item>
                                </div>
                            ))}
                        </List>
                    )}
                </FilterSection>

                <FilterSection title="Runtime" subtitle={`${filters.runtime.min} - ${filters.runtime.max}`}>
                    <FilterRangeSlider
                        value={filters.runtime}
                        range={kDefaultFilters.runtime}
                        step={5}
                        onChange={(runtime) => {
                            setFilters({ ...filters, runtime })
                        }}
                    />
                </FilterSection>

                <FilterSection title="MetaScore" subtitle={`${filters.metaScore.min} - ${filters.metaScore.max}`}>
                    <FilterRangeSlider
                        value={filters.metaScore}
                        range={kDefaultFilters.metaScore}
                        step={5}
                        onChange={(metaScore) => {
                            setFilters({ ...filters, metaScore })
                        }}
                    />
                </FilterSection>

                <Button className='mb-4' onClick={() => onApplyFilters(filters)} appearance="primary" block>
                    Apply filters
                </Button>

                <Button onClick={onReset} appearance="ghost" color='orange' block>
                    Reset
                </Button>

            </div>

        </Sidebar>
    )
}
