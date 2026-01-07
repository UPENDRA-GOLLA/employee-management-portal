import Employee from "../models/employee.model.js";

export const getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

export const createEmployee = async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
};

export const updateEmployee = async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
