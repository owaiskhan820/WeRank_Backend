import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) dotenv.config({ path: '.env' });
else dotenv.config({ path: '.env.example' });

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;
export const ALT_PORT = process.env.ALT_PORT;

