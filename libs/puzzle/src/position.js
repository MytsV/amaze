/** A wrapper for any position on a Maze. */
class Position {
  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    Object.assign(this, {x, y});
  }
}

module.exports = Position;
