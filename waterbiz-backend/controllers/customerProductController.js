const CustomerProductModel = require('../models/customerProductModel');

const getAll = async (req, res) => {
  try {
    const products = await CustomerProductModel.getAllCustomerProducts();
    res.json(products);
  } catch (err) {
    console.error('Error fetching all customer products:', err);
    res.status(500).json({ error: 'Failed to fetch customer products' });
  }
};

const getByCustomer = async (req, res) => {
  try {
    const data = await CustomerProductModel.getCustomerProductsByCustomerId(req.params.customer_id);
    res.json(data);
  } catch (err) {
    console.error('Error fetching customer-owned products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const create = async (req, res) => {
  try {
    await CustomerProductModel.addCustomerProduct(req.body);
    res.status(201).json({ message: 'Customer product added successfully' });
  } catch (err) {
    console.error('Error adding customer product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

const update = async (req, res) => {
  try {
    await CustomerProductModel.updateCustomerProduct(req.params.id, req.body);
    res.json({ message: 'Customer product updated successfully' });
  } catch (err) {
    console.error('Error updating customer product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const remove = async (req, res) => {
  try {
    await CustomerProductModel.deleteCustomerProduct(req.params.id);
    res.json({ message: 'Customer product deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const markAsServiced = async (req, res) => {
  try {
    await CustomerProductModel.markAsServiced(req.params.id);
    res.json({ message: 'Product marked as serviced' });
  } catch (err) {
    console.error('Error marking product as serviced:', err);
    res.status(500).json({ error: 'Failed to update service date' });
  }
};

module.exports = {
  getAll,
  getByCustomer,
  create,
  update,
  remove,
  markAsServiced,
};
