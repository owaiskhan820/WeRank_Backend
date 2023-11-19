import mongoose from 'mongoose';
import CommentModel from '../../models/list/comment.js';
import WatchlistModel from '../../models/watchlist/watchlist.js';
import ListModel from '../../models/list/list.js';
import VoteModel from '../../models/list/vote.js';
import UserModel from '../../models/user/user.js';
import ProfileModel from '../../models/profile/profie.js';
import FollowModel from '../../models/follow/follow.js';
import { faker } from '@faker-js/faker';
import { MONGODB_URI } from  '../secrets.js';
import { hashPassword } from '../authentication/authentication.js';

// Constants for the number of documents to seed
const NUM_USERS = 5;
const NUM_LISTS_PER_USER = 2;
const NUM_COMMENTS_PER_LIST = 3;
const NUM_VOTES_PER_LIST = 5;
const NUM_WATCHLISTS_PER_USER = 3;

// Sample category IDs (replace with actual IDs)
const categories = {
    movies: '6553ab8c7e97894062881758',
    music: '6553abdb7e97894062881761',
    books: '6553ab9e7e9789406288175b',
    places: '654cccbafbb7c574de4e9d03',
    tvShows: '6553abaf7e9789406288175e'
  }; 

const itemsByCategory = {
    movies: ["The Shawshank Redemption", "The Godfather", "Inception", "The Pianist", "Raiders of the Lost Ark", "The Great Dictator",
    "Cinema Paradiso", "Grave of the Fireflies", "The Shining",
    "Apocalypse Now", "Alien", "Sunset Boulevard",
    "Dr. Strangelove", "Witness for the Prosecution", "The Sound of Music",
    "Amélie", "A Clockwork Orange", "Lawrence of Arabia",
    "Double Indemnity", "Taxi Driver", "Eternal Sunshine of the Spotless Mind",
    "Requiem for a Dream", "American History X", "The Usual Suspects",
    "Léon: The Professional", "Some Like It Hot"],
    
    music: ["Bohemian Rhapsody", "Imagine", "Stairway to Heaven", "Hotel California", 
    "Sweet Child O' Mine", "Smells Like Teen Spirit",
    "Hey Jude", "Another Brick in the Wall"],
    
    books: ["1984", "To Kill a Mockingbird", "The Great Gatsby", "Pride and Prejudice", 
    "The Catcher in the Rye", "The Hobbit", "Moby-Dick", "War and Peace"],
    
    places: ["Eiffel Tower", "Great Wall of China", "Grand Canyon",     
    "Machu Picchu", "Taj Mahal", "Colosseum",   "Mount Everest", "Niagara Falls"],
    
    tvShows: ["Breaking Bad", "Game of Thrones", "Friends",     
    "The Wire", "The Sopranos", "The Office",  "Stranger Things", "The Mandalorian"]
  };
  
  const standardComments = [
    "Great list!", "Very interesting choices.", "I love this list!", 
    "So many good options.", "Can't wait to try these out.",
    "The view is breathtaking.",
    "This is a great list",
    "Not a fan of this list",
    "I don't agree with list at all",
    "Interesting",
    "This looks like an accurate list",
    "The creator has done justice to this list"

  ];
mongoose.connect(MONGODB_URI);



// Other imports and code remain the same

async function createUserWithProfile(session) {
  const hashedPassword = await hashPassword('password');
  const username = faker.internet.userName().replace(/\W/g, '_');

  const user = new UserModel({
      username: username,
      email: faker.internet.email(),
      password: hashedPassword,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      isVerified: true
  });

  await user.save({ session });

  // Randomly pick three unique categories as interests
  const interests = faker.helpers.arrayElements([
      categories.movies, 
      categories.music, 
      categories.books, 
      categories.places, 
      categories.tvShows
  ], 3);

  const profile = new ProfileModel({
      userId: user._id,
      interests: interests // Assign the selected interests
      // ... other profile fields
  });

  await profile.save({ session });

  console.log(`User and profile created with ID: ${user._id}, Interests: ${interests}`);
  return user;
}

