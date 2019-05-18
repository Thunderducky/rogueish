import Shapes from "./Shapes";
const { Point, Grid } = Shapes;
import Queue from './queue';
const DIRECTIONS = {
  UP: Point.make(0, -1),
  DOWN: Point.make(0, 1),
  LEFT: Point.make(-1, 0),
  RIGHT: Point.make(1, 0)
};

// Helper functions
const isPassable = cell => cell && cell.data && !cell.data.wall;
const ensureDigits = (number, digits) => {
  let numStr = number.toString();
  while(numStr.length < digits){
    numStr = "0" + numStr;
  }
  return numStr;

};

// handle bfs, dijkstra, and A-*
export const calculatePathSequence = (map, start, end) => {

  let path = [];
  const makeResponse = valid => {
    return {
      valid,
      start,
      end,
      path
    }
  }
  // We can't make it, so don't even try
  const startCell = map.getP(start);
  const endCell = map.getP(end);

  if(!isPassable(startCell) || !isPassable(endCell)){
    return makeResponse(false);
  }

  const visitGrid = Grid.setEach(Grid.make(map.width, map.height), (x, y, index) => {
    return {
      x,
      y,
      distance: Infinity,
      visited: false,
      passable: isPassable(map.cells[index]),
      previous: null
    }
  })

  const toVisit = Queue.make();
  toVisit.enqueue(visitGrid.getP(start));
  visitGrid.getP(start).distance = 0;

  while(toVisit.length > 0){
    let gridCell = toVisit.dequeue();
    let mapCell = map.getP(gridCell);
    gridCell.visited = true;

    if(gridCell.passable){
      const neighbors = [
        visitGrid.getP(Point.add(gridCell, DIRECTIONS.UP)),
        visitGrid.getP(Point.add(gridCell, DIRECTIONS.LEFT)),
        visitGrid.getP(Point.add(gridCell, DIRECTIONS.RIGHT)),
        visitGrid.getP(Point.add(gridCell, DIRECTIONS.DOWN)),
      ].filter(cell => cell != null);

      neighbors.forEach(n => {
        if(!n.visited && n.passable){
          n.distance = gridCell.distance + 1;
          n.previous = gridCell;
          toVisit.enqueue(n);
        }
      })
    }
  }

  const printCell = (cell) =>
    cell.distance < Infinity
      ? ensuredDigits(cell.distance, 2)
      : '..';

  console.log("\n\n" + Grid.print(visitGrid,printCell, 1, 1));

  // CALCULATE EXACT PATH FROM GRID
  let back = visitGrid.getP(end);
  while(back != null){
    path.push(Point.copy(back));
    back = back.previous;
  }

  if(Point.equal(path[path.length - 1], start){
    path = [];
    return makeResponse(false);
  }

  return makeResponse(true);
}
