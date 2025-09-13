const express = require('express');
const router = express.Router();
const { createCaretaker, getCaretaker } = require('../controllers/caretakersController');

router.post('/', createCaretaker);
router.get('/:code', getCaretaker);

module.exports = router;
