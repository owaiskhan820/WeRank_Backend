import mongoose from 'mongoose';
import UserModel from '../../models/user/user.js';
import ProfileModel from '../../models/profile/profie.js';
import { faker } from '@faker-js/faker';
import DBConnect from '../../config/database/connection.js';
import { MONGODB_URI } from  '../secrets.js';
import { hashPassword } from '../authentication/authentication.js';

// Use the existing DB connection logic
const mongoUrl = MONGODB_URI;
DBConnect(mongoUrl);

// Helper function to generate a single user and profile
const generateUserAndProfile = async () => {
  const hashedPassword = await hashPassword('password');
  const username = faker.internet.userName().replace(/\W/g, '_');

  const user = new UserModel({
    username: username,
    email: faker.internet.email(),
    password: hashedPassword,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  });

  const profile = new ProfileModel({
    userId: user._id,
    // Add other profile fields as needed, or leave them undefined to default to null
  });

  return { user, profile };
};

// Main function to seed users and profiles
const seedUsersAndProfiles = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    for (let i = 0; i < 10; i++) {
      const { user, profile } = await generateUserAndProfile();

      await user.save({ session });
      await profile.save({ session });
    }

    await session.commitTransaction();
    console.log('Users and profiles successfully added!');
  } catch (error) {
    await session.abortTransaction();
    console.error('Error seeding users and profiles:', error);
  } finally {
    session.endSession();
    mongoose.disconnect();
  }
};

seedUsersAndProfiles();
