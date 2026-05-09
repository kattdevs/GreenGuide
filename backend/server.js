import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import itemRoutes from './routes/items.routes.js';
import userRoutes from './routes/users.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware 
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
// nn Routes 
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
//  Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
// Global error handler 
app.use((err, _req, res, _next) => {
console.error(err.stack);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`));
