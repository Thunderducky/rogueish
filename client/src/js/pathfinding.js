import Shapes from "./Shapes";
const { Point, Grid } = Shapes;

const DIRECTIONS = {
  UP: Point.make(0, -1),
  DOWN: Point.make(0, 1),
  LEFT: Point.make(-1, 0),
  RIGHT: Point.make(1, 0)
};
const makeQueue = () => {
  const makeLink = (data) => {
    return {
      data,
      next: null
    }
  }
  return {
    root:null,
    tail:null,
    length: 0,
    enqueue: function(data){
      if(!this.root){
        this.root = makeLink(data);
        this.tail = this.root;
      } else {
        const newLink = makeLink(data)
        this.tail.next = newLink;
        this.tail = newLink;
      }
      this.length++;
    },
    dequeue: function(){
      if(!this.root){
        return null;
      } else {
        this.length--;
        const toReturn = this.root.data;
        this.root = this.root.next;
        return toReturn;
      }
    }
  }

};

// handle bfs, dijkstra, and A-*

export const calculatePathSequence = (map, start, end) => {

  let path = [];
  const isPassable = cell => cell && cell.data && !cell.data.wall;

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

  // startCells
  // endCell
  const toVisit = makeQueue();
  toVisit.enqueue(visitGrid.getP(start));
  visitGrid.getP(start).distance = 0;
  while(toVisit.length > 0){
    let gridCell = toVisit.dequeue();
    let mapCell = map.getP(gridCell);
    gridCell.visited = true;
    // visit each one of our neighbors
    //console.log(gridCell);
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

  const ensureDigits = (number, digits) => {
    let numStr = number.toString();
    while(numStr.length < digits){
      numStr = "0" + numStr;
    }
    return numStr;

  };

  console.log("\n\n" + Grid.print(visitGrid, (cell) => {
      console.log(cell);
      if(cell.distance < Infinity){
        return ensureDigits(cell.distance, 2);
      }
      return '..';
  },1, 1));

  // now let's walk backwards and find how to get there
  let back = visitGrid.getP(end);
  console.log(back);
  while(back != null){
    path.push(Point.copy(back));
    back = back.previous;
  }
  //path = path.reverse();
  console.log(path);
  if(path[path.length - 1].x !== start.x && path[path.length - 1].y !== start.y){
    path = [];
    return makeResponse(false);
  }

  return makeResponse(true);

  // in here we will determine if something is passable on the map

  // we are going to make our own grid to work with and use a traverser for now
}
