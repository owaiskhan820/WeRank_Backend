import express from 'express';
import { MONGODB_URI, PORT } from './utils/secrets.js';
import DBConnect from './config/database/connection.js';
import cors from "cors";
import authRouter from './apicontrollers/user/user.js';
import categoryRouter from './apicontrollers/category/category.js';
import listRouter from './apicontrollers/list/list.js';
import profileRouter from './apicontrollers/profile/profile.js';
import watchlistRouter from './apicontrollers/watchlist/watchlist.js';
import feedRouter from './apicontrollers/userFeed/userFeed.js';
import followRouter from './apicontrollers/follow/follow.js';
import notificationsRouter from './apicontrollers/notifications/notifications.js';
import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
import fileUploadController from './apicontrollers/fileUploadController/fileUploadController.js'

config(); // This loads variables from .env

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});





const app = express();  
const mongoUrl = MONGODB_URI;
DBConnect(mongoUrl);

app.set("port", PORT || 3000);
app.use(cors());
app.use(express.json());

// register all new routers here
app.use('/api/v1/user', authRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/list', listRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/follow', followRouter);
app.use('/api/v1/watchlist', watchlistRouter);
app.use('/api/v1/userFeed', feedRouter);
app.use('/api/v1/notify', notificationsRouter);
app.use('/api/v1/files', fileUploadController);

app.listen(app.get("port"), () => {
  console.log(`Server is listening on port ${app.get("port")}`);
});