// Rest of the script remains unchanged

  async function createListForUser(userId, categories, itemsByCategory, session) {
    const categoryKeys = Object.keys(categories);
    const categoryKey = faker.helpers.arrayElement(categoryKeys);
    const categoryId = categories[categoryKey];
  
    // Directly map itemsByCategory to listItems without score calculation
    const compileListItems = itemsByCategory[categoryKey]
    
    const listItems = compileListItems.map(itemName => ({
      name: itemName,
      // You can assign a random score here or a fixed value
      score: faker.number.int({ min: 1, max: 100 }), 
    }));
  
    // Create a list instance
    const list = new ListModel({
      title: faker.commerce.productName() + ' ' + categoryKey,
      userId,
      categoryId,
      listItems, // Directly use the listItems with the 'name' and 'score'
      visibility: faker.helpers.arrayElement(['public', 'private']),
    });
  
    // Save the list using the session
    await list.save({ session });
  
    console.log(`List titled "${list.title}" for category "${categoryKey}" created with ID: ${list._id}`);
    return { list, categoryKey };
  }
  
  async function createFollowRelationship(userIds, session) {
    // Select two different random user IDs for follower and following
    const [followerId, followingId] = faker.helpers.shuffle(userIds).slice(0, 2);
  
    const follow = new FollowModel({
      follower: followerId,
      following: followingId,
    });
  
    await follow.save({ session });
    console.log(`User ${followerId} is now following User ${followingId}`);
  }
  
  async function createCommentsForList(userIds, listId, standardComments, session) {
   
    for (let i = 0; i < NUM_COMMENTS_PER_LIST; i++) {
      const commentText = faker.helpers.arrayElement(standardComments);
      const userId = faker.helpers.arrayElement(userIds);
    
      const comment = new CommentModel({
        text: commentText,
        userId: userId,
        listId: listId,
      });
    
      await comment.save({ session });
      console.log(`Comment added to list ID: ${listId}: "${commentText}"`);
    }
  }
  


async function createVotesForList(listId, userIds, session) {
  for (let i = 0; i < NUM_VOTES_PER_LIST; i++) {
    const vote = new VoteModel({
      userId: faker.helpers.arrayElement(userIds),
      listId: listId,
      voteType: faker.helpers.arrayElement(['upvote', 'downvote']),
    });
    await vote.save({ session });
  }
}

async function addListsToWatchlist(userId, listIds, session) {
  for (let i = 0; i < NUM_WATCHLISTS_PER_USER; i++) {
    const watchlistEntry = new WatchlistModel({
      userId: userId,
      listId: faker.helpers.arrayElement(listIds),
    });
    await watchlistEntry.save({ session });
  }
}

// Main seeding function
async function seedDatabase() {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userIds = [];
    const listIds = [];

    // Create users and profiles
    for (let i = 0; i < NUM_USERS; i++) {
      const user = await createUserWithProfile(session);
      userIds.push(user._id);
      console.log(`User and profile created with ID: ${user._id}`);
    }

    for (let i = 0; i < NUM_USERS; i++) {
      // Assuming you want each user to follow a few other users
      for (let j = 0; j < 3; j++) {
        await createFollowRelationship(userIds, session);
      }
    }
    // Create lists for each user
    for (const userId of userIds) {
      for (let i = 0; i < NUM_LISTS_PER_USER; i++) {
        const { list, categoryKey } = await createListForUser(userId, categories, itemsByCategory, session);
        listIds.push(list._id);
        console.log(`List created with ID: ${list._id} for user ID: ${userId} category key: ${categoryKey}`);

        // Create comments for each list
        await createCommentsForList(userIds, list._id, standardComments, session);
        console.log(`Comments created for list ID: ${list._id}`);

        // Create votes for each list
        await createVotesForList(list._id, userIds, session);
        console.log(`Votes created for list ID: ${list._id}`);
      }
    }
    // Add lists to watchlists for each user
    for (const userId of userIds) {
      await addListsToWatchlist(userId, listIds, session);
      console.log(`Watchlist entries created for user ID: ${userId}`);
    }

    await session.commitTransaction();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    await session.abortTransaction();
    console.error('Error during the seeding process:', error);
  } finally {
    session.endSession();
    await mongoose.disconnect();
  }
}

// Execute the seed database function
seedDatabase();

// node ./src/utils/seederScripts/DBPopulate.js