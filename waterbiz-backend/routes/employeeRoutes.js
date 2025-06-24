const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');

router.get('/', controller.getEmployees);
router.post('/', controller.addEmployee);
router.put('/:id', controller.editEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
