import { reconstructPath } from './helpers.js';

// Simple Priority Queue Implementation (Min-Heap style)
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(queueElement);
    }
  }
  dequeue() {
    return this.items.shift().element;
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

// Breadth-First Search (BFS)
export async function bfs(start, end, grid, getNeighbors, visitedNodes) {
  let queue = [];
  let visited = new Set();
  start.previous = null;
  queue.push(start);
  visited.add(start.dataset.row + "-" + start.dataset.col);

  while (queue.length) {
    let current = queue.shift();
    visitedNodes.push(current);
    if (current === end) {
      return reconstructPath(current);
    }
    let neighbors = getNeighbors(current, grid);
    for (let neighbor of neighbors) {
      let key = neighbor.dataset.row + "-" + neighbor.dataset.col;
      if (!visited.has(key) && !neighbor.classList.contains("wall")) {
        visited.add(key);
        neighbor.previous = current;
        queue.push(neighbor);
      }
    }
    // Optional delay for visualization
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return [];
}

// Depth-First Search (DFS)
export async function dfs(start, end, grid, getNeighbors, visitedNodes) {
  let stack = [];
  let visited = new Set();
  start.previous = null;
  stack.push(start);

  while (stack.length) {
    let current = stack.pop();
    let key = current.dataset.row + "-" + current.dataset.col;
    if (visited.has(key)) continue;
    visited.add(key);
    visitedNodes.push(current);
    if (current === end) {
      return reconstructPath(current);
    }
    let neighbors = getNeighbors(current, grid);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor.dataset.row + "-" + neighbor.dataset.col) &&
          !neighbor.classList.contains("wall")) {
        neighbor.previous = current;
        stack.push(neighbor);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return [];
}

// Dijkstra's Algorithm
export async function dijkstra(start, end, grid, getNeighbors, visitedNodes) {
  let distances = new Map();
  let pq = new PriorityQueue();

  // Initialize distances and previous pointers
  for (let row of grid) {
    for (let cell of row) {
      const key = cell.dataset.row + "-" + cell.dataset.col;
      distances.set(key, Infinity);
      cell.previous = null;
    }
  }
  const startKey = start.dataset.row + "-" + start.dataset.col;
  distances.set(startKey, 0);
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    let current = pq.dequeue();
    visitedNodes.push(current);
    if (current === end) {
      return reconstructPath(current);
    }
    let currentKey = current.dataset.row + "-" + current.dataset.col;
    let neighbors = getNeighbors(current, grid);
    for (let neighbor of neighbors) {
      if (neighbor.classList.contains("wall")) continue;
      let neighborKey = neighbor.dataset.row + "-" + neighbor.dataset.col;
      let newDist = distances.get(currentKey) + 1; // Uniform cost for each move
      if (newDist < distances.get(neighborKey)) {
        distances.set(neighborKey, newDist);
        neighbor.previous = current;
        pq.enqueue(neighbor, newDist);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return [];
}

// A* Search Algorithm
export async function aStar(start, end, grid, getNeighbors, visitedNodes) {
  let openSet = new PriorityQueue();
  let gScore = new Map();
  let fScore = new Map();

  // Initialize scores and previous pointers
  for (let row of grid) {
    for (let cell of row) {
      const key = cell.dataset.row + "-" + cell.dataset.col;
      gScore.set(key, Infinity);
      fScore.set(key, Infinity);
      cell.previous = null;
    }
  }
  const startKey = start.dataset.row + "-" + start.dataset.col;
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, end));
  openSet.enqueue(start, fScore.get(startKey));

  while (!openSet.isEmpty()) {
    let current = openSet.dequeue();
    visitedNodes.push(current);
    if (current === end) {
      return reconstructPath(current);
    }
    let neighbors = getNeighbors(current, grid);
    for (let neighbor of neighbors) {
      if (neighbor.classList.contains("wall")) continue;
      let neighborKey = neighbor.dataset.row + "-" + neighbor.dataset.col;
      let tentativeGScore = gScore.get(startKey) + 1;
      if (tentativeGScore < gScore.get(neighborKey)) {
        neighbor.previous = current;
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
        openSet.enqueue(neighbor, fScore.get(neighborKey));
      }
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  return [];
}

// Heuristic function (Manhattan distance)
function heuristic(cell, end) {
  let dx = Math.abs(cell.dataset.col - end.dataset.col);
  let dy = Math.abs(cell.dataset.row - end.dataset.row);
  return dx + dy;
}
