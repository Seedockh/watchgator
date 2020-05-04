import React from 'react'
import { TagGroup, Tag } from 'rsuite'

type TagListProps<T> = {
    tags: T[]
    renderTag: (tag: T) => string;
    onClose?: (tag: T) => void;
    className?: string;
}

export function TagList<T>({ tags, renderTag, onClose, className }: TagListProps<T>) {
    return <TagGroup className={className}>
        {tags.map((tag, index) => (
            <Tag
                key={index}
                closable={onClose ? true : false}
                onClose={() => {
                    if (onClose) {
                        onClose(tag)
                    }
                }}
            >
                {renderTag(tag)}
            </Tag>
        ))}
    </TagGroup>
}
