const express = require('express');
const cors = require('cors');
const pool = require('./db');
const customerRoutes = require('./routes/customerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const customerProductRoutes = require('./routes/customerProductRoutes');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/customer-products', customerProductRoutes);

// Test route
app.get('/', (req, res) => res.send('WaterBiz API running'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
