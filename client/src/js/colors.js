const makeColor = (r = 0, g = 0, b = 0, a = 255) => {
  return Object.freeze({ r,g,b,a });
}
export default {
  BLACK: makeColor(0,0,0),
  WHITE: makeColor(255,255,255),
  makeColor
}
