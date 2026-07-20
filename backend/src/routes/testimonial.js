import express from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { managementPlus } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', ...managementPlus, createTestimonial);
router.put('/:id', ...managementPlus, updateTestimonial);
router.delete('/:id', ...managementPlus, deleteTestimonial);

export default router;
