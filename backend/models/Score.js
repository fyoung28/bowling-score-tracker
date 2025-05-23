const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  frames: [{
    frameNumber: Number,
    firstRoll: Number,
    secondRoll: Number,
    thirdRoll: Number, // For 10th frame
    isStrike: Boolean,
    isSpare: Boolean,
    frameScore: Number
  }],
  totalScore: {
    type: Number,
    required: true
  },
  gameNumber: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Score', ScoreSchema); 