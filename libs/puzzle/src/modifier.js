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

class CellModifier {
  constructor(priority) {
    if (this.constructor == CellModifier) {
      throw new Error('Abstract classes can\'t be instantiated.');
    }
    this.priority = priority;
  }

  check(section, path) {
    throw Error('Method check({path, section}, result) must be implemented');
  }
}

/**
 * Checks if there are no different color Modifiers in the section.
 * @extends {VertexModifier}
 */
class SquareModifier extends CellModifier {
  static #priority = 1;

  /**
   * @param {number} color - any number
   */
  constructor(color) {
    super(SquareModifier.#priority);
    this.color = color;
  }

  check(section, path) {
    const keys = [];
    let valid = true;
    for (const [pos, element] of Object.entries(section)) {
      if (element === null) continue;
      const modifier = element.modifier;
      if (modifier.color !== undefined) {
        keys.push(pos);
        if (modifier.color !== this.color) {
          valid = false;
        }
      }
    }
    for (const key of keys) {
      section[key].valid = valid;
    }
  }
}

module.exports = {
  VertexModifier,
  HexagonModifier,
  CellModifier,
  SquareModifier,
};
