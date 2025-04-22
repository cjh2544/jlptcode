import { Schema, model, models } from 'mongoose'

const readingTodaySchema = new Schema({
  // 등급
  level: {
    type: String,
    required: true,
    index: true,
  },
  // 출처
  source: {
    type: String,
    required: true,
    index: true,
  },
  // 문장
  sentence: {
    type: String,
  },
  // 문장 읽기
  sentence_read: {
    type: String,
  },
  // 문장 해석
  sentence_translate: {
    type: String,
  },
}, {timestamps: true, collection: 'reading_today'})

const ReadingToday = models?.readingToday || model('readingToday', readingTodaySchema, 'reading_today')

export default ReadingToday;