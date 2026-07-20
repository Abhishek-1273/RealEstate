import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { managementPlus } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', ...managementPlus, updateSettings);

export default router;
