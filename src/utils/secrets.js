import fs from 'fs';
import dotenv from 'dotenv';

if (fs.existsSync('.env')) dotenv.config({ path: '.env' });
else dotenv.config({ path: '.env.example' });

const { MONGODB_URI, PORT, ALT_PORT, SENDGRID_API_KEY } = process.env;

if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
if (!PORT) throw new Error('Missing PORT');
if (!ALT_PORT) throw new Error('Missing ALT_PORT');
if (!SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY');

export  { MONGODB_URI, PORT, ALT_PORT, SENDGRID_API_KEY };