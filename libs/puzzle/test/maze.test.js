const {describe} = require('mocha');
const {Maze, Coordinate} = require('../src/maze');
const {expect} = require('chai');

describe('Maze', () => {
  describe('new Maze(width, height)', () => {
    it('Successfully creates a Maze', () => {
      const size = 5;
      const maze = new Maze(size, size);
      expect(maze.width).to.equal(size);
      expect(maze.height).to.equal(size);
    });
    it('Fails if arguments are negative', () => {
      const size = -1;
      const errorMsg = 'Cell count can\'t be negative';
      let fn = () => new Maze(size, size);
      expect(fn).to.throw(errorMsg);
      fn = () => new Maze(-size, size);
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
    it('Fails if arguments are out of bounds', () => {
      const size = 1;
      const errorMsg = 'x and y should be in [0, width/height + 1) range';

      const maze = new Maze(size, size);
      // Testing upper limit
      const upperCoords = new Coordinate(size + 1, size);
      expect(() => maze.setOrigin(upperCoords)).to.throw(errorMsg);
      // Testing lower limit
      const lowerCoords = new Coordinate(size, -1);
      expect(() => maze.setOrigin(lowerCoords)).to.throw(errorMsg);
    });
  });
});
