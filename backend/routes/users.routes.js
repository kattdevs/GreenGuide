import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/users.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
const router = Router();
// Admin only
router.get('/', protect, adminOnly, getAllUsers);
router.patch('/:id/role', protect, adminOnly, updateUserRole);
export default router;