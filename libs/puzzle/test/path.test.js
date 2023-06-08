const {describe} = require('mocha');
const {Path} = require('../src/path');
const {expect} = require('chai');
const Position = require('../src/position');


describe('Path', () => {
  describe('isValid()', () => {
    const applyCases = (cases, expected) => {
      for (const testCase of cases) {
        const path = new Path();
        path.vertices = testCase.map((e) => new Position(e.x, e.y));
        expect(path.isValid()).to.equal(expected);
      }
    };

    it('Correctly identifies invalid paths', () => {
      applyCases([
        // Empty
        [],
        // Only one vertex
        [{x: 0, y: 0}],
        // Repeated vertex
        [{x: 0, y: 0}, {x: 0, y: 0}],
        // Diagonal move
        [{x: 0, y: 0}, {x: 1, y: 1}],
        // Diagonal move in the middle of the list
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 2}],
        // Distance between neighbouring vertices is > 1
        [{x: -1, y: -1}, {x: 3, y: -1}],
        // Wrong distance in the middle of the list
        [{x: -1, y: -1}, {x: 0, y: -1}, {x: 0, y: 1}, {x: 1, y: 1}],
        // Repeated vertex in the middle of the list
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 0}],
        // Repeated vertex in the end of the list
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}],
        // Repeated vertex - both in the middle
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}],
      ], false);
    });

    it('Doesn\'t fail valid paths', () => {
      applyCases([
        // Short path - horizontal
        [{x: 0, y: 0}, {x: 1, y: 0}],
        // Short path - vertical
        [{x: 0, y: 0}, {x: 0, y: 1}],
        // Almost cycled != cycled, no check for ending on outer edges
        [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1},
          {x: 2, y: 2}, {x: 1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}, {x: 1, y: 1}],
        // No check for position validity
        [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1},
          {x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}],
      ], true);
    });
  });
});
