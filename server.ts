import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import channelRoutes from './routes/channelRoutes';
import videoRoutes from './routes/videoRoutes';
import { swaggerSpec } from './swagger';




dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/channels', channelRoutes);

app.use('/videos', videoRoutes);


const PORT: number = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
  res.send('YouTube Analytics API is running 🚀');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});