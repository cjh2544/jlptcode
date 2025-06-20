import { Schema, model, models } from 'mongoose'

// 지출정보 스키마
const PaymentInfo = new Schema({
  paymentType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const userPaymentSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  payments: [PaymentInfo],
}, {timestamps: true, collection: 'user_payment'})

const UserPayment = models?.userPayment || model('user_payment', userPaymentSchema, 'user_payment')

export default UserPayment;