import express from 'express';
import { uploadMiddleware, handleUpload } from '../controllers/uploadController.js';
import { managementPlus } from '../middleware/auth.js';

const router = express.Router();

// Allow admin and management staff to upload media
router.post('/', ...managementPlus, uploadMiddleware, handleUpload);

export default router;
