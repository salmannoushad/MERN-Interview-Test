const express = require('express');
const {
  createDrawing,
  getAllDrawings,
  getDrawingById,
  updateDrawing,
  deleteDrawing,
} = require('../controllers/drawingController');

const router = express.Router();

router.post('/', createDrawing);
router.get('/', getAllDrawings);
router.get('/:id', getDrawingById);
router.put('/:id', updateDrawing);
router.delete('/:id', deleteDrawing);

module.exports = router;
