import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/user.router.js';
import projectRouter from './routes/project.router.js';
import bidRouter from './routes/bid.router.js';
import orderRouter from './routes/order.router.js';
import reviewRouter from './routes/review.router.js';
import paymentRouter from './routes/payment.router.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies
}));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/bid', bidRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/payments', paymentRouter);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});