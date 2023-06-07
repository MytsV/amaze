/**
 * A modifier, which is defined on a vertex of a maze.
 */
class VertexModifier {
  constructor() {
    if (this.constructor == VertexModifier) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
  }

  check(pos, path) {
    throw Error('Method check(pos, path) must be implemented');
  }
}

/**
 * Checks if path passes through it.
 * @extends {VertexModifier}
 */
class HexagonModifier extends VertexModifier {
  check(pos, path) {
    const passPoint = path.vertices.find((e) => e.equals(pos));
    return passPoint !== undefined;
  }
}

module.exports = {VertexModifier, HexagonModifier};
