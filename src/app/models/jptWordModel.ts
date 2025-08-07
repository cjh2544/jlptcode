import { Schema, model, models } from 'mongoose'

const jptWordSchema = new Schema({
  // 단어구분
  type: {
    type: String,
    required: true,
    index: true,
  },
  level: {
    type: String,
    required: true,
    index: true,
  },
  word: {
    type: String,
    required: false,
    index: true,
  },
  read: {
    type: String,
    required: true,
  },
  means: {
    type: Array,
    required: true,
  },
  parts: {
    type: Array,
    required: false,
  },
}, {timestamps: true, collection: 'jptWord'})

const JptWord = models?.jptWord || model('jptWord', jptWordSchema)

export default JptWord;