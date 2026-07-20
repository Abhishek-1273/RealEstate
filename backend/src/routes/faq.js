import express from 'express';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { managementPlus } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFaqs);
router.post('/', ...managementPlus, createFaq);
router.put('/:id', ...managementPlus, updateFaq);
router.delete('/:id', ...managementPlus, deleteFaq);

export default router;
