/** A wrapper for positions on Maze. **/
class Coordinate {
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

/** An abstract class which defines structure of any maze. **/
class Maze {
  /**
   * Creates a maze with width * height cells.
   * @param {number} width - cell count per x axis.
   * @param {number} height - cell count per y axis.
   */
  constructor(width, height) {
    if (width < 0 || height < 0) {
      throw Error('Cell count can\'t be negative');
    }
    Object.assign(this, {width, height});
    this.origins = [];
    this.endpoints = [];
    this.edgeTypes = {};
    this.modifiers = {};
  }

  setOrigin({x, y}) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      throw Error('x and y should be in [0, width/height + 1) range');
    }
    const existing = this.origins.find((el) => el.x === x && el.y === y);
    if (!existing) {
      this.origins.push(new Coordinate(x, y));
    }
  }
}

module.exports = {Maze, Coordinate};
