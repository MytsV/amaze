const _ = require('lodash');
const Position = require('./position');

const EdgeType = {
  // Edge is Solid by default
  Solid: undefined,
  Disrupt: 'disrupt',
  Absent: 'absent',
};

/*
 ORIGINS
 - "Entrances", vertices which a solution can begin from.
 ENDPOINTS
 - "Exits", vertices which a solution can end on.
 ORIGINS and ENDPOINTS cannot coincide.
 EDGES
 - Straight lines, connecting vertices. Can be either horizontal or vertical
 CELLS
 - Space between edges
 */
/** An abstract class which defines the structure of any maze. */
class Maze {
  #origins = [];
  #endpoints = [];
  #edgeTypes = {};
  #cellModifiers = {};
  #vertexModifiers = {};
  /**
   * Creates a maze with width * height cells.
   * @constructor
   * @param {number} width - cell count per x axis.
   * @param {number} height - cell count per y axis.
   */
  constructor(width, height) {
    Object.assign(this, {width, height});
    this.#verifySize();
  }

  /*
  Origin numeration looks as follows for 2x2 maze:
  (0,2)--(1,2)--(2,2)
  |        |       |
  (0,1)--(1,1)--(2,1)
  |        |       |
  (0,0)--(1,0)--(2,0)
   */
  /**
   * Correctly includes a new maze origin.
   * @param {Position} position
   */
  addOrigin({x, y}) {
    this.verifyVertexPosition({x, y});
    const endpoint = this.#endpoints.find((el) => el.x === x && el.y === y);
    if (endpoint) {
      throw Error('The argument position coincides with an endpoint');
    }
    const existing = this.#origins.find((el) => el.x === x && el.y === y);
    if (!existing) {
      this.#origins.push(new Position(x, y));
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
  /**
   * Correctly includes a new maze endpoint.
   * @param {Position} position
   */
  addEndpoint({x, y}) {
    this.verifyVertexPosition({x, y});
    this.#verifyOuterPosition({x, y});
    const origin = this.#origins.find((el) => el.x === x && el.y === y);
    if (origin) {
      throw Error('The argument position coincides with an origin');
    }
    const existing = this.#endpoints.find((el) => el.x === x && el.y === y);
    if (!existing) {
      this.#endpoints.push(new Position(x, y));
    }
  }

  /*
  Edge numeration looks as follows for 2x2 maze:
  X--(0,4)--X--(1,4)--X
  |         |         |
(0,3)     (1,3)     (2,3)
  |         |         |
  X--(0,2)--X--(1,2)--X
  |         |         |
(0,1)     (1,1)     (2,1)
  |         |         |
  X--(0,0)--X--(1,0)--X
   */
  /**
   * Updates the edge type at position {x, y}
   * @param {Position} position
   * @param {string | undefined} type
   */
  updateEdge({x, y}, type) {
    if (!Object.values(EdgeType).includes(type)) {
      throw Error('Type must belong to EdgeType enumerable');
    }
    this.#verifyEdgePosition({x, y});
    const position = new Position(x, y);
    this.#edgeTypes[position.toKey()] = type;
  }

  /**
   * Updates a vertex modifier at position {x, y}
   * @param {Position} position
   * @param {VertexModifier} modifier
   */
  updateVertexModifier({x, y}, modifier) {
    const position = new Position(x, y);
    this.verifyVertexPosition(position);
    this.#vertexModifiers[position.toKey()] = modifier;
  }

  #verifySize() {
    if (this.width <= 0 || this.height <= 0) {
      throw Error('Cell count can\'t be negative or zero');
    }
  }

  verifyVertexPosition({x, y}) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      throw Error('x and y should be in [0, width|height + 1) range');
    }
  }

  #verifyOuterPosition({x, y}) {
    const xOuter = x === 0 || x === this.width;
    const yOuter = y === 0 || y === this.height;
    if (!xOuter && !yOuter) {
      throw Error('The argument is not an outer vertex');
    }
  }

  #verifyEdgePosition({x, y}) {
    if (x < 0 || y < 0 || y > this.height * 2) {
      throw Error('x and y should be >= 0, y should not exceed height * 2');
    }
    // If edge is horizontal
    if (y % 2 === 0 && x >= this.width) {
      throw Error('x should not be less than the width of maze');
    } else if (y % 2 !== 0 && x > this.width) { // If edge is vertical
      throw Error('x should not exceed width');
    }
  }

  #verifyCellPosition({x, y}) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      throw Error('x and y should be in [0, width|height) range');
    }
  }

  get origins() {
    return _.cloneDeep(this.#origins);
  }

  get endpoints() {
    return _.cloneDeep(this.#endpoints);
  }

  get edgeTypes() {
    return _.cloneDeep(this.#edgeTypes);
  }

  get cellModifiers() {
    return _.cloneDeep(this.#cellModifiers);
  }

  get vertexModifiers() {
    return _.cloneDeep(this.#vertexModifiers);
  }
}

module.exports = {Maze, EdgeType};
