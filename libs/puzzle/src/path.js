/**
 * Contains an ordered array of vertex positions a solution passes through.
 */
class Path {
  constructor() {
    this.vertices = [];
  }

  /*
  There are two requirements for a solution to be valid:
  - vertices never repeat
  - each next vertex is reachable from the last one, distance === 1
   */
  /**
   * Checks whether such path can exist by itself
   * @return {boolean}
   */
  isValid() {
    if (this.vertices.length <= 1) return false;
    const used = {};
    let last = this.vertices[0];
    used[last.toKey()] = true;

    for (let i = 1; i < this.vertices.length; i++) {
      const vertex = this.vertices[i];
      if (used[vertex.toKey()]) return false;
      used[vertex.toKey()] = true;
      const xValid = Math.abs(vertex.x - last.x) === 1;
      const yValid = Math.abs(vertex.y - last.y) === 1;
      // Just a XOR of two booleans :)
      if (xValid === yValid) return false;
      last = vertex;
    }

    return true;
  }
}

module.exports = {Path};
