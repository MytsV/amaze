const Position = require('./position');
const {EdgeType} = require('./maze');

/**
 * Calculates edge position from positions of two vertices.
 * @param {Position} a
 * @param {Position} b
 * @return {Position}
 */
const getEdgePosition = (a, b) => {
  if (a.y === b.y && Math.abs(a.x - b.x) === 1) { // If edge is horizontal
    const y = a.y * 2;
    const x = Math.min(a.x, b.x);
    return new Position(x, y);
  } else if (a.x === b.x && Math.abs(a.y - b.y) === 1) { // If edge is vertical
    const y = 1 + Math.min(a.y, b.y) * 2;
    return new Position(a.x, y);
  } else {
    throw Error('Vertices can\'t be equal');
  }
};

class Solution {
  constructor(maze, path) {
    Object.assign(this, {maze, path});
  }

  isValid() {
    if (!this.isPathValid()) return false;
    if (!this.checkVertexModifiers()) return false;
    return this.checkCellModifiers();
  }

  /*
   Check whether the path is applicable to the maze:
   - it is valid by itself
   - it addresses only valid vertex positions on a maze
   - it doesn't pass through absent or disrupt edges
   - it begins from an origin
   - it ends on an endpoint
   */
  isPathValid() {
    if (!this.path.isValid()) return false;

    const vertices = this.path.vertices;
    let last = vertices[0];

    const origin = this.maze.origins.find((e) => e.equals(last));
    if (!origin) return false;

    for (let i = 1; i < vertices.length; i++) {
      const vertex = vertices[i];

      try {
        this.maze.verifyVertexPosition(vertex);
      } catch (_) {
        return false;
      }

      const edge = getEdgePosition(last, vertex);
      if (this.maze.edgeTypes[edge.toKey()] !== EdgeType.Solid) {
        return false;
      }

      last = vertex;
    }

    const endpoint = this.maze.endpoints.find((e) => e.equals(last));
    return endpoint !== undefined;
  }

  checkVertexModifiers() {
    const modifiers = this.maze.vertexModifiers;
    for (const [key, modifier] of Object.entries(modifiers)) {
      if (!modifier.check(Position.fromKey(key), this.path)) {
        return false;
      }
    }
    return true;
  }

  checkCellModifiers() {
    const sectionCells = getSections(this.maze, this.path);
    const sections = [];
    for (const cells of sectionCells) {
      const section = {};
      for (const cell of cells) {
        const key = cell.toKey();
        const modifier = this.maze.cellModifiers[key];
        if (modifier) {
          section[key] = {
            modifier,
            valid: false,
          };
        } else {
          sections[key] = null;
        }
      }
      for (const cell of cells) {
        const key = cell.toKey();
        const modifier = this.maze.cellModifiers[key];
        if (modifier) {
          modifier.check(section, this.path);
        }
      }
      sections.push(section);
    }
    for (const section of sections) {
      for (const element of Object.values(section)) {
        if (element.modifier !== null && !element.valid) return false;
      }
    }
    return true;
  }
}

const getEdge = (cell, direction) => {
  let a; let b;
  if (direction.x === -1) {
    a = cell;
    b = new Position(cell.x, cell.y + 1);
  } else if (direction.x === 1) {
    a = new Position(cell.x + 1, cell.y);
    b = new Position(cell.x + 1, cell.y + 1);
  } else if (direction.y === -1) {
    a = cell;
    b = new Position(cell.x + 1, cell.y);
  } else if (direction.y === 1) {
    a = new Position(cell.x, cell.y + 1);
    b = new Position(cell.x + 1, cell.y + 1);
  }
  return getEdgePosition(a, b);
};

const getSections = ({width, height}, path) => {
  const sections = [];
  const edges = new Set();

  let lastVertex = path.vertices[0];
  for (let i = 1; i < path.vertices.length; i++) {
    const vertex = path.vertices[i];
    edges.add(getEdgePosition(lastVertex, vertex).toKey());
    lastVertex = vertex;
  }

  const directions = [
    // Left
    new Position(-1, 0),
    // Right
    new Position(1, 0),
    // Down
    new Position(0, -1),
    // Up
    new Position(0, 1),
  ];

  const visited = new Set();

  const dfs = (cell, section) => {
    if (visited.has(cell.toKey())) return;
    if (cell.x < 0 || cell.y < 0 || cell.x >= width || cell.y >= width) return;
    visited.add(cell.toKey());
    section.push(cell);

    directions.forEach((direction) => {
      const edge = getEdge(cell, direction);
      if (edges.has(edge.toKey())) return;
      dfs(new Position(cell.x + direction.x, cell.y + direction.y), section);
    });
  };

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const section = [];
      dfs(new Position(i, j), section);
      if (section.length !== 0) {
        sections.push(section);
      }
    }
  }

  return sections;
};

module.exports = {Solution, getEdgePosition};
