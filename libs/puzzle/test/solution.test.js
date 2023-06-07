const {describe} = require('mocha');
const Position = require('../src/position');
const {expect} = require('chai');
const {Maze, EdgeType} = require('../src/maze');
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
    const checkSolution = (test) => {
      const maze = new Maze(test.width, test.height);
      for (const origin of test.origins ?? []) {
        maze.addOrigin(origin);
      }
      for (const endpoint of test.endpoints ?? []) {
        maze.addEndpoint(endpoint);
      }
      for (const edge of (test.disruptEdges ?? [])) {
        maze.updateEdge(edge, EdgeType.Disrupt);
      }
      for (const vertices of test.validPaths ?? []) {
        const path = new Path();
        path.vertices = vertices;
        const solution = new Solution(maze, path);
        expect(solution.isPathValid()).to.be.true;
      }
      for (const vertices of test.invalidPaths ?? []) {
        const path = new Path();
        path.vertices = vertices;
        const solution = new Solution(maze, path);
        expect(solution.isPathValid()).to.be.false;
      }
    };

    it('Fails with no origins\\endpoints, then passes', () => {
      checkSolution({
        width: 2,
        height: 2,
        origins: [new Position(0, 1)],
        invalidPaths: [
          [
            new Position(0, 1),
            new Position(1, 1),
            new Position(1, 0),
            new Position(2, 0),
          ],
        ],
      });
      checkSolution({
        width: 2,
        height: 2,
        endpoints: [new Position(2, 0)],
        invalidPaths: [
          [
            new Position(0, 1),
            new Position(1, 1),
            new Position(1, 0),
            new Position(2, 0),
          ],
        ],
      });
    });

    it('Fails if path is invalid by itself', () => {
      checkSolution({
        width: 2,
        height: 2,
        origins: [new Position(0, 1)],
        endpoints: [new Position(2, 0)],
        invalidPaths: [
          [
            new Position(0, 1),
            new Position(1, 1),
            new Position(1, 2),
            // Diagonal move
            new Position(2, 1),
            new Position(2, 0),
          ],
        ],
      });
    });

    it('Fails if path contains vertices not present on the maze', () => {
      checkSolution({
        width: 2,
        height: 2,
        origins: [new Position(0, 1)],
        endpoints: [new Position(2, 0)],
        invalidPaths: [
          [
            new Position(-1, -1),
            new Position(-1, 0),
          ],
          [
            new Position(3, 3),
            new Position(3, 4),
          ],
        ],
      });
    });

    it('Fails if path doesn\'t start at an origin', () => {
      checkSolution({
        width: 2,
        height: 2,
        origins: [new Position(0, 1)],
        endpoints: [new Position(2, 0)],
        invalidPaths: [
          [
            new Position(1, 1),
            new Position(2, 1),
            new Position(2, 0),
          ],
        ],
      });
    });

    it('Fails if path doesn\'t end at an endpoint', () => {
      checkSolution({
        width: 2,
        height: 2,
        origins: [new Position(0, 1)],
        endpoints: [new Position(2, 0)],
        invalidPaths: [
          [
            new Position(0, 1),
            new Position(1, 1),
            new Position(2, 1),
          ],
        ],
      });
    });

    it('Works fine for a 2x3 maze with 1 origin and 1 endpoint', () => {
      checkSolution({
        width: 2,
        height: 3,
        origins: [new Position(0, 0)],
        endpoints: [new Position(1, 3)],
        validPaths: [
          [
            new Position(0, 0),
            new Position(1, 0),
            new Position(2, 0),
            new Position(2, 1),
            new Position(1, 1),
            new Position(1, 2),
            new Position(0, 2),
            new Position(0, 3),
            new Position(1, 3),
          ],
          [
            new Position(0, 0),
            new Position(1, 0),
            new Position(1, 1),
            new Position(1, 2),
            new Position(1, 3),
          ],
        ],
        invalidPaths: [
          [
            new Position(1, 0),
            new Position(1, 1),
            new Position(1, 2),
            new Position(1, 3),
          ],
        ],
      });
    });

    it('Works fine for a 3x3 maze with 3 origins and 1 endpoint', () => {
      checkSolution({
        width: 3,
        height: 3,
        origins: [new Position(0, 0), new Position(1, 0), new Position(1, 1)],
        endpoints: [new Position(1, 3)],
        validPaths: [
          [
            new Position(0, 0),
            new Position(1, 0),
            new Position(2, 0),
            new Position(2, 1),
            new Position(1, 1),
            new Position(1, 2),
            new Position(0, 2),
            new Position(0, 3),
            new Position(1, 3),
          ],
          [
            new Position(1, 0),
            new Position(1, 1),
            new Position(1, 2),
            new Position(1, 3),
          ],
          [
            new Position(1, 1),
            new Position(1, 2),
            new Position(0, 2),
            new Position(0, 3),
            new Position(1, 3),
          ],
        ],
      });
    });

    it('Works fine for a 3x3 maze with 2 origins and 3 endpoints', () => {
      checkSolution({
        width: 3,
        height: 3,
        origins: [new Position(1, 1), new Position(2, 0)],
        endpoints: [new Position(1, 3), new Position(0, 3), new Position(0, 1)],
        validPaths: [
          [
            new Position(2, 0),
            new Position(2, 1),
            new Position(1, 1),
            new Position(1, 2),
            new Position(0, 2),
            new Position(0, 3),
            new Position(1, 3),
          ],
          [
            new Position(1, 1),
            new Position(0, 1),
          ],
          [
            new Position(1, 1),
            new Position(1, 2),
            new Position(0, 2),
            new Position(0, 3),
          ],
        ],
      });
    });

    it('Fails if path goes through invalid edges', () => {
      checkSolution({
        width: 3,
        height: 3,
        origins: [new Position(0, 0)],
        endpoints: [new Position(3, 0)],
        disruptEdges: [new Position(1, 2), new Position(3, 1)],
        invalidPaths: [
          [
            new Position(0, 0),
            new Position(0, 1),
            new Position(1, 1),
            new Position(2, 1),
            new Position(2, 0),
            new Position(3, 0),
          ],
          [
            new Position(0, 0),
            new Position(1, 0),
            new Position(2, 0),
            new Position(2, 1),
            new Position(3, 1),
            new Position(3, 0),
          ],
        ],
        validPaths: [
          [
            new Position(0, 0),
            new Position(1, 0),
            new Position(2, 0),
            new Position(3, 0),
          ],
        ],
      });
    });
  });
});
