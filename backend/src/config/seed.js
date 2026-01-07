import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashed = await bcrypt.hash("admin123", 10);

await User.deleteMany();
await User.create({
  email: "admin@test.com",
  password: hashed
});

console.log("Admin user seeded");
process.exit();
