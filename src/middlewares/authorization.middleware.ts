import { Request, Response, NextFunction } from "express";

// Middleware for authorization based on user roles
const authorize = (permittedRoles: string[]) => {
  // Return a middleware function
  return (
    req: Request & { roles?: string[] },
    res: Response,
    next: NextFunction
  ) => {
    // Check if the user has the permitted role
    const isUserAuthorized = permittedRoles.some((pRole) =>
      req.roles?.includes(pRole)
    );

    // If authorized, call the next middleware in the chain
    if (isUserAuthorized) {
      next();
    } else {
      // If not authorized, send a 401 Unauthorized response
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

// Export the authorization middleware
export default authorize;
