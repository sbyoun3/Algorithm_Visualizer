// Import algorithm functions and helpers
import { bfs, dfs, dijkstra, aStar } from './algorithms.js';
import { getNeighbors, reconstructPath } from './helpers.js';

// Grid configuration
const rows = 20;
const cols = 20;
let grid = [];
let isMouseDown = false;
let settingStart = false;
let settingEnd = false;
let startCell = null;
let endCell = null;

const gridContainer = document.getElementById("grid");

// Create the grid and attach event listeners to each cell
function createGrid() {
  gridContainer.innerHTML = '';
  grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("mousedown", handleCellMouseDown);
      cell.addEventListener("mouseover", handleCellMouseOver);
      gridContainer.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }
}

// Mouse event handlers for setting walls, start, and end points
function handleCellMouseDown(e) {
  const cell = e.target;
  if (settingStart) {
    if (startCell) startCell.classList.remove("start");
    startCell = cell;
    cell.classList.add("start");
    settingStart = false;
  } else if (settingEnd) {
    if (endCell) endCell.classList.remove("end");
    endCell = cell;
    cell.classList.add("end");
    settingEnd = false;
  } else {
    cell.classList.toggle("wall");
  }
  isMouseDown = true;
}

function handleCellMouseOver(e) {
  if (!isMouseDown) return;
  const cell = e.target;
  if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
    cell.classList.add("wall");
  }
}

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// Control button event listeners
document.getElementById("set-start").addEventListener("click", () => {
  settingStart = true;
  settingEnd = false;
});

document.getElementById("set-end").addEventListener("click", () => {
  settingEnd = true;
  settingStart = false;
});

document.getElementById("clear-grid").addEventListener("click", () => {
  createGrid();
  startCell = null;
  endCell = null;
});

// Initialize the grid when the page loads
createGrid();

// Start algorithm button handler
document.getElementById("start-algorithm").addEventListener("click", async () => {
  if (!startCell || !endCell) {
    alert("Please set both start and end points!");
    return;
  }

  const algorithm = document.getElementById("algorithm-select").value;
  let path = [];
  // Optionally, maintain an array of visited nodes for animation
  let visitedNodes = [];

  switch (algorithm) {
    case "dijkstra":
      path = await dijkstra(startCell, endCell, grid, getNeighbors, visitedNodes);
      break;
    case "astar":
      path = await aStar(startCell, endCell, grid, getNeighbors, visitedNodes);
      break;
    case "bfs":
      path = await bfs(startCell, endCell, grid, getNeighbors, visitedNodes);
      break;
    case "dfs":
      path = await dfs(startCell, endCell, grid, getNeighbors, visitedNodes);
      break;
  }
  animateAlgorithm(visitedNodes, path);
});

// Animation function to visualize visited nodes and the final path
async function animateAlgorithm(visitedNodes, pathNodes) {
  for (const node of visitedNodes) {
    if (!node.classList.contains("start") && !node.classList.contains("end")) {
      node.classList.add("visited");
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
  for (const node of pathNodes) {
    if (!node.classList.contains("start") && !node.classList.contains("end")) {
      node.classList.add("path");
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
}
