import { Schema, model, models } from 'mongoose'
import BoardCommunity from './boeadCommunityModel';

const boardReplySchema = new Schema({
  board_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
}, {timestamps: true, collection: 'boardReply'})

const BoardReply = models?.boardReply || model('boardReply', boardReplySchema, 'board_reply')

export default BoardReply;