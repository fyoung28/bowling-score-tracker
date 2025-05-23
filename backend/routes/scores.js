const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { check, validationResult } = require('express-validator');

// @route   POST api/scores
// @desc    Add a new score
router.post('/', [
  check('userId', 'User ID is required').not().isEmpty(),
  check('frames', 'Frames are required').isArray(),
  check('totalScore', 'Total score is required').isNumeric(),
  check('gameNumber', 'Game number is required').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newScore = new Score(req.body);
    const score = await newScore.save();
    res.json(score);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/scores/user/:userId
// @desc    Get all scores for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.params.userId })
      .sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/scores/:id
// @desc    Get score by ID
router.get('/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ msg: 'Score not found' });
    }
    res.json(score);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Score not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 