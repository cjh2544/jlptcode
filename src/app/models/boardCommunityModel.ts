import { Schema, model, models } from 'mongoose'

const boardCommunitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
}, {timestamps: true, collection: 'boardCommunity'})

const BoardCommunity = models?.boardCommunity || model('boardCommunity', boardCommunitySchema, 'board_community')

export default BoardCommunity;