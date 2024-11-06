// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
//   amount: { type: Number, required: true },
//   paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
//   paymentType: { type: String, enum: ['initial', 'ride'], required: true },
//   transactionId: { type: String },  // Stripe transaction ID for reference
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Payment', paymentSchema);

const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  stripePaymentIntentId: String,
  transactionId: String
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;