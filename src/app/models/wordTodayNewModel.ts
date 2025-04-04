import { Schema, model, models } from 'mongoose'

// 문제 스키마
const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  choice: {
    type: Array<string>,
    required: true,
  },
  // 정답
  answer: {
    type: Number,
    required: false,
  },
});

const wordTodayNewSchema = new Schema({
  // 등급
  level: {
    type: String,
    required: true,
    index: true,
  },
  // 년도
  year: {
    type: String,
    required: true,
    index: true,
  },
  // 문제번호
  wordNo: {
    type: Number,
    required: true,
  },
  // 단어
  word: {
    type: String,
    required: true,
  },
  // 읽기
  read: {
    type: String,
    required: true,
  },
  // 뜻
  means: {
    type: String,
    required: true,
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
  // 문제
  question: {
    type: QuestionSchema,
  },
}, {timestamps: true, collection: 'word_today_new'})

const WordTodayNew = models?.wordTodayNew || model('wordTodayNew', wordTodayNewSchema, 'word_today_new')

export default WordTodayNew;