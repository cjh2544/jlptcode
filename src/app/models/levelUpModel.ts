import { Schema, model, models } from 'mongoose'

// 정답 선택 스키마
const ChoiceSchema = new Schema({
  no: Number,
  content: String
});

// 문제 스키마
const QuestionSchema = new Schema({
  content: String,
  contentOrg: String,
  audio: {
    link: {type: String},
    name: {type: String}
  },
  image: {
    link: {type: String},
    name: {type: String}
  }
});

const levelUpSchema = new Schema({
  // 년도
  year: {
    type: String,
    required: true,
    index: true,
  },
  // 등급
  level: {
    type: String,
    required: true,
    index: true,
  },
  // 문제번호
  sortNo: {
    type: Number,
    required: true,
    index: true,
  },
  // 분류(과목)
  classification: {
    type: String,
    enum: ['kanji', 'vocabulary1', 'vocabulary2', 'vocabulary3', 'grammar'], // 'vocabulary', 'grammar ', 'reading', 'listening'
    required: true,
  },
  // 문제번호
  questionNo: {
    type: Number,
    required: false,
    index: false,
  },
  // 문제 그룹번호
  questionGroupNo: {
    type: Number,
    required: false,
    index: true,
  },
  // 문제 컨텐츠 그룹번호
  questionContentNo: {
    type: Number,
    required: false,
    index: true,
  },
  // 문제
  question: {
    type: QuestionSchema,
    required: true,
  },
  // 문제
  questionGroupType: {
    type: String,
    required: true,
  },
  // 문제 구분
  questionType: {
    type: String,
    enum: ['group', 'content', 'normal'],  // group: 그룹문제, content: 지문, normal: 일반문제
    required: false,
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
}, {timestamps: true, collection: 'level_up'})

levelUpSchema.index({ classification: 1, year: 1, level: 1, sortNo: 1 }, { unique: true });

const LevelUp = models?.levelUp || model('levelUp', levelUpSchema)

export default LevelUp;