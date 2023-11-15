import express, { Request, Response } from "express";
import dotenv from "dotenv";
import BookModel from "../models/book.model";
import authorize from "../middlewares/authorization.middleware";

dotenv.config();
const bookRouter = express.Router();

bookRouter.post(
  "/books",
  authorize(["CREATOR"]),
  async (req: Request & { userEmail?: string }, res: Response) => {
    try {
      // Extract book information from the request body
      const { title } = req.body as {
        title: string;
      };

      // Use the user's email as the author
      const author = req.userEmail;

      // Check if all required fields are provided
      if (!title || !author) {
        return res
          .status(400)
          .json({ message: "Please provide the required fields" });
      }

      // Create a new book document
      const saveBook = new BookModel({ title, author });

      // Save the new book document to the database
      await saveBook.save();

      // Respond with success status and the saved book document
      res.status(201).json({ message: "Book Created", book: saveBook });
    } catch (error) {
      // Handle errors during book creation
      console.log("Error creating book: ", error);
      return res
        .status(500)
        .json({ message: "Something went wrong, Please try again later" });
    }
  }
);

bookRouter.get(
  "/books",
  authorize(["VIEWER", "VIEW_ALL"]),
  async (
    req: Request & { userEmail?: string; roles?: string[] },
    res: Response
  ) => {
    try {
      const { old, new: newSearch } = req.query;
      const search = {} as { createdAt: {}; author: string | undefined };

      if (old) {
        search.createdAt = { $lte: new Date(Date.now() - 10 * 60 * 1000) };
      }

      if (newSearch) {
        search.createdAt = { $gt: new Date(Date.now() - 10 * 60 * 1000) };
      }

      let books: any = [];

      if (req.roles?.includes("VIEWER")) {
        search.author = req.userEmail;
        books = await BookModel.find(search);
      } else if (req.roles?.includes("VIEW_ALL")) {
        books = await BookModel.find(search);
      }

      if (books?.length === 0)
        return res.status(404).json({ message: "Books not found" });

      // Respond with success status and the books
      res.status(200).json(books);
    } catch (error) {
      // Handle errors during book creation
      console.log("Error fetching books: ", error);
      return res
        .status(500)
        .json({ message: "Something went wrong, Please try again later" });
    }
  }
);

export default bookRouter;
