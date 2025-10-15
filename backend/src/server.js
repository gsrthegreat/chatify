import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));
  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
