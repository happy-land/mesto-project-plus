import { createCard, deleteCard, dislikeCard, getCards, likeCard } from "../controllers/cards";
import { Router } from "express";

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);


export default router;