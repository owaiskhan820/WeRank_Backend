import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';

const SECRET_KEY = process.env.JWT_SECRET  

export const generateToken = (user) => {
  const payload = {
    email: user.email,
  };
  return jwt.sign(payload, SECRET_KEY); 
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); // 10 is the saltRounds, adjust as necessary
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const authenticateUser = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) return null;

  return generateToken(user);
};

export const authMiddleware = (req, res, next) => {
  const token = req.header.token
  if (!token) return res.status(401).send('Access Denied: No Token Provided');
    const user = verifyToken(token)
    req.user = user
    next();
};