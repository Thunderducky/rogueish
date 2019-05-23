const makeColor = (r = 0, g = 0, b = 0, a = 255) => {
  return Object.freeze({ r,g,b,a });
}
const makeColorFromHexStr = str => {
  // pull off the # if we need it
  if(str[0] === "#"){
    str = str.substr(1);
  }
  if(str.length === 3 || str.length === 4){
    const r = parseInt(str[0],16)*16;
    const g = parseInt(str[1],16)*16;
    const b = parseInt(str[2],16)*16;
    if(str.length === 3){
      return makeColor(r,g,b)
    } else {
      const a = parseInt(str[3],16)*16;
      return makeColor(r,g,b,a)
    }
  }
  if(str.length === 6 || str.length === 8){
    const r = parseInt(str.substr(0,2),16);
    const g = parseInt(str.substr(2,4),16);
    const b = parseInt(str.substr(4,6),16);

    if(str.length === 6){
      return makeColor(r,g,b)
    } else {
      const a = parseInt(str.substr(6,8),16);
      return makeColor(r,g,b,a)
    }
  } else {
    throw new Error("Invalid color reference");
  }

};
const toHexStr = (color) => {
  return `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`;
};
// eventually we will probably shift the internal representation, but now for right now
export default {
  BLACK: makeColor(0,0,0),
  WHITE: makeColor(255,255,255),
  makeColor,
  makeColorFromHexStr,
  toHexStr
}

// eventually we should write some tests around this

// #75653B
// #233344
// #131C21
// #ABB4B7
// #4A6776
// #849BA7
// #FFFFFF
