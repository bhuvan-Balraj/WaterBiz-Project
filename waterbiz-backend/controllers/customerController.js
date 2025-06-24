const customerModel = require('../models/customerModel');

// GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.getAllCustomers();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get customers' });
  }
};

// GET /api/customers/:id
const getCustomer = async (req, res) => {
  try {
    const customer = await customerModel.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get customer' });
  }
};

// POST /api/customers
const createCustomer = async (req, res) => {
  try {
    const newCustomer = await customerModel.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

// PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const updated = await customerModel.updateCustomer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

// DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const deleted = await customerModel.deleteCustomer(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
