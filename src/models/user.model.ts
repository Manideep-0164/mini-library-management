import mongoose, { Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  roles: Array<"CREATOR" | "VIEWER" | "VIEW_ALL">;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
      unique: true,
    },
    password: {
      type: String,
      requried: true,
    },
    roles: {
      type: [String],
      requried: true,
      enum: ["CREATOR", "VIEWER", "VIEW_ALL"],
    },
  },
  { versionKey: false }
);

const UserModel = mongoose.model<User>("user", userSchema);

export default UserModel;
