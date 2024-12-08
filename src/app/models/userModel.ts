import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  image: String,
  role: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
  },
  provider: {
    type: String,
    default: 'credentials',
  }
}, {timestamps: true, collection: 'user'})

const User = models?.user || model('user', userSchema, 'user')

export default User;