import { Router } from 'express'
import UserController from '../../controllers/rest/UserController'
import UserRepository from '../../database/repositories/UserRepository'
import { User } from '../../database/models/User'
import { Request } from 'express'

const router = Router()

const canExecOnItself = async (req: Request): Promise<boolean> => {
	try {
		const token = req.headers.authorization?.replace('Bearer ', '')
		const user = await UserRepository.get({ uuid: req.params.uuid })
		if (
			typeof token == 'undefined' ||
			user == undefined ||
			typeof user == 'undefined'
		)
			return false
		if (!User.tokenBelongsToUser(token, user.uuid)) return false
		return true
	} catch (err) {
		return false
	}
}

// router.get('/get/:uuid', async (req, res) => {
//     if(await canExecOnItself(req)) UserController.getUser(req, res);
//     else{ return res.status(403).json({error: 'Only operations on its own user are allowed!'}) }
// })

router.get('/get/:uuid', UserController.getUser)
router.put('/update-avatar', UserController.updateAvatar)
router.delete('/delete-avatar/:fileKey', UserController.deleteAvatar)
// router.delete('/delete/:uuid', UserController.deleteUser)
router.delete('/delete/:uuid', async (req, res) => {
	if (await canExecOnItself(req)) UserController.deleteUser(req, res)
	else {
		return res
			.status(403)
			.json({ error: 'Only operations on its own user are allowed!' })
	}
})

export default router
