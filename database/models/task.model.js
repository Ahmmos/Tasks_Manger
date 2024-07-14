import mongoose, { Schema, model } from "mongoose";


const schema = new Schema({
  type: {
    type: String,
    enum: ["text", "list"],
    required: true

  },
  textBody: {
    type: String
  },
  listItems: {
    type: [String]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true, versionKey: false })


export const Task = model("Task", schema)