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

// we will visit each of these and calculate the angle of the space they take up, the left middle and beginning of each
const isBetweenInclusive = (a,b, t) => {
  if(b < a){
    let temp = b;
    b = a;
    a = temp;
  }
  return t >= a && t <= b;
}
const isBetweenExclusive = (a,b, t) => {
  if(b < a){
    let temp = b;
    b = a;
    a = temp;
  }
  return t > a && t < b;
}

// horizontalNotVertical = inner loop travels horizontal: NNW, NNE, SSW, SSE
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
        if(mapCell.data.wall){
          visibility =  startClear || endClear;
        } else {
          visibility = middleClear && (startClear || endClear)
        }
      }
      // Mark our ranges invalid if we are a wall
      if(mapCell.data.wall){
        // try and condense it more in the future
        shadowRanges.push({start, end});
      }
      //console.log("SHADOW RANGES", shadowRanges);
      //console.log(fovCell);
      fovCell.visible = visibility;
    }
  }
}

export const calculateFOV = (map, fovGrid, target) => {
  // Let's replace  NNW
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
};
