import React, { FunctionComponent } from 'react'
import { TagGroup, Tag } from 'rsuite'

type TagList = {
    tags: string[]
}

export const TagList: FunctionComponent<TagList> = ({ tags }) => (
    <TagGroup>
        {tags.map((tag) => <Tag>{tag}</Tag>)}
    </TagGroup>
)
