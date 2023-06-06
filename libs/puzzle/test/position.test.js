const {describe} = require('mocha');
const Position = require('../src/position');
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

  describe('toKey()', () => {
    it('Converts position into a correct string', () => {
      const pos = new Position(1, 2);
      expect(pos.toKey()).to.equal('{"x":1,"y":2}');
    });
  });

  describe('fromKey()', () => {
    it('Parses a string value into a correct position', () => {
      const key = '{"x":3,"y":4}';
      const pos = Position.fromKey(key);
      expect(pos.x).to.equal(3);
      expect(pos.y).to.equal(4);
      expect(pos.toKey()).to.equal(key);
    });
  });
});
