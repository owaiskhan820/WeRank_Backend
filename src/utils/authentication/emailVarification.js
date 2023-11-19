import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../secrets.js';  
import { verifyToken } from './authentication.js';
sgMail.setApiKey(SENDGRID_API_KEY);
import instanceOfUserDAO from '../../daos/user/user.js';

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL ;

  export async function sendEmail(user, emailType) {
    let subject, text;
  
    if (emailType === 'verification') {
      subject = 'Email Verification';
      text = `Please verify your email by clicking the following link:  ${FRONTEND_BASE_URL}/?token=${user.emailVerificationToken} `;
    } else if (emailType === 'passwordReset') {
      subject = 'Password Reset';
      text = `You requested to reset your password. Please click the following link to reset your password: ${FRONTEND_BASE_URL}/reset-password?token=${user.passwordResetToken} `;
    } else {
      console.error('Invalid email type provided');
      return;
    }
  
    const msg = {
      to: user.email,
      from: 'owaiskhan20may@gmail.com',  
      subject,
      text,
      tracking_settings: {
        click_tracking: {
          enable: false,
          enable_text: false,
        },
      },
    };
  
    try {
      await sgMail.send(msg);
      console.log(`${subject} email sent`);
    } catch (error) {
      console.error(`Error sending ${subject} email `, error);
    }
  }
  
  export async function verifyEmail(token) { 
    try {
      const response =verifyToken(token)
      console.log(response)
      const user = await instanceOfUserDAO.getUserByEmail(response.email)
      if (!user) {
        console.log("no user found")
        return null;
      }
      console.log("user found")

      user.isVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();
      return user;
    } catch (error) {
      console.error('Error verifying email', error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }
