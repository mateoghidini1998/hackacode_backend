const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  price: {
    type: Number,
    required: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
  ],
  hours: [
    {
      opening: {
        type: Date,
      },
      closing: {
        type: Date,
      },
    },
  ],
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
