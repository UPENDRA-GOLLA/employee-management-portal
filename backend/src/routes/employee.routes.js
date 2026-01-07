import express from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employee.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getEmployees);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
