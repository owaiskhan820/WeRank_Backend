import { listValidationSchema, validateList } from '../../utils/requestValidaton/list.js'
import { authMiddleware } from '../../utils/authentication/authentication.js'
import categoryService from '../../services/category/category.js';
import listService from '../../services/list/list.js';
import voteService from '../../services/vote/vote.js';
import contributorService from '../../services/contributor/contributor.js';
import commentService from '../../services/comment/comment.js';
import express from 'express';
import Sentiment from 'sentiment';
import query from '../../huggingFace/sentimentAnalyzer.js';

const sentiment = new Sentiment();


const listRouter = express.Router();



// Create a List
listRouter.post('/createList', authMiddleware, async (req, res) => {
  
        // 1. Extract userId from authenticated user
        const userId = req.user.id;
        const listData = req.body.listData; // Destructure the required fields from req.body
        
        listData.listItems = await listService.calculateScores(listData.listItems);
    
        // 4. Save the new list
        const savedList = await listService.saveList(listData);
    
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


  listRouter.get('/getUserVoteStatus/:listId/:userId', async (req, res) => {
    const listId  = req.params.listId;
    const userId = req.params.userId;

    try {
        const vote = await voteService.findVoteByUserAndList(userId, listId);
        const voteType = vote;
        res.status(200).json({ voteType });
    } catch (error) {
        console.error('Error fetching user vote status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

  

listRouter.post('/vote/', authMiddleware, async (req, res) => {
    const listId = req.body.listId;
    const userId = req.user.id;
    const voteType = req.body.voteType;

    try {
        // Check if the user has already voted on this list
        const existingVote = await voteService.findVoteByUserAndList(userId, listId);

        if (existingVote.upvoted === false && existingVote.downvoted === false) {
            const newVote = await voteService.addVote(userId, listId, voteType);
            res.status(200).json({ message: "Vote added", updatedVoteStatus: newVote.voteType});
            
        } else {
            if (existingVote.voteType === voteType) {
                // User is trying to perform the same vote again, so remove the vote
                const response = await voteService.removeVote(listId, userId);
                console.log("Vote deleted", response)

                res.json({ message: "Vote removed", updatedVoteStatus: null });
            } else {
                // User is switching their vote
               const response = await voteService.switchVote(listId, userId, voteType);
                console.log("Vote updated", response)

                res.json({ message: "Vote updated", updatedVoteStatus: voteType });
            }}
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



listRouter.put('/rearrangeList/:listId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const listId = req.params.listId;
        const rearrangedItems = req.body.listItems;
        console.log(userId, listId, rearrangedItems);

        // Verifying if the user has already contributed
        try {
            const verifier = await contributorService.verifyContributor(listId, userId);
        } catch (error) {
            console.log(error)
            return res.status(401).json(error);
        }

        // Updating the list score and adding contributor
        try {
            const updatedList = await listService.updateScore(listId, rearrangedItems);
            const contributor = await contributorService.addContributor(listId, userId);
            return res.status(200).json({ updatedList, contributor });
        } catch (error) {
            // If there is an error in updating the list, send an appropriate response
            return res.status(500).json({ message: "Something went wrong", error: error.message });
        }

    } catch (error) {
        // Catch any other errors not caught by the inner try-catch blocks
        res.status(500).json({ message: "Error rearranging", error: error.message });
    }
});




listRouter.post('/addComment/', authMiddleware, async (req, res) => {
    try {
        const  listId  = req.body.listId;
        const userId = req.user.id
        const  text  = req.body.text; 

        const comment = await commentService.addcomment(listId, userId, text);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

listRouter.get('/comments/:listId', async (req, res) => {
    try {
        const listId = req.params.listId;
        const comments = await commentService.getComments(listId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

listRouter.delete('/deleteComment/', async (req, res) => {
    
      try {
        const commentId = req.body.commentId;
        // Optionally, you can add checks here to ensure that the user deleting the comment is the author of the comment
        await commentService.deleteComment(commentId);
        res.status(200).send({ message: 'Comment deleted successfully' });
      } catch (error) {
        res.status(500).send({ message: 'Error deleting comment' });
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

listRouter.post('/analyze-sentiment', async (req, res) => {
    try {
        const { comment } = req.body;
        const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN; 

        const response = await query({ "inputs": comment }, API_TOKEN);
        res.json(response);
    } catch (error) {
        console.error('Error during sentiment analysis:', error);
        res.status(500).send({ message: 'Error processing sentiment analysis' });
    }
});


listRouter.get('/list-score/:listId', async (req, res) => {
   
    const listId = req.params.listId
    const response = await listService.calculateListScore(listId)
    return res.status(200).json(response)
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





export default listRouter;
