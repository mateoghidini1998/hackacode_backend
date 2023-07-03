const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sale = mongoose.model('Sale', SaleSchema);

module.exports = Sale;
