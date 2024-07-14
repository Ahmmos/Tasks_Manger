import mongoose, { Schema, model } from "mongoose";



const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
}, { timestamps: true, versionKey: false })


export const Category = model("Category", schema)