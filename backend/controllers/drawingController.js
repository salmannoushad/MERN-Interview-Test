const Drawing = require('../models/Drawing');
const messages = require('../utils/messages');
const statusCodes = require('../utils/statusCodes');
const CustomError = require('../utils/CustomError');

// Create a new drawing
exports.createDrawing = async (req, res, next) => {
  try {
    const drawing = new Drawing(req.body);
    const savedDrawing = await drawing.save();
    res.status(statusCodes.CREATED).json({
      success: true,
      data: savedDrawing,
    });
  } catch (error) {
    next(new CustomError(statusCodes.BAD_REQUEST, messages.ERROR_SAVING_DRAWING));
  }
};

// Get all drawings
exports.getAllDrawings = async (req, res, next) => {
  try {
    const drawings = await Drawing.find();
    res.status(statusCodes.OK).json({
      success: true,
      data: drawings,
    });
  } catch (error) {
    next(new CustomError(statusCodes.BAD_REQUEST, messages.ERROR_FETCHING_DRAWINGS));
  }
};

// Get a drawing by ID
exports.getDrawingById = async (req, res, next) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) {
      return next(new CustomError(statusCodes.NOT_FOUND, messages.DRAWING_NOT_FOUND));
    }
    res.status(statusCodes.OK).json({
      success: true,
      data: drawing,
    });
  } catch (error) {
    next(new CustomError(statusCodes.BAD_REQUEST, messages.ERROR_FETCHING_DRAWINGS));
  }
};

// Update a drawing by ID
exports.updateDrawing = async (req, res, next) => {
  try {
    const drawing = await Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!drawing) {
      return next(new CustomError(statusCodes.NOT_FOUND, messages.DRAWING_NOT_FOUND));
    }
    res.status(statusCodes.OK).json({
      success: true,
      data: drawing,
    });
  } catch (error) {
    next(new CustomError(statusCodes.BAD_REQUEST, messages.ERROR_UPDATING_DRAWING));
  }
};

// Delete a drawing by ID
exports.deleteDrawing = async (req, res, next) => {
  try {
    const deletedDrawing = await Drawing.findByIdAndDelete(req.params.id);
    if (!deletedDrawing) {
      return next(new CustomError(statusCodes.NOT_FOUND, messages.DRAWING_NOT_FOUND));
    }
    res.status(statusCodes.OK).json({
      success: true,
      message: messages.DRAWING_DELETED_SUCCESS,
    });
  } catch (error) {
    next(new CustomError(statusCodes.BAD_REQUEST, messages.ERROR_DELETING_DRAWING));
  }
};
