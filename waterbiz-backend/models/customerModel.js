const pool = require('../db');

// Get all customers
const getAllCustomers = async () => {
  const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
  return result.rows;
};

// Get customer by ID
const getCustomerById = async (id) => {
  const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
  return result.rows[0];
};

// Create new customer
const createCustomer = async (data) => {
  const { name, primary_mobile, secondary_mobile, address, map_location } = data;
  const result = await pool.query(
    `INSERT INTO customers (name, primary_mobile, secondary_mobile, address, map_location)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, primary_mobile, secondary_mobile, address, map_location]
  );
  return result.rows[0];
};

// Update customer
const updateCustomer = async (id, data) => {
  const { name, primary_mobile, secondary_mobile, address, map_location } = data;
  const result = await pool.query(
    `UPDATE customers
     SET name=$1, primary_mobile=$2, secondary_mobile=$3, address=$4, map_location=$5, updated_at=NOW()
     WHERE customer_id=$6 RETURNING *`,
    [name, primary_mobile, secondary_mobile, address, map_location, id]
  );
  return result.rows[0];
};

// Delete customer
const deleteCustomer = async (id) => {
  const result = await pool.query('DELETE FROM customers WHERE customer_id=$1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
