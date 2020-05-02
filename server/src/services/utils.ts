import User from '../database/models/User'
import { EndpointAccessError } from '../core/CustomErrors'

export const throwIfManipulateSomeoneElse = (
	token: string | undefined,
	userUuid: string,
): void => {
	if (typeof token == 'undefined') throw new EndpointAccessError()
	if (!User.tokenBelongsToUser(token, userUuid)) throw new EndpointAccessError()
}
