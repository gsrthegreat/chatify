import { send } from '../controllers/message.control.js';
import express from 'express';

const router = express.Router();

router.get('/send', send);

export default router;