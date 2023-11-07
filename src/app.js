import express from 'express';
import { MONGODB_URI, PORT, SENDGRID_API_KEY } from './utils/secrets.js'; // Make sure to provide the correct path
import  DBConnect  from './config/database/connection.js';
import cors from "cors";
import authRouter from './apicontrollers/user/user.js'
import categoryRouter from './apicontrollers/category/category.js'
import listRouter from './apicontrollers/list/list.js'
import profileRouter from './apicontrollers/profile/profile.js'
import watchlistRouter from './apicontrollers/watchlist/watchlist.js';
import pkg from 'body-parser'; //middleware used for parsing POST requests
import followRouter from './apicontrollers/follow/follow.js';



const { json } = pkg;


const app = express();  
const mongoUrl = MONGODB_URI;
DBConnect(mongoUrl);

app.set("port", PORT || 3000);
app.use(cors());
app.use(express.json());
app.listen(app.get("port"), () => {console.log(`Server is listening on port ${app.get("port")}`);});


// register all new routers here ( for ex listRouter, commentRouter, replyRouter)
app.use('/api/v1/user', authRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/list', listRouter)
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/follow', followRouter)
app.use('/api/v1/watchlist', watchlistRouter)