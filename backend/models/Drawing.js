// const mongoose = require('mongoose');

// const drawingSchema = new mongoose.Schema({
//   lines: {
//     type: Array,
//     required: true,
//   },
//   shapes: {
//     type: Array,
//     required: true,
//   },
//   texts: {
//     type: Array,
//     required: true,
//   },
// });

// const Drawing = mongoose.model('Drawing', drawingSchema);
// module.exports = Drawing;

const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  lines: [Object], // Define the schema for lines, shapes, texts based on your actual data
  shapes: [Object],
  texts: [String]
});

const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;

