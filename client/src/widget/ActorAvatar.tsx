import React, { FunctionComponent, CSSProperties } from 'react'
import { addPictureUrlSize } from '../utils/movieUtils'
import { Actor } from '../models/Actor'

type ActorAvatarProps = {
    actor: Actor;
    className?: string;
    style?: CSSProperties;
    size?: number;
}

export const ActorAvatar: FunctionComponent<ActorAvatarProps> = ({ actor, size = 40, className, style = {} }) => (
    <div className={`avatar ${className}`} style={{ width: size, height: size, ...style }}>
        <img src={addPictureUrlSize(actor.picture, 200)} alt={`${actor.firstname} ${actor.lastname}`} />
    </div>
)