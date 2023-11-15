import mongoose, { Document } from "mongoose";

interface Book extends Document {
  title: string;
  author: string;
  createdAt: Date;
}

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const BookModel = mongoose.model<Book>("book", bookSchema);

export default BookModel;
