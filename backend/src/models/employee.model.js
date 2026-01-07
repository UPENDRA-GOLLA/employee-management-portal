import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  department: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Employee", employeeSchema);
