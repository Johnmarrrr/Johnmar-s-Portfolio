const express = require('express');
const router = express.Router();
const { getSkills, createSkill, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSkills)
  .post(protect, createSkill);

router.route('/:id')
  .delete(protect, deleteSkill);

module.exports = router;
