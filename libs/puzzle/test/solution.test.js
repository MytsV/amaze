const {describe} = require('mocha');
const Position = require('../src/position');
const {expect} = require('chai');
const {getEdgePosition} = require('../src/solution');

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
