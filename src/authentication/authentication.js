import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';

const SECRET_KEY = process.env.JWT_SECRET  

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token expiration is optional
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    console.log(e);
    return null;
  }
};


export const authenticateUserMiddleware = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });
  
      req.user = user; // add user to request object
      next();
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  };
  
  export const verifyTokenMiddleware = (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: 'No token provided' });
  
      const user = verifyToken(token);
      if (!user) return res.status(401).json({ error: 'Invalid token' });
  
      req.user = user; // add user to request object
      next();
    } catch (error) {
      res.status(500).json({ error: 'Token verification failed' });
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
