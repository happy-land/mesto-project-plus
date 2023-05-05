import { Router } from 'express';
import {
  getUserById,
  getUsers,
  updateAvatar,
  updateUser,
  getUser,
} from '../controllers/users';
import { getUserByIdValidator, updateAvatarValidator, updateUserValidator } from '../utils/validators';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserByIdValidator, getUserById);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

export default router;
