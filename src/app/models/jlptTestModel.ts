import { Schema, model, models } from 'mongoose'

// 정답 선택 스키마
const ChoiceSchema = new Schema({
  no: Number,
  content: String
});

// 문제 스키마
const QuestionSchema = new Schema({
  content: String,
  audio: {
    link: {type: String},
    name: {type: String}
  },
  image: {
    link: {type: String},
    name: {type: String}
  }
});

// 문장
const SentenceSchema = new Schema({
  translation: String,
  reading: String
});

const jlptTestSchema = new Schema({
  // 등급
  level: {
    type: String,
    required: true,
    index: true,
  },
  // 테스트 차수수
  test: {
    type: String,
    required: true,
    index: true,
  },
  // 분류(과목)
  classification: {
    type: String,
    enum: ['vocabulary', 'grammar ', 'reading', 'listening'],
    required: true,
  },
  // 문제 구분
  questionType: {
    type: String,
    enum: ['group', 'content', 'normal'],  // group: 그룹문제, content: 지문, normal: 일반문제
    required: true,
  },
  // 문제
  question: {
    type: QuestionSchema,
    required: true,
  },
  // 문제번호
  sortNo: {
    type: Number,
    required: true,
    index: true,
  },
  // 문제번호
  questionNo: {
    type: Number,
    required: false,
    index: false,
  },
  // 해석
  sentence: {
    type: SentenceSchema,
    require: false,
  },
  // 선택지
  choices: {
    type: [ChoiceSchema],
    required: false,
  },
  // 정답
  answer: {
    type: Number,
    required: false,
  },
}, {timestamps: true, collection: 'jlpt_test'})

jlptTestSchema.index({ classification: 1, year: 1, month: 1, level: 1, sortNo: 1 }, { unique: true });

const JlptTest = models?.jlptTest || model('jlptTest', jlptTestSchema)

export default JlptTest;