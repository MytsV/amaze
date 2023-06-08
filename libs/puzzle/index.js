const {Maze, EdgeType} = require('./src/maze');
const Position = require('./src/position');
const {
  HexagonModifier,
  StarModifier,
  SquareModifier,
} = require('./src/modifier');
const {Path} = require('./src/path');
const {Solution} = require('./src/solution');

module.exports = {
  Maze,
  Position,
  EdgeType,
  HexagonModifier,
  SquareModifier,
  StarModifier,
  Path,
  Solution,
};
