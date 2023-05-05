import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';
import {
  createCardValidator,
  deleteCardValidator,
  dislikeCardValidator,
  likeCardValidator,
} from '../utils/validators';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:cardId', deleteCardValidator, deleteCard);
router.put('/:cardId/likes', likeCardValidator, likeCard);
router.delete('/:cardId/likes', dislikeCardValidator, dislikeCard);

export default router;
