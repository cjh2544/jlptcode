import { Schema, model, models } from 'mongoose'
import CodeDetail from './codeDetailModel';

const codeSchema = new Schema({
  // 단어구분
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  sort: {
    type: Number,
    required: false,
  }
}, {timestamps: true, collection: 'code'})

const Code = models?.code || model('code', codeSchema, 'code')

export default Code;