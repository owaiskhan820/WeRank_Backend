import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../utils/secrets.js';  
import UserModel from '../models/user.js';
import { verifyToken } from './authentication.js';
sgMail.setApiKey(SENDGRID_API_KEY);


export async function sendVerificationEmail(user) {
    const msg = {
      to: user.email,
      from: 'owaiskhan20may@gmail.com',
      subject: 'Email Verification',
      text: `Please verify your email by clicking the following link: http://localhost:3000/api/v1/user/verify-email?token=${user.emailVerificationToken}`,
    };
  
    try {
      await sgMail.send(msg);
      console.log('Verification email sent');
    } catch (error) {
      console.error('Error sending verification email', error);
    }
  }
  
  export async function verifyEmail(token, res) {
    try {
      const payload = verifyToken(token);
      const user = await UserModel.findOne({ email: payload.email });
      if (!user) throw new Error('User not found');
  
      user.isVerified = true;
      await user.save();
      res.json(user)
  
      console.log('Email successfully verified!');
    } catch (error) {
      console.error('Error verifying email', error);
    }
  }