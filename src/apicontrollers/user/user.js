// userRouter.js
import express from 'express';
import apiHelpers from '../../utils/assets/apiHelpers.js';
import {userValidationSchema, loginValidationSchema} from '../../utils/requestValidaton/user.js'
import userService  from '../../services/user/user.js';
import listService from '../../services/list/list.js';
import contributorService from '../../services/contributor/contributor.js'
import { verifyEmail, sendEmail } from '../../utils/authentication/emailVarification.js'
import { authenticateUser, authMiddleware, generateToken, hashPassword } from '../../utils/authentication/authentication.js'
import validatePagination from "../../utils/assets/paginateValidation.js"
const authRouter = express.Router();
const { validateErrors, apiOk } = apiHelpers;



authRouter.post('/register', userValidationSchema, async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(200).json({user: user});
} catch (error) {
    if (error.message === 'Email already taken') {
        console.log(error.message)
        res.status(400).json({ message: error.message });
    } else {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
});

authRouter.get('/getAll', async (req, res) => {
  const users = await userService.getAllUsers();
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
  try {
    const user = await verifyEmail(token);
    if (user) {
      return res.status(200).json({ message: 'email verified successfully', user: user });
    } else {
      return res.status(401).json({ message: 'email verification unsuccessful' });
    }
  } catch (error) {
    console.error('Error verifying email', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

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
    try {
      const { email, password } = req.body;
      const { user, token } = await authenticateUser(email, password);
      res.status(200).json({ user: user, token: token });
    } catch (error) {
      if (error.message === 'User not found' || error.message === 'Incorrect password') {
        res.status(401).json({ message: error.message });
      } else{
        res.status(500).json({
          message: 'An error occurred during the login process.',
          error: error.message,  // For security reasons, consider not sending the full error details in production
          stack: error.stack     // Including the stack trace can be useful for debugging but exposes internals
        });
      }
    }
  });


//forgot password
authRouter.post('/forgot-password', async (req, res) => {
  const email = req.body.email;

  if(!email){
    return res.status(400).send('Email is required');

  }
  const user = await userService.getUserByEmail(email);
  if(user === "User not found"){
    return res.status(400).send('User not found ');

  }

  const token = generateToken(user)
  user.passwordResetToken = token;
  user.save()
  await userService.saveUser(user);

  await sendEmail(user, 'passwordReset')
  res.status(200).send('Password reset email sent');
} 

);
// 4. Reset Password:

authRouter.post('/reset-password', async (req, res) => {
  try {
    const token = req.query.token;
    const { newPassword } = req.body;

    // Find user by password reset token
    const user = await userService.getUserByResetToken(token);

    // Check if user exists and token matches
    if (!user) {
      return res.status(500).json({ msg: 'User Not Found' });
    }

    // Hash the new password and update user document
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = undefined; 
    user.save()

    res.status(200).json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


  
authRouter.get("/user-contributions/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const contributions = await contributorService.getUserContributions(userId);
    const listIds = contributions.map(contribution => contribution.listId);
    const lists = await listService.getListsByIds(listIds);

    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


authRouter.get('/userCredentials/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userProfile = await userService.getUserProfileById(userId);

    if (!userProfile.username) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userProfile);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

authRouter.get('/suggestedUsers/:id', validatePagination, async (req, res) => {
  try {
      const userId = req.params.id;
      // Extract pagination parameters from query or use defaults
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10; // You can set a different default value

      // Call the method to get suggested users with pagination
      const suggestedUsers = await userService.getSuggestedUsersToFollow(userId, page, perPage);

      // Send the suggested users back in the response
      res.status(200).json(suggestedUsers);
  } catch (error) {
      // Handle any errors
      console.error('Error in getSuggestedUsersToFollow:', error);
      res.status(500).json({ message: 'Internal Server Error' });
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
