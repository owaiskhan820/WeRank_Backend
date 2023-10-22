import express from 'express';
import { MONGODB_URI, PORT, SENDGRID_API_KEY } from './utils/secrets.js'; // Make sure to provide the correct path
import  DBConnect  from './config/database/connection.js';
import cors from "cors";
import authRouter from './apicontrollers/user/user.js'
import categoryRouter from './apicontrollers/category/category.js'
import listRouter from './apicontrollers/list/list.js'

import pkg from 'body-parser'; //middleware used for parsing POST requests
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
app.use('/api/v2/category', categoryRouter);
app.use('/api/v3/list', listRouter)