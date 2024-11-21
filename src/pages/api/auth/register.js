import { dbConnect } from "@/utils/dbConfig/dbConfig";
import User from "@/models/userModels";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/helper/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await dbConnect();

  const { userName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user without verifying initially
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      isVerified: false, // Default as false
    });

    // Save the user
    const savedUser = await newUser.save();

    // Send verification email
    await sendEmail({
      email: savedUser.email,
      emailType: "VERIFY", // Type of email (VERIFY or RESET)
      userId: savedUser._id, // User ID for verification token
    });

    res.status(201).json({
      message: "User registered successfully! Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
