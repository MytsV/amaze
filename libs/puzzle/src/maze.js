/** A wrapper for any positions on a Maze. **/
class Coordinate {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

/**
 * An abstract class which defines the structure of any maze.
 * ORIGINS
 * - "Entrances", vertices which a solution can begin from.
 * - Represented as an array of points on the Maze.
 * ENDPOINTS
 * - "Exits", vertices which a solution can end on.
 * - Represented as an array of points on the Maze.
 */
class Maze {
  /**
   * Creates a maze with width * height cells.
   * @param {number} width - cell count per x axis.
   * @param {number} height - cell count per y axis.
   */
  constructor(width, height) {
    if (width <= 0 || height <= 0) {
      throw Error('Cell count can\'t be negative or zero');
    }
    Object.assign(this, {width, height});
    this.origins = [];
    this.endpoints = [];
    this.edgeTypes = {};
    this.modifiers = {};
  }

  /*
  Origin numeration looks as follows for 2x2 maze:
  (0,2)--(1,2)--(2,2)
  |        |       |
  (0,1)--(1,1)--(2,1)
  |        |       |
  (0,0)--(1,0)--(2,0)
   */
  /** Correctly includes a new maze origin. */
  setOrigin({x, y}) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      throw Error('x and y should be in [0, width/height + 1) range');
    }
    const existing = this.origins.find((el) => el.x === x && el.y === y);
    if (!existing) {
      this.origins.push(new Coordinate(x, y));
    }
  }

  /*
  Endpoint numeration looks as follows for 2x2 maze:
  (0,2)--(1,2)--(2,2)
  |        |       |
  (0,1)----X----(2,1)
  |        |       |
  (0,0)--(1,0)--(2,0)
   */
  /** Correctly includes a new maze endpoint. */
  setEndpoint({x, y}) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      throw Error('x and y should be in [0, width/height + 1) range');
    }
    const xOuter = x === 0 || x === this.width;
    const yOuter = y === 0 || y === this.height;
    if (!xOuter && !yOuter) {
      throw Error('The argument is not an outer vertex');
    }
    const existing = this.endpoints.find((el) => el.x === x && el.y === y);
    if (!existing) {
      this.endpoints.push(new Coordinate(x, y));
    }
  }
}

module.exports = {Maze, Coordinate};
