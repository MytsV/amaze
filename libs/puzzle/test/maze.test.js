const {describe} = require('mocha');
const {Maze, Position} = require('../src/maze');
const {expect} = require('chai');

describe('Position', () => {
  describe('new Position(x, y)', () => {
    it('Successfully creates a Position object', () => {
      const [x, y] = [0, 0];
      const pos = new Position(x, y);
      expect(pos.x).to.equal(x);
      expect(pos.y).to.equal(y);
    });
  });
});

describe('Maze', () => {
  const testRange = (fn) => {
    const w = 1;
    const h = 2;

    const maze = new Maze(w, h);
    const errorMsg = 'x and y should be in [0, width/height + 1) range';
    // Testing the upper limit for x
    expect(() => fn(maze, new Position(w + 1, h))).to.throw(errorMsg);
    expect(() => fn(maze, new Position(w * 10, h))).to.throw(errorMsg);
    // Testing the lower limit for x
    expect(() => fn(maze, new Position(-1, h))).to.throw(errorMsg);
    // Testing the upper limit for y
    expect(() => fn(maze, new Position(w, h + 1))).to.throw(errorMsg);
    expect(() => fn(maze, new Position(w, h * 10))).to.throw(errorMsg);
    // Testing the lower limit for y
    expect(() => fn(maze, new Position(w, -1))).to.throw(errorMsg);
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

  describe('setOrigin({x, y})', () => {
    it('Appends origin with the same positions only once', () => {
      const size = 5;
      const pos = new Position(1, 1);
      const maze = new Maze(size, size);
      maze.setOrigin(pos);
      maze.setOrigin(pos);
      maze.setOrigin(pos);
      expect(maze.origins.length).to.equal(1);
    });

    it('Fails if the position is out of bounds', () => {
      testRange((maze, pos) => maze.setOrigin(pos));
    });

    it('Fails if there is an identical endpoint', () => {
      const errorMsg = 'The argument position coincides with an endpoint';
      const size = 1;
      const pos = new Position(size, size);
      const maze = new Maze(size, size);
      maze.setEndpoint(pos);
      expect(() => maze.setOrigin(pos)).to.throw(errorMsg);
      // Should not fail if there is no such endpoint
      const newPos = new Position(0, 0);
      expect(() => maze.setOrigin(newPos)).to.not.throw(errorMsg);
    });
  });

  describe('setEndpoint({x, y})', () => {
    it('Appends endpoint with the same positions only once', () => {
      const size = 5;
      const pos = new Position(size, size);
      const maze = new Maze(size, size);
      maze.setEndpoint(pos);
      maze.setEndpoint(pos);
      maze.setEndpoint(pos);
      expect(maze.endpoints.length).to.equal(1);
    });

    it('Fails if the position is out of bounds', () => {
      testRange((maze, pos) => maze.setEndpoint(pos));
    });

    it('Fails if provided with an inner vertex', () => {
      const errorMsg = 'The argument is not an outer vertex';
      // 2x2 maze has (1,1) as inner vertex
      let maze = new Maze(2, 2);
      expect(() => maze.setEndpoint(new Position(1, 1))).to.throw(errorMsg);

      // 3x3 maze has inner vertices (1,1) - (1,2) - (2,1) - (2,2)
      maze = new Maze(3, 3);
      expect(() => maze.setEndpoint(new Position(1, 1))).to.throw(errorMsg);
      expect(() => maze.setEndpoint(new Position(1, 2))).to.throw(errorMsg);
      expect(() => maze.setEndpoint(new Position(2, 1))).to.throw(errorMsg);
      expect(() => maze.setEndpoint(new Position(2, 2))).to.throw(errorMsg);

      // (0, 1) is an outer edge and should not lead to an Error
      expect(() => maze.setEndpoint(new Position(0, 1))).to.not.throw(Error);
    });

    it('Fails if there is an identical origin', () => {
      const errorMsg = 'The argument position coincides with an origin';
      const size = 1;
      const pos = new Position(size, size);
      const maze = new Maze(size, size);
      maze.setOrigin(pos);
      expect(() => maze.setEndpoint(pos)).to.throw(errorMsg);
      // Should not fail if there is no such origin
      const newPos = new Position(0, 0);
      expect(() => maze.setEndpoint(newPos)).to.not.throw(errorMsg);
    });
  });
});
