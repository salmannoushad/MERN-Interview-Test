const Drawing = require('../models/Drawing');

// Create a new drawing
exports.createDrawing = async (req, res) => {
  try {
    const drawing = new Drawing(req.body); // Use req.body to get the data from the request
    const savedDrawing = await drawing.save();
    res.status(201).json(savedDrawing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all drawings
exports.getAllDrawings = async (req, res) => {
  try {
    const drawings = await Drawing.find();
    res.status(200).json(drawings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a drawing by ID
exports.getDrawingById = async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    res.status(200).json(drawing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a drawing by ID
exports.updateDrawing = async (req, res) => {
  try {
    const drawing = await Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!drawing) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    res.status(200).json(drawing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a drawing by ID
exports.deleteDrawing = async (req, res) => {
  try {
    const deletedDrawing = await Drawing.findByIdAndDelete(req.params.id);
    if (!deletedDrawing) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    res.status(200).json({ message: 'Drawing deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
