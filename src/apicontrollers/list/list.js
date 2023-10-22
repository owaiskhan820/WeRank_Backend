import { listValidationSchema, validateList } from '../requestValidaton/list.js';
import { authMiddleware, generateToken } from '../../authentication/authentication.js';
import categoryService from '../../services/category/category.js';
import listService from '../../services/list/list.js';
import voteService from '../../services/vote/vote.js';
import express from 'express';


const listRouter = express.Router();



// Create a List
listRouter.post('/createList', validateList, authMiddleware, async (req, res) => {
  
        // 1. Extract userId from authenticated user
        const userId = req.user.id;

        // 2. Retrieve categoryId using the provided category name
        const category = await categoryService.getCategoryById(req.body.categoryId)
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const categoryId = category._id;

        // 3. Preparing the new list data
        const newListData = {
            ...req.body,
            userId: userId,
        };

        // 4. Save the new list
        const savedList = await listService.saveList(newListData);

        // 5. Return the created list
        res.status(201).json(savedList);

  
});


listRouter.get('/getAllLists', async(req, res) => {
    try{
        const response = await listService.getAllLists()
        res.json(response);

    
    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: 'Error retrieving lists', error: error.message });
    }
})


// Get a Specific List
listRouter.get('/getListById/:id', async (req, res) => {
    try {
        const list = await listService.getListByListId(req.params.id);
        res.json(list);
    } catch (error) {
        // Handle the error, for example, by sending a JSON error response
        res.status(500).json({ message: 'Error retrieving list', error: error.message });
    }
});

listRouter.get('/getListByUserId/:id', async (req, res) => {
    try {
        const list = await listService.getListByUserId(req.params.id);
        res.json(list);
    } catch (error) {
        // Handle the error, for example, by sending a JSON error response
        res.status(500).json({ message: 'Error retrieving list', error: error.message });
    }
});

listRouter.get('/getListByCategoryId/:id', async (req, res) => {
    try {
        const list = await listService.getListByCategoryId(req.params.id);
        res.json(list);
    } catch (error) {
        // Handle the error, for example, by sending a JSON error response
        res.status(500).json({ message: 'Error retrieving list', error: error.message });
    }
});


// Delete a List
listRouter.delete('/deleteList/:Id', async (req, res) => {
    try {
        const deletedList = await listService.deleteListById(req.params.Id);
        if (!deletedList) return res.status(404).json({ message: 'List not found' });
        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Upvote a List
listRouter.post('/vote/:listId/', async (req, res) => {


    const { listId } = req.params;
    const userId  = req.query.userId;  
    const voteType = req.body.voteType;  

    
    try {
        // Check if the user has already voted
        const existingVote = await voteService.findVoteByUserAndList(userId, listId);

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                return res.status(400).json({ message: "Already voted this way." });
            } else {
                // Switch vote (e.g., from upvote to downvote or vice versa)
                await voteService.switchVote(listId, voteType.toString());
            }
        } else {
            // Add new vote
            await voteService.addVote(userId, listId, voteType);
        }

    //     // Fetch the updated list to return, or just return a success message
    //     const updatedList = await listService.getListByListId(listId);
    //     res.json(updatedList);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Downvote a List
listRouter.post('/lists/:listId/downvote', async (req, res) => {
    try {
        const list = await List.findById(req.params.listId);
        if (!list) return res.status(404).json({ message: 'List not found' });
        
        // Add user's ID to downvotes array and remove from upvotes array if present
        list.downvotes.push(req.user.id);
        const index = list.upvotes.indexOf(req.user.id);
        if (index > -1) {
            list.upvotes.splice(index, 1);
        }

        await list.save();
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rearrange List Items
listRouter.put('/lists/:listId/rearrange', async (req, res) => {
    try {
        const list = await List.findById(req.params.listId);
        if (!list) return res.status(404).json({ message: 'List not found' });
        
        // The rearranged items would likely come from the request body
        // You would perform your rearrangement logic here and then save.
        // For simplicity, I'm just directly setting the listItems.
        list.listItems = req.body.listItems;
        
        await list.save();
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default listRouter;
