// grids have no inherent positioning, they
// are just a way to make 2d collections
// doesn't support resizing by default
const _isBetween = (a,b,value) => {
  // handle it no matter the direction
  if(b < a){
    return isBetween(b,a, value);
  }
  return a <= value && value <= b;
}

// by default we fill this up with empty objects
const make = (width,height) => {
  const grid =  {
    width,
    height,
    cells: [],
    // this is not a safe function, is assumes you
    // know what you are doing
    getXY: function(x,y){
      if(inBoundsXY(this, x,y)){
        return this.cells[y * this.width + x];
      } else {
        return null;
      }
    },
    // convenience function
    getP: function(p){
      return this.getXY(p.x, p.y);
    },
    getIndex: function(i){
      return this.cells[i];
    }
    // we don't offer a setXY on purpose, you
    // should be manipulating an individual cell
    // this is not a "sparse grid"
  }
  grid.cells.length = width * height;
  return grid;
};

const SET_EACH_ERROR =
`
setEach require a function as the second argument
the callback looks like function(x,y,i){}
where x is the column, y is the row, and i is the index
`.trim();

// TODO, extend xy to map and forEach
const setEach = (grid, fn) => {
  // a little bit of defensive programming
  if(typeof fn != "function"){
    throw new Error(SET_EACH_ERROR)
  }
  let x = 0;
  let y = 0;
  for(let i = 0; i < grid.cells.length; i++){
    x = i % grid.width;
    y = (i - x)/grid.width;
    grid.cells[i] = fn(x,y,i);
  }
  return grid;
}

const forEach = (grid, fn) => {
  for(let i = 0; i < grid.cells.length; i++){
    const x = i % grid.width;
    const y = (i - x)/grid.width;
    fn(grid.cells[i], x, y, i);
  }
}

const inBoundsXY = (grid, x, y) => {
  return _isBetween(0, grid.width - 1, x) &&
         _isBetween(0, grid.height - 1, y)
}
// axis aligned neighbors only, doesn't include diagonals
const getAxisAlignedNeighborsXY = (grid, x, y) => {
  if(!inBoundsXY(grid, x,y)){
    return []; // return an empty array if no neighbors
  } else {
    const neighbors = [
      grid.getXY(x - 1, y), // LEFT
      grid.getXY(x, y - 1), // TOP
      grid.getXY(x + 1, y), // RIGHT
      grid.getXY(x, y + 1)  // BOTTOM
    ];
    // FILTER OUT ANY THAT DON'T EXIST
    return neighbors.filter(n => n != undefined)
  }
}
const makeAxisAlignedGridTraverser = grid => {
  return {
    x: 0,
    y: 0,
    getCell: function(){
      return grid.getXY(x,y);
    },
    getNeighbors: function(){
      return getAxisAlignedNeighborsXY(this.x, this.y);
    },
    inBoundsXY: function(x,y){
      return Grid.inBoundsXY(grid, x,y);
    },
    getRelative: function(x,y){
      return grid.getXY(this.x + x, this.y + y);
    },
    move: function(x,y){
      this.x = x;
      this.y = y;
    },
    moveRelative: function(x,y){
      this.x += x;
      this.y += y;
    }
  }
}

const print = (grid, transformFn, spacing = 1, verticalSpacing = 0) => {
  let total = "";
  let hzSpacing = "";
  let vtSpacing = "";
  for(let i = 0; i < spacing; i++){
    hzSpacing += " ";
  }
  for(let i = 0; i < verticalSpacing; i++){
    vtSpacing += "\n";
  }
  grid.cells.forEach((cell, index) => {
    if(index % grid.width === 0 && index != 0){
      total = total.trim();
      total += "\n" + vtSpacing;
    }
    total += transformFn(cell, index) + hzSpacing;
  })
  return total;
};

export default {
  make,
  print,
  inBoundsXY,
  forEach,
  setEach,
  getAxisAlignedNeighborsXY,
  makeAxisAlignedGridTraverser
}
