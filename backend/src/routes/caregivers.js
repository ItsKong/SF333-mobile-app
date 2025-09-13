const express = require('express');
const router = express.Router();
const { createCaregiver, getCaregiverCaretaker } = require('../controllers/caregiversController');

router.post('/', createCaregiver); // Add a new caregiver and link to caretaker
router.get('/:id/caretaker', getCaregiverCaretaker); // Fetch linked caretaker info

module.exports = router;
