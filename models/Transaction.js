
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    type: {
      type: String,
      required: true,
      enum: ['expense', 'income']
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
