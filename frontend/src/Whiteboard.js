import React, { useRef, useState, useEffect } from "react";
import { AiOutlineUndo, AiOutlineClear, AiOutlineRedo, AiOutlineSave, AiOutlineFileSearch, AiOutlineDelete, AiOutlineEdit, AiOutlineSelect } from "react-icons/ai";
import axios from 'axios'; // Import Axios for API calls

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // Backend server URL
});

const Whiteboard = () => {
  const [color, setColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(4);
  const [mode, setMode] = useState("draw"); // "draw", "rectangle", "circle", "text"
  const [text, setText] = useState(""); // For text annotations
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Shape start position
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawingFree, setIsDrawingFree] = useState(false); // For free draw
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [drawings, setDrawings] = useState([]); // State to store all drawings
  const [currentDrawingId, setCurrentDrawingId] = useState(null); // Current drawing ID for updates
  const [linesData, setLinesData] = useState([]);
  const [shapesData, setShapesData] = useState([]);
  const [textsData, setTextsData] = useState([]);
  const [selectedDrawing, setSelectedDrawing] = useState(null); // Selected drawing for update
  

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Setup the canvas when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.border = "2px solid #000";

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = brushRadius;
    contextRef.current = context;

    fetchDrawings(); // Fetch drawings on mount
  }, []);

  // API calls
  const fetchDrawings = async () => {
    try {
      const response = await api.get('/drawings');
      console.log("API Response:", response.data); // Log the full API response
      if (response.data && response.data.success) {
        setDrawings(response.data.data); // Extract the `data` array
      } else {
        console.error("Unexpected response format:", response.data);
        setDrawings([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching drawings:", error);
      setDrawings([]); // Fallback to an empty array on error
    }
  };
  

  const createDrawing = async () => {
    const drawing = {
      lines: linesData,
      shapes: shapesData,
      texts: textsData
    };
    try {
      const response = await api.post('/drawings', drawing);
      setDrawings([...drawings, response.data]);
      setCurrentDrawingId(response.data._id); // Set the ID of the newly created drawing
    } catch (error) {
      console.error("Error creating drawing:", error);
    }
  };

  const updateDrawing = async () => {
    const drawing = {
      lines: linesData,
      shapes: shapesData,
      texts: textsData
    };
    try {
      await api.put(`/drawings/${currentDrawingId}`, drawing);
      fetchDrawings(); // Refresh the list of drawings
    } catch (error) {
      console.error("Error updating drawing:", error);
    }
  };

  const saveDrawing = async () => {
    saveToUndoStack();
    if (currentDrawingId) {
      await updateDrawing();
    } else {
      await createDrawing();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    setLinesData([]);
    setShapesData([]);
    setTextsData([]);
  };

  const saveToUndoStack = () => {
    setUndoStack([...undoStack, canvasRef.current.toDataURL()]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastImage = undoStack.pop();
      const img = new Image();
      img.src = lastImage;
      img.onload = () => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
      setRedoStack([...redoStack, lastImage]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastImage = redoStack.pop();
      const img = new Image();
      img.src = lastImage;
      img.onload = () => {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
      setUndoStack([...undoStack, lastImage]);
    }
  };

  const startDrawingFree = ({ nativeEvent }) => {
    if (mode === "draw") {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawingFree(true);
      saveToUndoStack();
    }
  };

  const finishDrawingFree = () => {
    if (isDrawingFree) {
      contextRef.current.closePath();
      setIsDrawingFree(false);
    }
  };

  const drawFree = ({ nativeEvent }) => {
    if (!isDrawingFree) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setLinesData((prevLines) => [
      ...prevLines,
      { start: startPos, end: { x: offsetX, y: offsetY }, color, lineWidth: brushRadius }
    ]);
  };

  const handleMouseDown = (e) => {
    if (mode !== "draw") {
      setIsDrawing(true);
      const { offsetX, offsetY } = e.nativeEvent;
      setStartPos({ x: offsetX, y: offsetY });
      saveToUndoStack();
    }
  };

  const handleMouseUp = (e) => {
    if (mode !== "draw" && isDrawing && canvasRef.current) {
      setIsDrawing(false);
      const { offsetX, offsetY } = e.nativeEvent;
      const ctx = canvasRef.current.getContext("2d");
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      let newShape;
      if (mode === "rectangle") {
        const width = offsetX - startPos.x;
        const height = offsetY - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, width, height);
        newShape = { type: "rectangle", x: startPos.x, y: startPos.y, width, height, color };
      } else if (mode === "circle") {
        const radius = Math.sqrt(
          Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        newShape = { type: "circle", x: startPos.x, y: startPos.y, radius, color };
      } else if (mode === "text") {
        ctx.font = "20px Arial";
        ctx.fillText(text, offsetX, offsetY);
        newShape = { type: "text", x: offsetX, y: offsetY, text, color };
      }

      if (newShape) {
        setShapesData((prevShapes) => [...prevShapes, newShape]);
      }
    }
  };

  const renderDrawing = (drawing) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas before rendering
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render lines
    drawing.lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.lineWidth;
      ctx.stroke();
    });

    // Render shapes
    drawing.shapes.forEach(shape => {
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color;
      if (shape.type === "rectangle") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (shape.type === "text") {
        ctx.font = "20px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
      }
    });
  };

  const handleSelectDrawing = (drawing) => {
    setSelectedDrawing(drawing);
    setCurrentDrawingId(drawing._id);
    setLinesData(drawing.lines || []);
    setShapesData(drawing.shapes || []);
    setTextsData(drawing.texts || []);
    renderDrawing(drawing); // Render the selected drawing on the canvas
  };

  const handleDeleteDrawing = async (id) => {
    try {
      await api.delete(`/drawings/${id}`);
      fetchDrawings(); // Refresh the list of drawings
    } catch (error) {
      console.error("Error deleting drawing:", error);
    }
  };

  const handleUpdateDrawing = async () => {
    const drawing = {
      lines: linesData,
      shapes: shapesData,
      texts: textsData
    };
    try {
      await api.put(`/drawings/${currentDrawingId}`, drawing);
      fetchDrawings(); // Refresh the list of drawings
    } catch (error) {
      console.error("Error updating drawing:", error);
    }
  };

  return (
    <div className="whiteboard-container">
      <div className="controls">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="10"
          value={brushRadius}
          onChange={(e) => setBrushRadius(Number(e.target.value))}
        />
        <button onClick={handleUndo}>
          <AiOutlineUndo /> Undo
        </button>
        <button onClick={handleRedo}>
          <AiOutlineRedo /> Redo
        </button>
        <button onClick={clearCanvas}>
          <AiOutlineClear /> Clear
        </button>
        <button onClick={saveDrawing}>
          <AiOutlineSave /> Save
        </button>
        <button onClick={fetchDrawings}>
          <AiOutlineFileSearch /> Fetch Drawings
        </button>
        {currentDrawingId && (
          <button onClick={handleUpdateDrawing}>
            <AiOutlineEdit /> Update Drawing
          </button>
        )}
      </div>

      <div className="mode-buttons">
        <button onClick={() => setMode("draw")}>Free Draw</button>
        <button onClick={() => setMode("rectangle")}>Rectangle</button>
        <button onClick={() => setMode("circle")}>Circle</button>
        <button onClick={() => setMode("text")}>Text</button>
        {mode === "text" && (
          <input
            type="text"
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={mode === "draw" ? startDrawingFree : handleMouseDown}
        onMouseUp={mode === "draw" ? finishDrawingFree : handleMouseUp}
        onMouseMove={mode === "draw" ? drawFree : null}
      />

      {console.log('adsfasfd',drawings)}

      <div className="drawings-list">
        <h3>Drawings</h3>
        <ul>
          {drawings.length === 0 ? (
            <li>No drawings available.</li>
          ) : (
            drawings.map((drawing) => (
              <li key={drawing._id}>
                <button onClick={() => handleSelectDrawing(drawing)}>
                  <AiOutlineSelect /> Select
                </button>
                <button onClick={() => handleDeleteDrawing(drawing._id)}>
                  <AiOutlineDelete /> Delete
                </button>
                <span>{drawing._id}</span> {/* Display some info */}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Whiteboard;
