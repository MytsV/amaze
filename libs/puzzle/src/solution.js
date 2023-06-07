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
    const y = 1 + Math.min(a.x, b.x) * 2;
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
    // TODO: implement all steps
    if (!this.isPathValid()) return false;
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

    for (let i = 0; i < vertices.length; i++) {
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
    if (!endpoint) return false;
  }
}

module.exports = {Solution, getEdgePosition};
