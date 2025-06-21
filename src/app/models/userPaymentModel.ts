import { Schema, model, models } from 'mongoose'
import moment from 'moment-timezone';

// 지출정보 스키마
const paymentInfoSchema = new Schema({
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
}, {timestamps: true});

const userPaymentSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  payments: [paymentInfoSchema],
}, {timestamps: true, collection: 'user_payment'})

const UserPayment = models?.userPayment || model('userPayment', userPaymentSchema, 'user_payment')

export default UserPayment;