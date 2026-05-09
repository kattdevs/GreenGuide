import { Router } from 'express';
import {
getAllItems, getItemById, createItem, updateItem, deleteItem
} from '../controllers/items.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
const router = Router();
// Any authenticated user can READ
router.get('/', protect, getAllItems);
router.get('/:id', protect, getItemById);
// Only ADMINS can CREATE, UPDATE, DELETE
router.post('/', protect, adminOnly, createItem);
router.put('/:id', protect, adminOnly, updateItem);
router.delete('/:id', protect, adminOnly, deleteItem);
export default router;