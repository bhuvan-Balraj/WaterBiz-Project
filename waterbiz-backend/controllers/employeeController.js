const model = require('../models/employeeModel');

const getEmployees = async (req, res) => {
  try {
    const employees = await model.getAllEmployees();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

const addEmployee = async (req, res) => {
  try {
    const newEmp = await model.createEmployee(req.body);
    res.status(201).json(newEmp);
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

const editEmployee = async (req, res) => {
  try {
    const updated = await model.updateEmployee(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await model.deleteEmployee(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  editEmployee,
  deleteEmployee
};
