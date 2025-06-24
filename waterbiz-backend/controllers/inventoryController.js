const InventoryModel = require('../models/inventoryModel');

const getInventory = async (req, res) => {
  try {
    const inventory = await InventoryModel.getAllInventory();
    res.json(inventory);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    await InventoryModel.addInventoryItem(req.body);
    res.status(201).json({ message: 'Item added successfully' });
  } catch (err) {
    console.error('Error adding inventory item:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await InventoryModel.updateInventoryItem(id, req.body);
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error('Error updating inventory item:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await InventoryModel.deleteInventoryItem(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

module.exports = {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
