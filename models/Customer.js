const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  dni:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
