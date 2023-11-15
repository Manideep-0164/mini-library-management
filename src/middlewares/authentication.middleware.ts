import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware for authentication using JWT
const authentication = (
  req: Request & { userEmail?: string; roles?: string[] },
  res: Response,
  next: NextFunction
) => {
  // Extract the JWT token from the request headers
  const token = req.headers.authorization;

  // Check if the token is provided
  if (!token) return res.status(401).json({ message: "Please provide token" });

  try {
    // Verify the JWT token
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: VerifyErrors | null, decode: any) => {
        // Handle TokenExpiredError
        if (err?.name === "TokenExpiredError")
          return res
            .status(401)
            .json({ message: "Session expired, Please login." });

        // Check for other JWT verification errors
        if (err?.name === "JsonWebTokenError") {
          console.error("JWT verification error:", err.message);
          return res
            .status(400)
            .json({ message: "Something went wrong, Please login again" });
        }

        // Extract user information from the decoded token
        const { userEmail, roles } = decode as {
          userEmail: string;
          roles: string[];
        };

        // Attach decoded information to the request object
        req.userEmail = userEmail;
        req.roles = roles;

        // Call the next method
        next();
      }
    );
  } catch (error) {
    console.log(`Error authenticating user => ${error}`);

    // Pass the error to the next error handling middleware
    next(error);
  }
};

export default authentication;
