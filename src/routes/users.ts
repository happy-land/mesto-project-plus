import { Router } from 'express';
import {
  getUserById,
  getUsers,
  updateAvatar,
  updateUser,
  getUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
