import express from 'express';
import { MONGODB_URI, PORT } from './utils/secrets.js'; // Make sure to provide the correct path
import  DBConnect  from './config/database/connection.js';
import cors from "cors";
import userRouter from './apicontrollers/user/user.js'
import pkg from 'body-parser';
const { json } = pkg;


const app = express();
const mongoUrl = MONGODB_URI;
DBConnect(mongoUrl);

app.set("port", PORT || 3000);
app.use(cors());
app.use(express.json());
app.listen(app.get("port"), () => {console.log(`Server is listening on port ${app.get("port")}`);});


// register all new routers here ( for ex listRouter, commentRouter, replyRouter)
app.use('/api/v1/user', userRouter);
