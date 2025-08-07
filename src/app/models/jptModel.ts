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
  reading: String,
});

const jptSchema = new Schema({
  // 등급
  level: {
    type: String,
    index: true,
  },
  // 월
  part: {
    type: String,
    required: true,
    index: true,
  },
  // 년도
  year: {
    type: String,
    index: true,
  },
  // 분류(과목)
  classification: {
    type: String,
    enum: ['vocabulary', 'grammar ', 'reading', 'listening'],
  },
  // 문제그룹 유형
  questionGroupType: {
    type: String,
  },
  // 문제
  question: {
    type: QuestionSchema,
    required: true,
  },
  // 문제 구분
  questionType: {
    type: String,
    enum: ['group', 'content', 'normal'],  // group: 그룹문제, content: 지문, normal: 일반문제
    required: true,
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
  // 문제번호
  sortNo: {
    type: Number,
    required: true,
    index: true,
  },
  // 문제번호
  questionNo: {
    type: String,
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
  // 스피커
  speaker: {
    type: String,
  },
}, {timestamps: true, collection: 'jpt'})

jptSchema.index({ classification: 1, year: 1, month: 1, level: 1, sortNo: 1 }, { unique: true });

const Jpt = models?.jpt || model('jpt', jptSchema)

export default Jpt;