
// so let's think about the grid
//  . . . . . . .
//  . . . . . . .
//  . . . . . . .
//  . . . @ . . .
//  . . . . . . .
//  . . . . . . .
//  . . . . . . .


// divide things right into octants
//  9 8 7 6 . . .
//  . 5 4 3 . . .
//  . . 2 1 . . .   NNW
//  . . . @ . . .
//  . . . . . . .
//  . . . . . . .
//  . . . . . . .

/*
* Find a shadow and try to overtake it
*/
import {PUBSUB} from '../Pubsub/pubsub.js'
import {Point, Grid} from '../Shapes';

const isBetweenInclusive = (a,b, t) => {
  if(b < a){
    let temp = b;
    b = a;
    a = temp;
  }
  return t >= a && t <= b;
}

const calculateOctant = (map, fovGrid, target, rowCount, horizontalNotVertical, xDirection, yDirection) => {
  const shadowRanges = [];
  for(let row = 1; row < rowCount; row++){
    const rowSize = row + 1;
    for(let column = 0; column < rowSize; column++){
      const point = {x: target.x, y: target.y}
      point.x += horizontalNotVertical ? xDirection*column : xDirection*row;
      point.y += horizontalNotVertical ? yDirection*row : yDirection*column;

      // bounds check and skip
      if(!isBetweenInclusive(0, map.width -1, point.x)|| !isBetweenInclusive(0, map.height -1, point.y)){
        continue;
      }

      const mapCell = map.getP(point);
      const fovCell = fovGrid.getP(point);

      const start = column/rowSize;
      const end = (column + 1)/rowSize;
      const middle = (start + end)/2;

      // test for visibility
      let visibility = true;
      let startClear = true;
      let middleClear = true;
      let endClear = true;

      if(shadowRanges.length !== 0){
        // check for a shadow to invalidate us
        // TODO, optimize and break off early if we are invalid
        shadowRanges.forEach(sr => {
          startClear = startClear && !isBetweenInclusive(sr.start, sr.end, start);
          middleClear = middleClear && !isBetweenInclusive(sr.start, sr.end, middle);
          endClear = endClear && !isBetweenInclusive(sr.start, sr.end, end);
        })
        if(mapCell.wall){
          visibility =  startClear || endClear;
        } else {
          visibility = middleClear && (startClear || endClear)
        }
      }
      // Mark our ranges invalid if we are a wall
      if(mapCell.wall){
        // try and condense it more in the future
        shadowRanges.push({start, end});
      }
      //console.log("SHADOW RANGES", shadowRanges);
      //console.log(fovCell);
      fovCell.visible = visibility;

      // ancillary extra piece, since we are already visiting this section
      if(fovCell.visible){
        mapCell.explored = true;
      }
    }
  }
}
// TODO, update this, see if we can simplify or make any of this better
export const FovSystem = {
  calculateFov: ({ geometryData, fovData }, origin) => {
    const map = geometryData.grid;
    const fovGrid = fovData.grid;
    const target = origin;
    // NNW
    calculateOctant(map, fovGrid, target, target.y + 1, true, -1, -1);
    // WNW
    calculateOctant(map, fovGrid, target, target.x + 1, false, -1, -1);
    // WSW
    calculateOctant(map, fovGrid, target, target.x + 1, false, -1, 1);
    // SSW
    calculateOctant(map, fovGrid, target, map.height - target.y + 1, true, -1, 1);
    // SSE
    calculateOctant(map, fovGrid, target, map.height - target.y + 1, true, 1, 1);
    // ESE
    calculateOctant(map, fovGrid, target, map.width - target.x + 1, false, 1, 1);
    // ENE
    calculateOctant(map, fovGrid, target, map.width - target.x + 1, false, 1, -1);
    // NNE
    calculateOctant(map, fovGrid, target, target.y + 1, true, 1, -1);
    fovGrid.getP(target).visible = true;
    map.getP(target).explored = true;
  }
};

// Should write a test for this
