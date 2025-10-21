import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from '../controllers/message.control.js';

const router = express.Router();

router.use(protectRoute);

router.get('/contacts', getAllContacts);
router.get('/chats', getChatPartners);
router.get('/:id', getMessagesByUserId);
router.post('/send/:id', sendMessage);

export default router;