import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userService from '../../services/user/user.js';


const SECRET_KEY = process.env.JWT_SECRET  

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email
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


export const authenticateUser = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Incorrect password');
  }

  const token = generateToken(user);
  return { user, token };
};


export const authMiddleware = (req, res, next) => {
  const token = req.query.token
  if (!token) return res.status(401).send('Access Denied: No Token Provided');
    const user = verifyToken(token)
    req.user = user
    next();
};