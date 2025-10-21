import express from 'express';

import { signup, login, logout, updateProfile } from '../controllers/auth.control.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);  

router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, (_, res) => {
  res.status(200).json({ message: "User is authenticated" });
});

export default router;