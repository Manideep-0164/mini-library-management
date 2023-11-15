import express, { Request, Response } from "express";
import cors from "cors";
import connection from "./configs/db";
import userRouter from "./routes/user.router";

const app = express();
const PORT = process.env.PORT || 1010;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Library Management app." });
});

app.use("", userRouter);

connection
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log("Server is running on", PORT);
    });
  })
  .catch((err: Error) => {
    console.log("Error connecting to DB/Server", err);
  });
