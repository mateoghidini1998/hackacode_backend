const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['employee', 'manager'], 
    default: 'employee' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }

});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
