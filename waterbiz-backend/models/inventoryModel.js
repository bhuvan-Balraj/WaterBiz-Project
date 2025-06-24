const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const getAllInventory = async () => {
  const result = await db.query('SELECT * FROM inventory ORDER BY created_at DESC');
  return result.rows;
};

const addInventoryItem = async (item) => {
  const id = uuidv4();
  const {
    product_name,
    quantity,
    purchase_price,
    sale_price,
    description,
    updated_by,
    product_type,
    product_make,
  } = item;

  await db.query(
    `INSERT INTO inventory 
     (product_id, product_name, quantity, purchase_price, sale_price, description, updated_by, product_type, product_make, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
    [id, product_name, quantity, purchase_price, sale_price, description, updated_by, product_type, product_make]
  );
};

const updateInventoryItem = async (id, item) => {
  const {
    product_name,
    quantity,
    purchase_price,
    sale_price,
    description,
    updated_by,
    product_type,
    product_make,
  } = item;

  await db.query(
    `UPDATE inventory SET 
      product_name = $1,
      quantity = $2,
      purchase_price = $3,
      sale_price = $4,
      description = $5,
      updated_by = $6,
      product_type = $7,
      product_make = $8,
      updated_at = NOW()
     WHERE product_id = $9`,
    [product_name, quantity, purchase_price, sale_price, description, updated_by, product_type, product_make, id]
  );
};

const deleteInventoryItem = async (id) => {
  await db.query('DELETE FROM inventory WHERE product_id = $1', [id]);
};

module.exports = {
  getAllInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
