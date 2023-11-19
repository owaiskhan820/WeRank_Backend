import { listValidationSchema, validateList } from '../../utils/requestValidaton/list.js'
import { authMiddleware } from '../../utils/authentication/authentication.js'
import categoryService from '../../services/category/category.js';
import listService from '../../services/list/list.js';
import voteService from '../../services/vote/vote.js';
import contributorService from '../../services/contributor/contributor.js';
import commentService from '../../services/comment/comment.js';
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
        
        newListData.listItems = await listService.calculateScores(newListData.listItems);
    
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


listRouter.get('/suggestedLists/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const suggestedLists = await listService.getSuggestedLists(userId);
      res.status(200).json(suggestedLists);
    } catch (error) {
      console.error('Error fetching suggested lists:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Upvote a List
listRouter.post('/vote/:listId/', authMiddleware, async (req, res) => {


    const { listId } = req.params;
    const userId  = req.user.id;  
    const voteType = req.body.voteType;  

    
    try {
        // Check if the user has already voted
        const existingVote = await voteService.findVoteByUserAndList(userId, listId);

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                return res.status(400).json({ message: "Already voted this way." });
            } else {
                await voteService.switchVote(listId, userId, voteType);
            }
        } else {
            // Add new vote
            await voteService.addVote(userId, listId, voteType);
            // res.json({msg: "Vote added successfully"})
            console.log("Vote added successfully")
        }

        // Fetch the updated list to return, or just return a success message
        const updatedList = await listService.getListByListId(listId);
        res.json(updatedList);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


listRouter.put('/rearrangeList/:listId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        const listId = req.params.listId;
        const rearrangedItems = req.body.rearrangedListItems;

        const verificationMessage = await contributorService.verifyContributor(listId, userId);
        
        if (verificationMessage) {
            return res.status(400).json({ message: verificationMessage });
        }

        const updatedList = await listService.updateScore(listId, rearrangedItems);
        const contributor = await contributorService.addContributor(listId, userId)
        res.status(200).json({updatedList, contributor});
    } catch (error) {
        res.status(500).json({ message: "Error rearranging list", error: error.message });
    }
});


listRouter.post('/comment/:listId', authMiddleware, async (req, res) => {
    try {
        const { listId } = req.params;
        const userId = req.user.id
        const { text } = req.body; // Assuming the comment's text is sent in the request body

        const comment = await commentService.addcomment(listId, userId, text);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


listRouter.get("/getContributors/:listId", async (req, res) => {
    try {
        const listId = req.params.listId;
        const contributors = await contributorService.getContributorsForList(listId);

        if (!contributors || contributors.length === 0) {
            return res.status(404).json({ message: "No contributors found for this list." });
        }

        res.status(200).json(contributors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }


});



listRouter.get('/list-count-by-userId/:userId', async (req, res) => {

       try{
        const userId = req.params.userId; // or from req.query or req.body, depending on how you send it.
        const count = await listService.getListCountByUserId(userId);
        res.status(200).json({ count });

       } catch(error){
        throw error
       }




});



listRouter.delete("/deleteVote/:listId", async (req, res) => {



});

export default listRouter;
