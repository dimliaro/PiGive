const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    // Pi payment identifiers
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    txid: {
      type: String, // Blockchain transaction ID
    },
    amount: {
      type: Number,
      required: true,
      min: 0.1,
    },
    // Pi user που έκανε τη δωρεά
    donorPiUid: {
      type: String,
    },
    donorUsername: {
      type: String,
    },
    donorMessage: {
      type: String,
      maxlength: 150,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Donation', donationSchema)
