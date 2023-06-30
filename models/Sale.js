const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  tiket: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tiket',
      required: true,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sale = mongoose.model('Sale', SaleSchema);

module.exports = Sale;
