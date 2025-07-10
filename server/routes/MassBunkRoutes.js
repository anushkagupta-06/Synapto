import express from 'express';
import MassBunkPoll from '../models/MassBunkPoll.js';
import mongoose from 'mongoose';
import User from '../models/User.js';


const router = express.Router();

router.get('/polls', async (req, res) => {
  const polls = await MassBunkPoll.find();

  // Manually populate names
  for (const poll of polls) {
    for (const vote of poll.votes) {
      const user = await User.findById(vote.userId).select('name');
      vote.userId = user || { name: 'Unknown' };
    }
  }

  res.json(polls);
});
router.post('/create', async (req, res) => {
  const { reason, localuser } = req.body;

  const poll = await MassBunkPoll.create({
    reason,
    createdBy: new mongoose.Types.ObjectId(localuser.id),
  });

  res.status(201).json(poll);
});

router.post('/vote', async (req, res) => {
  const { pollId, vote, localuser } = req.body;

  const poll = await MassBunkPoll.findById(pollId);
  const userId = new mongoose.Types.ObjectId(localuser.id);

  const existingVote = poll.votes.find(v => v.userId.toString() === userId.toString());

  if (existingVote) {
    existingVote.vote = vote;
  } else {
    poll.votes.push({ userId, vote });
  }

  await poll.save();
  res.sendStatus(200);
});


router.post('/close', async (req, res) => {
  const { pollId, localuser } = req.body;
  const poll = await MassBunkPoll.findById(pollId);

  if (poll.createdBy.toString() !== localuser.id.toString()) {
    return res.status(403).send('Unauthorized');
  }

  poll.status = 'closed';
  await poll.save();
  res.sendStatus(200);
});

export default router;