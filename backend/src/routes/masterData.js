import express from 'express';
import {
  getMasterData,
  getMasterDataList,
  createMasterData,
  updateMasterData,
  deleteMasterData,
} from '../controllers/masterDataController.js';
import { adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route to fetch all active grouped master data
router.get('/', getMasterData);

// Admin-only CRUD operations
router.get('/list',  ...adminOnly, getMasterDataList);
router.post('/',     ...adminOnly, createMasterData);
router.put('/:id',    ...adminOnly, updateMasterData);
router.delete('/:id', ...adminOnly, deleteMasterData);

export default router;
