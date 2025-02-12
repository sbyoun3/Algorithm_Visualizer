// Returns the neighboring cells (up, down, left, right) for a given cell
export function getNeighbors(cell, grid) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const neighbors = [];
  
    // Up
    if (row > 0) neighbors.push(grid[row - 1][col]);
    // Down
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    // Left
    if (col > 0) neighbors.push(grid[row][col - 1]);
    // Right
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors;
  }
  
  // Reconstructs the path from the end cell to the start cell using the previous pointers
  export function reconstructPath(endCell) {
    const path = [];
    let current = endCell;
    while (current !== null) {
      path.unshift(current);
      current = current.previous;
    }
    return path;
  }
  