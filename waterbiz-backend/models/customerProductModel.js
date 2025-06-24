const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const getAllCustomerProducts = async () => {
  const result = await db.query(`
    SELECT cp.*, c.name AS customer_name, i.product_name
    FROM customer_products cp
    JOIN customers c ON cp.customer_id = c.customer_id
    LEFT JOIN inventory i ON cp.product_id = i.product_id
    ORDER BY cp.updated_at DESC
  `);
  return result.rows;
};

const getCustomerProductsByCustomerId = async (customerId) => {
  const result = await db.query(
    `SELECT cp.*, i.product_name 
     FROM customer_products cp
     LEFT JOIN inventory i ON cp.product_id = i.product_id
     WHERE cp.customer_id = $1
     ORDER BY cp.updated_at DESC`,
    [customerId]
  );
  return result.rows;
};

const addCustomerProduct = async (data) => {
  const id = uuidv4();
  const {
    customer_id,
    product_id,
    serial_number,
    installation_date,
    last_service_date,
    next_service_date,
    remarks,
  } = data;

  await db.query(
    `INSERT INTO customer_products (
      ownership_id, customer_id, product_id, serial_number, installation_date,
      last_service_date, next_service_date, remarks, created_at, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())`,
    [id, customer_id, product_id, serial_number, installation_date, last_service_date, next_service_date, remarks]
  );
};

const updateCustomerProduct = async (id, data) => {
  const {
    product_id,
    serial_number,
    installation_date,
    last_service_date,
    next_service_date,
    remarks,
  } = data;

  await db.query(
    `UPDATE customer_products SET
      product_id = $1,
      serial_number = $2,
      installation_date = $3,
      last_service_date = $4,
      next_service_date = $5,
      remarks = $6,
      updated_at = NOW()
    WHERE ownership_id = $7`,
    [product_id, serial_number, installation_date, last_service_date, next_service_date, remarks, id]
  );
};

const deleteCustomerProduct = async (id) => {
  await db.query('DELETE FROM customer_products WHERE ownership_id = $1', [id]);
};

const markAsServiced = async (id) => {
  await db.query(
    `UPDATE customer_products SET
      last_service_date = CURRENT_DATE,
      next_service_date = CURRENT_DATE + INTERVAL '3 months',
      updated_at = NOW()
    WHERE ownership_id = $1`,
    [id]
  );
};

module.exports = {
  getAllCustomerProducts,
  getCustomerProductsByCustomerId,
  addCustomerProduct,
  updateCustomerProduct,
  deleteCustomerProduct,
  markAsServiced,
};
