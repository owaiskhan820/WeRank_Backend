import mongoose from 'mongoose';
import ListModel from '../../models/list/list.js';
import VoteModel from '../../models/list/vote.js';
import { faker } from '@faker-js/faker';
import { MONGODB_URI } from '../secrets.js';

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Provided categories and user IDs
const categories = {
  movies: '654a6f0f19aaa41a47290a8d',
  music: '654a6f6f19aaa41a47290a99',
  books: '654a6f1a19aaa41a47290a90',
  places: '654a6f4d19aaa41a47290a93',
  tvShows: '654a6f5619aaa41a47290a96'
};
const userIds = ['654ac15471acf51827d59467', '654ac15871acf51827d5946e', '654ac15971acf51827d59472', '654ac15971acf51827d59476', '654ac15a71acf51827d5947a', '654ac15b71acf51827d5947e', '654ac15c71acf51827d59482', '654ac15d71acf51827d59486', '654ac15e71acf51827d5948a', '654ac15f71acf51827d5948e'];

// Helper function to generate list items and calculate their scores
const generateListItems = async ( itemsCount) => {
  let listItems = [];
  for (let i = 0; i < itemsCount; i++) {
    listItems.push({
      name: faker.lorem.words(),
      // score will be assigned later
    });
  }
  // Calculate scores for the list items
  listItems = await calculateScores(listItems);
  return listItems;
};

// Formula to calculate scores for list items
async function calculateScores(listItems) {
  const maxScore = listItems.length;
  return listItems.map((item, index) => ({
    ...item,
    score: maxScore - index
  }));
}

// Function to create lists and associated votes
const seedListsAndVotes = async () => {
  try {
    for (const userId of userIds) {
      for (const category in categories) {
        // Generate list items for the category
        const itemsCount = faker.number.int({ min: 5, max: 10 });
        const listItems = await generateListItems(category, itemsCount);
        
        // Create a new list
        const newList = new ListModel({
          title: `${faker.commerce.productName()} - ${category}`,
          userId: userId,
          categoryId: categories[category],
          listItems,
          // other fields are set automatically or can be added here
        });
        await newList.save();

        // Create votes for the list
        for (let i = 0; i < faker.number.int({ min: 1, max: userIds.length }); i++) {
          const randomUserId = faker.helpers.arrayElement(userIds);
          const newVote = new VoteModel({
            userId: randomUserId,
            listId: newList._id,
            voteType: faker.helpers.arrayElement(['upvote', 'downvote']),
          });
          await newVote.save();
        }
      }
    }
    console.log('Lists and votes successfully added!');
  } catch (error) {
    console.error('Error seeding lists and votes:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedListsAndVotes();
