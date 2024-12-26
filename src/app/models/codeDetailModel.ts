import { Schema, model, models } from 'mongoose'

const codeDetailSchema = new Schema({
  // 단어구분
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  value: {
    type: String,
    required: true,
    index: true,
  },
  sort: {
    type: Number,
    required: false,
  },
}, {timestamps: true, collection: 'code_detail'})

const CodeDetail = models?.codeDetail || model('codeDetail', codeDetailSchema, 'code_detail')

export default CodeDetail;