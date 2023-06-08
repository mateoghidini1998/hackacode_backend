const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  employees: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee'
  }],
  hours: [{
    opening: {
      type: Date
    },
    closing: {
      type: Date
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
