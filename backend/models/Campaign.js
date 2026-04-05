const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['school', 'animal', 'sports', 'neighborhood', 'other'],
      default: 'other',
    },
    goal: {
      type: Number,
      required: true,
      min: 1,
    },
    raised: {
      type: Number,
      default: 0,
    },
    donorCount: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    // Pi username του δημιουργού (από Pi authentication)
    creatorPiUid: {
      type: String,
    },
    creatorUsername: {
      type: String,
      default: '',
    },
    updates: [
      {
        text: { type: String, required: true, maxlength: 300 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    imageUrl: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Moderator approval πριν δημοσιευτεί
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Campaign', campaignSchema)
