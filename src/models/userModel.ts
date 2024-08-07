import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { 
      type: String, 
      required: true,
      unique: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    isVarified: { 
      type: Boolean, 
      default: false 
    },
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpires: Date,
    verifyToken: String,
    verifyTokenExpires: Date,
  },
  { timestamps: true }
);

//next js work on edge mean it has no idea that app is connecting with db first time or db already have the model
const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User;