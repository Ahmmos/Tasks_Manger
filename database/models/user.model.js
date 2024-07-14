import { Schema, model } from "mongoose";



const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true, versionKey: false })


export const User = model("User", schema)