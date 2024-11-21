import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", // Default role
    enum: ["user", "admin"], // Allowed roles
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String, // Token string for verification
  },
  verifyTokenExpiry: {
    type: Date, // Expiry date for the token
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
