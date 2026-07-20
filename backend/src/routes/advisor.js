import express from 'express';
import { getAdvisors, createAdvisor, updateAdvisor, deleteAdvisor } from '../controllers/advisorController.js';
import { managementPlus } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAdvisors);
router.post('/', ...managementPlus, createAdvisor);
router.put('/:id', ...managementPlus, updateAdvisor);
router.delete('/:id', ...managementPlus, deleteAdvisor);

export default router;
