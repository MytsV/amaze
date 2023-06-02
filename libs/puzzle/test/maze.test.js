const {describe} = require('mocha');
const {Maze, Coordinate} = require('../src/maze');
const {expect} = require('chai');

describe('Maze', () => {
  const testRange = (fn) => {
    const w = 1;
    const h = 2;

    const maze = new Maze(w, h);
    const errorMsg = 'x and y should be in [0, width/height + 1) range';
    // Testing the upper limit for x
    expect(() => fn(maze, new Coordinate(w + 1, h))).to.throw(errorMsg);
    expect(() => fn(maze, new Coordinate(w * 10, h))).to.throw(errorMsg);
    // Testing the lower limit for x
    expect(() => fn(maze, new Coordinate(-1, h))).to.throw(errorMsg);
    // Testing the upper limit for y
    expect(() => fn(maze, new Coordinate(w, h + 1))).to.throw(errorMsg);
    expect(() => fn(maze, new Coordinate(w, h * 10))).to.throw(errorMsg);
    // Testing the lower limit for y
    expect(() => fn(maze, new Coordinate(w, -1))).to.throw(errorMsg);
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
    it('Appends origin with the same coordinates only once', () => {
      const size = 5;
      const coords = new Coordinate(1, 1);
      const maze = new Maze(size, size);
      maze.setOrigin(coords);
      maze.setOrigin(coords);
      maze.setOrigin(coords);
      expect(maze.origins.length).to.equal(1);
    });
    it('Fails if the coordinate is out of bounds', () => {
      testRange((maze, coords) => maze.setOrigin(coords));
    });
    it('Fails if there is an identical endpoint', () => {
      const errorMsg = 'The argument coordinates coincide with an endpoint';
      const size = 1;
      const coords = new Coordinate(size, size);
      const maze = new Maze(size, size);
      maze.setEndpoint(coords);
      expect(() => maze.setOrigin(coords)).to.throw(errorMsg);
      // Should not fail if there is no such endpoint
      const newCoords = new Coordinate(0, 0);
      expect(() => maze.setOrigin(newCoords)).to.not.throw(errorMsg);
    });
  });
  describe('setEndpoint({x, y})', () => {
    it('Appends endpoint with the same coordinates only once', () => {
      const size = 5;
      const coords = new Coordinate(size, size);
      const maze = new Maze(size, size);
      maze.setEndpoint(coords);
      maze.setEndpoint(coords);
      maze.setEndpoint(coords);
      expect(maze.endpoints.length).to.equal(1);
    });
    it('Fails if the coordinate is out of bounds', () => {
      testRange((maze, coords) => maze.setEndpoint(coords));
    });
    it('Fails if provided with an inner vertex', () => {
      const errorMsg = 'The argument is not an outer vertex';
      // 2x2 maze has (1,1) as inner vertex
      let maze = new Maze(2, 2);
      expect(() => maze.setEndpoint(new Coordinate(1, 1))).to.throw(errorMsg);

      // 3x3 maze has inner vertices (1,1) - (1,2) - (2,1) - (2,2)
      maze = new Maze(3, 3);
      expect(() => maze.setEndpoint(new Coordinate(1, 1))).to.throw(errorMsg);
      expect(() => maze.setEndpoint(new Coordinate(1, 2))).to.throw(errorMsg);
      expect(() => maze.setEndpoint(new Coordinate(2, 1))).to.throw(errorMsg);
      expect(() => maze.setEndpoint(new Coordinate(2, 2))).to.throw(errorMsg);

      // (0, 1) is an outer edge and should not lead to an Error
      expect(() => maze.setEndpoint(new Coordinate(0, 1))).to.not.throw(Error);
    });
    it('Fails if there is an identical origin', () => {
      const errorMsg = 'The argument coordinates coincide with an origin';
      const size = 1;
      const coords = new Coordinate(size, size);
      const maze = new Maze(size, size);
      maze.setOrigin(coords);
      expect(() => maze.setEndpoint(coords)).to.throw(errorMsg);
      // Should not fail if there is no such origin
      const newCoords = new Coordinate(0, 0);
      expect(() => maze.setEndpoint(newCoords)).to.not.throw(errorMsg);
    });
  });
});
