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

  toKey() {
    const {x, y} = this;
    return JSON.stringify({x, y});
  }

  static fromKey(key) {
    const pos = JSON.parse(key);
    return new Position(pos.x, pos.y);
  }
}

module.exports = Position;
