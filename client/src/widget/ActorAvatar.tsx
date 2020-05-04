import React, { FunctionComponent } from 'react'
import { addPictureUrlSize } from '../utils/movieUtils'
import { Actor } from '../models/Actor'

type ActorAvatarProps = {
    actor: Actor;
}

export const ActorAvatar: FunctionComponent<ActorAvatarProps> = ({ actor }) => (
    <div className="avatar">
        <img src={addPictureUrlSize(actor.picture, 200)} alt={`${actor.firstname} ${actor.lastname}`} />
    </div>
)