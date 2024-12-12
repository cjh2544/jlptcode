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

const grammarTodaySchema = new Schema({
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
  sortNo: {
    type: Number,
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
}, {timestamps: true, collection: 'grammar_today'})

const GrammarToday = models?.grammarToday || model('grammarToday', grammarTodaySchema, 'grammar_today')

export default GrammarToday;