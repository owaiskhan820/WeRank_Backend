import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../utils/secrets.js';  
import { verifyToken } from './authentication.js';
sgMail.setApiKey(SENDGRID_API_KEY);
import instanceOfUserDAO from '../daos/user/user.js';


  export async function sendEmail(user, emailType) {
    let subject, text;
  
    if (emailType === 'verification') {
      subject = 'Email Verification';
      text = `Please verify your email by clicking the following link: http://localhost:3000/api/v1/user/verify-email?token=${user.emailVerificationToken}`;
    } else if (emailType === 'passwordReset') {
      subject = 'Password Reset';
      text = `You requested to reset your password. Please click the following link to reset your password: http://localhost:3000/api/v1/user/reset-password?token=${user.passwordResetToken}`;
    } else {
      console.error('Invalid email type provided');
      return;
    }
  
    const msg = {
      to: user.email,
      from: 'owaiskhan20may@gmail.com', // You should replace this with your own email
      subject,
      text,
    };
  
    try {
      await sgMail.send(msg);
      console.log(`${subject} email sent`);
    } catch (error) {
      console.error(`Error sending ${subject} email `, error);
    }
  }
  
  export async function verifyEmail(token, res) { 
    try {
      const payload = verifyToken(token);
      const user = await instanceOfUserDAO.getUserByEmail(payload.email)
      user.isVerified = true;
      await user.save();
      res.json(user)
  
      console.log('Email successfully verified!');
    } catch (error) {
      console.error('Error verifying email', error);
    }
  }