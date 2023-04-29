import { createCard, deleteCard, getCards } from "../controllers/cards";
import { Router } from "express";

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);


export default router;