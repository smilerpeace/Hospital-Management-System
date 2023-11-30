const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    // required: true,
  },
  appdate: {
    type: String,
    // required: true,
  },
  department: {
    type: String,
    // required: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);
