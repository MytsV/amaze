const {describe} = require('mocha');
const {Maze, EdgeType} = require('../src/maze');
const Position = require('../src/position');
const {expect} = require('chai');
const {HexagonModifier, SquareModifier} = require('../src/modifier');

describe('Maze', () => {
  const testRange = (fn) => {
    const w = 1;
    const h = 2;

    const maze = new Maze(w, h);
    const errorMsg = 'x and y should be in [0, width|height + 1) range';
    const checkThrow = (pos) => expect(() => fn(maze, pos)).to.throw(errorMsg);
    // Testing the upper limit for x
    checkThrow(new Position(w + 1, h));
    checkThrow(new Position(w * 10, h));
    checkThrow(new Position(-1, h));
    checkThrow(new Position(w, h + 1));
    checkThrow(new Position(w, h * 10));
    checkThrow(new Position(w, -1));
  };

  describe('new Maze(width, height)', () => {
    const errorMsg = 'Cell count can\'t be negative or zero';

    it('Successfully creates a Maze', () => {
      const size = 5;
      const maze = new Maze(size, size);
      expect(maze.width).to.equal(size);
      expect(maze.height).to.equal(size);
    });

    it('Fails if either argument is negative', () => {
      const size = -1;
      const errorMsg = 'Cell count can\'t be negative';
      let fn = () => new Maze(size, size);
      expect(fn).to.throw(errorMsg);
      fn = () => new Maze(-size, size);
      expect(fn).to.throw(errorMsg);
    });

    it('Fails if either argument is zero', () => {
      let fn = () => new Maze(1, 0);
      expect(fn).to.throw(errorMsg);
      fn = () => new Maze(0, 1);
      expect(fn).to.throw(errorMsg);
    });
  });

  describe('addOrigin({x, y})', () => {
    it('Appends origin with the same positions only once', () => {
      const size = 5;
      const pos = new Position(1, 1);
      const maze = new Maze(size, size);
      maze.addOrigin(pos);
      maze.addOrigin(pos);
      maze.addOrigin(pos);
      expect(maze.origins.length).to.equal(1);
    });

    it('Fails if the position is out of bounds', () => {
      testRange((maze, pos) => maze.addOrigin(pos));
    });

    it('Fails if there is an identical endpoint', () => {
      const errorMsg = 'The argument position coincides with an endpoint';
      const size = 1;
      const pos = new Position(size, size);
      const maze = new Maze(size, size);
      maze.addEndpoint(pos);
      expect(() => maze.addOrigin(pos)).to.throw(errorMsg);
      // Should not fail if there is no such endpoint
      const newPos = new Position(0, 0);
      expect(() => maze.addOrigin(newPos)).to.not.throw(errorMsg);
    });
  });

  describe('addEndpoint({x, y})', () => {
    it('Appends endpoint with the same positions only once', () => {
      const size = 5;
      const pos = new Position(size, size);
      const maze = new Maze(size, size);
      maze.addEndpoint(pos);
      maze.addEndpoint(pos);
      maze.addEndpoint(pos);
      expect(maze.endpoints.length).to.equal(1);
    });

    it('Fails if the position is out of bounds', () => {
      testRange((maze, pos) => maze.addEndpoint(pos));
    });

    it('Fails if provided with an inner vertex', () => {
      const errorMsg = 'The argument is not an outer vertex';

      // 2x2 maze has (1,1) as inner vertex
      let maze = new Maze(2, 2);
      const checkThrow = (pos) => {
        expect(() => maze.addEndpoint(pos)).to.throw(errorMsg);
      };
      checkThrow(new Position(1, 1));

      // 3x3 maze has inner vertices (1,1) - (1,2) - (2,1) - (2,2)
      maze = new Maze(3, 3);
      checkThrow(new Position(1, 1));
      checkThrow(new Position(1, 2));
      checkThrow(new Position(2, 1));
      checkThrow(new Position(2, 2));

      // (0, 1) is an outer vertex and should not lead to an Error
      expect(() => maze.addEndpoint(new Position(0, 1))).to.not.throw(Error);
    });

    it('Fails if there is an identical origin', () => {
      const errorMsg = 'The argument position coincides with an origin';
      const size = 1;
      const pos = new Position(size, size);
      const maze = new Maze(size, size);
      maze.addOrigin(pos);
      expect(() => maze.addEndpoint(pos)).to.throw(errorMsg);
      // Should not fail if there is no such origin
      const newPos = new Position(0, 0);
      expect(() => maze.addEndpoint(newPos)).to.not.throw(errorMsg);
    });
  });

  describe('updateEdge({x, y}, type)', () => {
    it('Successfully updates edge type on a correct position', () => {
      const x = 1;
      const y = 1;
      const pos = new Position(x, y);
      const maze = new Maze(x, y);
      // Edge type must be solid by default
      expect(maze.edgeTypes[pos.toKey()]).to.equal(EdgeType.Solid);
      maze.updateEdge(pos, EdgeType.Absent);
      expect(maze.edgeTypes[pos.toKey()]).to.equal(EdgeType.Absent);
    });

    it('Updates type separately for different positions', () => {
      const x = 1;
      const y = 1;
      const posOne = new Position(x, y);
      const posTwo = new Position(0, 0);
      const maze = new Maze(x, y);
      maze.updateEdge(posOne, EdgeType.Absent);
      maze.updateEdge(posTwo, EdgeType.Disrupt);
      expect(maze.edgeTypes[posOne.toKey()]).to.equal(EdgeType.Absent);
      expect(maze.edgeTypes[posTwo.toKey()]).to.equal(EdgeType.Disrupt);
    });

    it('Discards any edge with wrong coordinates', () => {
      const width = 5;
      const height = width * 2;
      const maze = new Maze(width, height);
      const checkThrow = (pos) => {
        expect(() => maze.updateEdge(pos, EdgeType.Absent)).to.throw();
      };
      const checkValid = (pos) => {
        expect(() => maze.updateEdge(pos, EdgeType.Absent)).to.not.throw();
      };

      // Don't accept negative values or y > width * 2
      checkThrow(new Position(-1, height));
      checkThrow(new Position(width, -1));
      checkThrow(new Position(width / 2, height * 3));
      // If an edge is horizontal, then x value should be < width
      const horizontalY = 0;
      checkThrow(new Position(width, horizontalY));
      checkThrow(new Position(width * 2, horizontalY));
      checkValid(new Position(width - 1, horizontalY));
      // If an edge is vertical, then x value should be < width + 1
      const verticalY = 1;
      checkValid(new Position(width, verticalY));
      checkThrow(new Position(width * 2, verticalY));
      checkThrow(new Position(width + 1, verticalY));
    });

    it('Fails if edge type is unknown', () => {
      const size = 1;
      const maze = new Maze(size, size);
      expect(() => maze.updateEdge(new Position(size, size), 'hi')).to.throw();
    });
  });

  describe('updateVertexModifier({x, y}, modifier)', () => {
    it('Successfully updates with vertex modifier', () => {
      const x = 1;
      const y = 1;
      const pos = new Position(x, y);
      const maze = new Maze(x, y);
      const hexagon = new HexagonModifier();
      maze.updateVertexModifier(pos, hexagon);
      expect(maze.vertexModifiers[pos.toKey()]).to.not.be.undefined;
    });
  });

  describe('updateCellModifier({x, y}, modifier)', () => {
    it('Successfully updates with a cell modifier', () => {
      const x = 1;
      const y = 1;
      const pos = new Position(x, y);
      const maze = new Maze(x, y);
      const modifier = new SquareModifier(0);
      maze.updateCellModifier(pos, modifier);
      expect(maze.cellModifiers[pos.toKey()]).to.not.be.undefined;
    });
  });
});
