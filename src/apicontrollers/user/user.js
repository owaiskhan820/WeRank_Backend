// userRouter.js
import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import {userValidationSchema, loginValidationSchema} from '../requestValidaton/user.js';
import userService  from '../../services/user/user.js';
import { verifyEmail, sendEmail } from '../../authentication/emailVarification.js';
import { authMiddleware, generateToken } from '../../authentication/authentication.js';
import { hashPassword } from '../../authentication/authentication.js';

const authRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;

// Route for registering a new user
authRouter.post('/register', userValidationSchema, validateErrors, async (req, res) => {
  const body = req.body;
  const result = await userService.createUser(body);
  const response = apiOk(result);
  res.json(response);
});

//varify email
authRouter.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  verifyEmail(token, res)
});

//login
authRouter.post('/login', loginValidationSchema, async (req, res) => {
  const body = req.body;
  userService.validateUser(body, res)
});

//forgot password
authRouter.post('/forgot-password', async (req, res) => {
  const email = req.body.email;

  if(!email){
    return res.status(400).send('Email is required');

  }
  const user = await userService.getUserByEmail(email);
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
  try {
    const token = req.query.token;
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await userService.getUserByEmail(email);

    // Check if user exists and token matches
    if (!user || user.passwordResetToken !== token) {
      return res.status(400).json({ msg: 'Invalid token or user does not exist' });
    }

    // Hash the new password and update user document
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = undefined; // You might want to clear the reset token
    await userService.saveUser(user);

    res.status(200).json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

authRouter.post('/update-interest', authMiddleware, async (req, res) => {

    // Get user from the request (populated by the authMiddleware)
    const user = await userService.getUserById(req.user._id);

    // Get the interest from the request body
    const { interestId } = req.body;

    // Check if the user already has this interest
    if (user.interests.includes(interestId)) {
      return res.status(400).json({ error: 'Interest already added' });
    }

    // Add new interest and save the user
    user.interests.push(interestId);
    await userService.saveUser(user);

    res.status(200).json({ message: 'Interest successfully updated', user });

});


authRouter.post('/delete-interest', authMiddleware, async (req, res) => {
  try {
    // Get user from the request (populated by the authMiddleware)
    
    const user = await userService.getUserById(req.user._id);

    // Get the interest from the request body
    const { interestId } = req.body;

    // Remove the interest from the user's interests
    user.interests = user.interests.filter(id => id.toString() !== interestId);

    // Save the updated user
    await userService.saveUser(user);

    res.status(200).json({ message: 'Interest successfully removed', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

authRouter.get("/get-interests", authMiddleware, async (req, res) =>{
  const userId = req.query.id
  const user = userService.getUserById(userId)
  const userInterests = user.interests;
  res.status(200).json({"interests": userInterests})
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
