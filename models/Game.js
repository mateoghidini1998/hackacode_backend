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
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Game = mongoose.model('Game', GameSchema);

module.exports = Game;
