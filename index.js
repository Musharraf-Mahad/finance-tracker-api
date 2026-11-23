import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js'
import transactionRoutes from './routes/transaction.js'
import uploadRoutes from './routes/upload.js'
import categoryRoutes from './routes/category.js'

import { logger } from './middlewares/logger.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { limiter } from './middlewares/rateLimiter.js';


const app = express();
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5879",
    }
))

app.use(limiter)

app.use(helmet());

app.use(logger)


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV !== 'production') {
  console.log('👨‍💻 Development mode – logs and debug enabled');
}


//routes
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/transactions', transactionRoutes)
app.use('/upload', uploadRoutes);
app.use("/categories", categoryRoutes);

app.use(notFound)

app.use(errorHandler)

mongoose.connect(process.env.NODE_ENV === "development" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI_PRO)
  .then(() => console.log('✅ MongoDB connected locally'))
  .catch(err => console.error('❌ Connection error:', err));


app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
