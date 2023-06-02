const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  game:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  

});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
