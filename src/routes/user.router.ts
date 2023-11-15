import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

dotenv.config();
const userRouter = express.Router();

userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    // Extract user information from the request body
    const { name, email, password, roles } = req.body as {
      name: string;
      email: string;
      password: string;
      roles: string[];
    };

    // Check if all required fields are provided
    if (!name || !email || !password || !roles?.length) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if roles contain only valid values
    const validRoles = roles.every(
      (role) => role === "CREATOR" || role === "VIEWER" || role === "VIEW_ALL"
    );

    // If roles include invalid values, return a 400 status
    if (!validRoles) {
      return res.status(400).json({
        message:
          "Invalid value for roles. Allowed values: CREATOR, VIEWER, VIEW_ALL",
      });
    }

    // Check if a user with the provided email already exists
    const userExists = await UserModel.findOne({ email: email });

    // If user already exists, return a 401 status
    if (userExists) {
      return res
        .status(401)
        .json({ message: "User already exists, Please Login." });
    }

    // Hash the provided password
    bcrypt.hash(password, 5, async (err, hash) => {
      // Handle any errors during password hashing
      if (err) {
        console.log("Error hashing password: ", err);
        return res
          .status(500)
          .json({ message: "Something went wrong, Please try again later" });
      }

      // Create a new user document
      const saveUser = new UserModel({ name, email, password: hash, roles });

      // Save the new user document to the database
      await saveUser.save();

      // Respond with success status and the saved user document
      res
        .status(201)
        .json({ message: "Successfully Registered.", user: saveUser });
    });
  } catch (error) {
    // Handle any unexpected errors during user registration
    console.log("Error Registering user: ", error);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" });
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Find the user with the provided email in the database
    const userExists = await UserModel.findOne({ email: email });

    // If user does not exist, return 404 status
    if (!userExists) {
      return res
        .status(404)
        .json({ message: "User does not exist, Please Register." });
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, userExists.password, async (err, result) => {
      // Handle any errors during password comparison
      if (err) {
        console.log("Error comparing password: ", err);
        return res
          .status(500)
          .json({ message: "Something went wrong, Please try again later" });
      }

      // If passwords do not match, return 401 status
      if (!result) {
        return res.status(401).json({ message: "Invalid Credentials!" });
      }

      // Create a JWT token payload with user information
      const tokenPayload = {
        userEmail: userExists.email,
        roles: userExists.roles,
      };

      // Sign the token with the secret key and set an expiration time
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, {
        expiresIn: "1H",
      });

      // Respond with success status and the generated token
      res.status(200).json({ message: "Login Success.", token });
    });
  } catch (error) {
    // Handle any unexpected errors
    console.log("Error Logging in the user: ", error);
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" });
  }
});

export default userRouter;
