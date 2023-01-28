import mongoose, { Schema } from "mongoose";

const codeBlockSchema = new mongoose.Schema({
  type: {
    required: true,
    type: String,
  },
  code:{
    required: true,
    type: String,
  },
  solution:{
    required: true,
    type: String,
  }
});
export default mongoose.model("CodeBlock", codeBlockSchema);