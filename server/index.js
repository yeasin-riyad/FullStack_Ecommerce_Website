//External import
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';


// Internal Imports --------------------------------
import connectDB from './config/connectDb.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import addToCart from './route/addToCart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';

dotenv.config();
const app = express();


app.use(cors(
    {
        // origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }
));

app.use(express.urlencoded({ extended: true })); // Form Data পার্স করার জন্য

app.use(express.json());  // JSON পার্স করার জন্য middleware
app.use(cookieParser());
app.use(morgan());

app.use(helmet(
    {
        crossOriginEmbedderPolicy: false,
    }
));

const port=process.env.PORT

//Routes
app.get('/', (req, res) =>{
    res.json({
        message: 'Welcome to the Express Server '+port
    })
})

// Routes
app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',addToCart)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

connectDB().then(()=>{
    app.listen(port, () => console.log(`Server running on port ${port}`))
});


