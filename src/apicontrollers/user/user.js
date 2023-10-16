// userRouter.js
import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import {userValidationSchema, loginValidationSchema} from '../requestValidaton/user.js';
import userService  from '../../services/user/user.js';
import { verifyEmail, sendEmail } from '../../authentication/emailVarification.js';
import { authMiddleware, generateToken } from '../../authentication/authentication.js';
import { hashPassword } from '../../authentication/authentication.js';
import { authenticateUser } from '../../authentication/authentication.js';
import categoryService from '../../services/category/category.js'

const authRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;

// Route for registering a new user
authRouter.post('/register', userValidationSchema, validateErrors, async (req, res) => {
  const body = req.body;
  const user = await userService.createUser(body);
  const response = apiOk(user);
  await sendEmail(user, 'verification')
  res.json(response);
});

authRouter.get('/getAll', async (req, res) => {
  const users = await userService.getAllUsers();
  console.log(users)
  res.status(200).json({ message: users });

});

authRouter.get('/getUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;  // Get the ID from the route parameters
    const user = await userService.getUserById(userId);  // Fetch the user by ID

    if (!user) {  // Check if user exists
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);  // Return the fetched user

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

//varify email
authRouter.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  verifyEmail(token, res)
});


authRouter.delete('/delete-user/:userId', async (req, res) => {
  try {
    // Get user ID from the URL
    const userId = req.params.userId;

    // Delete user
    await userService.deleteUserById(userId);

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//login
  authRouter.post('/login', loginValidationSchema, async (req, res) => {
    const body = req.body;
    authenticateUser(body.email, body.password, res)
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
  await userService.saveUser(user);

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
      if ( user.passwordResetToken !== token) {
      return res.status(400).json({ msg: 'Invalid token ' });
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


  authRouter.post('/add-interest', authMiddleware, async (req, res) => {
  
    // Get user from the request (populated by the authMiddleware)
    const user = await userService.getUserById(req.user.id);
    // Get the interest name from the request body
    const { interestId } = req.body;
    
    // Fetch the category by its name
    const category = await categoryService.getCategoryById(interestId);
    
    // Check if the category exists
    if (category.error) {
      return res.status(404).json({ error: 'Interest does not exist' });
    }


    if (user.interests.some(interest => interest.toString() === category._id.toString())) {
      return res.status(400).json({ error: 'Interest already exists' });
   }
  
    // Add new interest and save the user
    user.interests.push(category._id);
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
