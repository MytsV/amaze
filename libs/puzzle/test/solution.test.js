const {describe} = require('mocha');
const Position = require('../src/position');
const {expect} = require('chai');
const {Maze} = require('../src/maze');
const {Path} = require('../src/path');
const {getEdgePosition, Solution} = require('../src/solution');

describe('getEdgePosition(a, b)', () => {
  it('Fails for equal vertices, or if distance > 1', () => {
    const pos = new Position(0, 0);
    expect(() => getEdgePosition(pos, pos)).to.throw();
    const farVertexX = new Position(5, 0);
    expect(() => getEdgePosition(farVertexX, pos)).to.throw();
    const farVertexY = new Position(0, 5);
    expect(() => getEdgePosition(farVertexY, pos)).to.throw();
  });
  it('Correctly calculates edge position', () => {
    const cases = [
      {
        a: new Position(0, 0),
        b: new Position(1, 0),
        res: new Position(0, 0),
      },
      {
        a: new Position(0, 0),
        b: new Position(0, 1),
        res: new Position(0, 1),
      },
      {
        a: new Position(1, 1),
        b: new Position(1, 2),
        res: new Position(1, 3),
      },
      {
        a: new Position(2, 3),
        b: new Position(3, 3),
        res: new Position(2, 6),
      },
    ];
    for (const test of cases) {
      expect(getEdgePosition(test.a, test.b)).to.deep.equal(test.res);
    }
  });
});

describe('Solution', () => {
  // Here, basically, we test solution algorithm for a maze with no modifiers
  describe('isPathValid()', () => {
    it('Fails with no origins\\endpoints, then passes', () => {
      const size = 2;
      const maze = new Maze(size, size);

      const path = new Path();
      path.vertices = [
        new Position(0, 1),
        new Position(1, 1),
        new Position(1, 0),
        new Position(2, 0),
      ];

      const solution = new Solution(maze, path);
      expect(solution.isPathValid()).to.be.false;
      maze.addOrigin(new Position(0, 1));
      expect(solution.isPathValid()).to.be.false;

      maze.addEndpoint(new Position(2, 0));
      expect(solution.isPathValid()).to.be.true;
    });

    it('Fails if path is invalid by itself', () => {
      const size = 2;
      const maze = new Maze(size, size);
      maze.addOrigin(new Position(0, 1));
      maze.addEndpoint(new Position(2, 0));

      const path = new Path();
      path.vertices = [
        new Position(0, 1),
        new Position(1, 1),
        new Position(1, 2),
        // Diagonal move
        new Position(2, 1),
        new Position(2, 0),
      ];

      const solution = new Solution(maze, path);
      expect(solution.isPathValid()).to.be.false;
    });

    it('Fails if path contains vertices not present on the maze', () => {
      const size = 2;
      const maze = new Maze(size, size);
      maze.addOrigin(new Position(0, 1));
      maze.addEndpoint(new Position(2, 0));

      const pathNegative = new Path();
      pathNegative.vertices = [
        new Position(-1, -1),
        new Position(-1, 0),
      ];

      const solutionNegative = new Solution(maze, pathNegative);
      expect(solutionNegative.isPathValid()).to.be.false;

      const pathExceed = new Path();
      pathExceed.vertices = [
        new Position(3, 3),
        new Position(3, 4),
      ];

      const solutionExceed = new Solution(maze, pathExceed);
      expect(solutionExceed.isPathValid()).to.be.false;
    });

    it('Fails if path doesn\'t start at an origin', () => {

    });

    it('Fails if path doesn\'t end at an endpoint', () => {

    });

    it('Works fine for a 3x3 maze with 1 origin and 1 endpoint', () => {

    });

    it('Works fine for a 3x3 maze with 3 origins and 1 endpoint', () => {

    });

    it('Works fine for a 3x3 maze with 1 origin and 3 endpoints', () => {

    });

    it('Works fine for a 3x3 maze with 3 origins and 3 endpoints', () => {

    });

    it('Fails if path goes through invalid edges', () => {

    });

    it('Works fine for a 3x3 maze with disrupt edges', () => {

    });

    it('Works fine for a 5x5 maze with disrupt edges', () => {

    });

    it('Works fine for a 5x5 maze: bad edges, >1 origins and endpoints', () => {

    });
  });
});
