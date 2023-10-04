// userRouter.js
import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import {userValidationSchema, loginValidationSchema} from '../requestValidaton/user.js';
import validatePagination from '../../utils/assets/paginateValidation.js'; // Import the custom pagination validation middleware
import userService from '../../services/user/user.js';
import { verifyEmail, sendEmail } from '../../authentication/emailVarification.js';
import instanceOfUserDAO from '../../daos/user/user.js';
import { generateToken } from '../../authentication/authentication.js';

const authRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;

// Route for registering a new user
authRouter.post('/register', userValidationSchema, validateErrors, async (req, res) => {
  const body = req.body;
  const result = await userService.createUser(body);
  const response = apiOk(result);
  res.json(response);
});


authRouter.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  verifyEmail(token, res)
});


authRouter.post('/login', loginValidationSchema, async (req, res) => {
  const body = req.body;
  userService.validateUser(body, res)
});

authRouter.post('/forgot-password', async (req, res) => {
  const email = req.body.email;

  if(!email){
    return res.status(400).send('Email is required');

  }
  const user = await instanceOfUserDAO.userExists(email)
  if(!user){
    return res.status(400).send('User not found ');

  }
  const token = generateToken(user)
  user.passwordResetToken = token;
  await user.save();  

  await sendEmail(user, 'passwordReset')
  res.status(200).send('Password reset email sent');
} 

);
// 4. Reset Password:

authRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    // Find the user with the reset token
    const user = await UserModel.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    await user.save();

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 

// 6. Logout:
 
authRouter.post('/logout', async (req, res) => {
  try {
    // Invalidate user's session or token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default authRouter;
