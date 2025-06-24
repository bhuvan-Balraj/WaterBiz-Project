const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerProductController');

router.get('/', controller.getAll);
router.get('/:customer_id', controller.getByCustomer);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/mark-serviced/:id', controller.markAsServiced);

module.exports = router;
