const Position = require('./position');
const {EdgeType} = require('./maze');

/**
 * Calculates edge position from positions of two vertices.
 * @param {Position} a
 * @param {Position} b
 * @return {Position}
 */
const edgeOfVertices = (a, b) => {
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

const dirs = {
  left: new Position(-1, 0),
  right: new Position(1, 0),
  down: new Position(0, -1),
  up: new Position(0, 1),
};

// Calculated by vertices, because this is just more convenient
/**
 * Calculates an edge in the given direction from cell
 * @param {Position} cell
 * @param {Position} dir
 * @return {Position}
 */
const edgeOfCell = (cell, dir) => {
  let a; let b;
  if (dir.equals(dirs.left)) {
    a = cell;
    b = new Position(cell.x, cell.y + 1);
  } else if (dir.equals(dirs.right)) {
    a = new Position(cell.x + 1, cell.y);
    b = new Position(cell.x + 1, cell.y + 1);
  } else if (dir.equals(dirs.down)) {
    a = cell;
    b = new Position(cell.x + 1, cell.y);
  } else if (dir.equals(dirs.up)) {
    a = new Position(cell.x, cell.y + 1);
    b = new Position(cell.x + 1, cell.y + 1);
  }
  return edgeOfVertices(a, b);
};

/**
 * A checker for path validity on a given maze.
 */
class Solution {
  constructor(maze, path) {
    Object.assign(this, {maze, path});
  }

  /**
   * Determines whether all modifiers and edges have no conflict with the path.
   * @return {boolean}
   */
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
  /**
   * Checks whether path is valid outside of modifiers.
   * @return {boolean}
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

      const edge = edgeOfVertices(last, vertex);
      if (this.maze.edgeTypes[edge.toKey()] !== EdgeType.Solid) {
        return false;
      }

      last = vertex;
    }

    const endpoint = this.maze.endpoints.find((e) => e.equals(last));
    return endpoint !== undefined;
  }

  /**
   * Checks whether vertex modifiers work correctly with the path.
   * @return {boolean}
   */
  checkVertexModifiers() {
    const modifiers = this.maze.vertexModifiers;
    for (const [key, modifier] of Object.entries(modifiers)) {
      if (!modifier.check(Position.fromKey(key), this.path)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks whether cell modifiers work correctly with the path.
   * @return {boolean}
   */
  checkCellModifiers() {
    const sectionCells = this.getSections();
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

  /**
   * Splits the maze into cell sections by the path.
   * @return {array}
   */
  getSections() {
    const sections = [];
    const edges = new Set();
    const {width, height} = this.maze;

    let lastVertex = this.path.vertices[0];
    for (let i = 1; i < this.path.vertices.length; i++) {
      const vertex = this.path.vertices[i];
      edges.add(edgeOfVertices(lastVertex, vertex).toKey());
      lastVertex = vertex;
    }

    const visited = new Set();

    const dfs = (cell, section) => {
      if (visited.has(cell.toKey())) return;
      if (cell.x < 0 || cell.y < 0 || cell.x >= width || cell.y >= height) {
        return;
      }
      visited.add(cell.toKey());
      section.push(cell);

      Object.values(dirs).forEach((dir) => {
        const edge = edgeOfCell(cell, dir);
        if (edges.has(edge.toKey())) return;
        dfs(new Position(cell.x + dir.x, cell.y + dir.y), section);
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
  }
}

module.exports = {Solution, edgeOfVertices, edgeOfCell};
