const make = (x,y) => {
  return {x,y};
};
const set = (p, x,y) => {
  p.x = x;
  p.y = y;
  return p;
}
const offset = (p, x,y) => {
  p.x += x;
  p.y += y;
  return p;
}
const copy = p => {
  return make(p.x, p.y);
}
const copyTo = (p, p2) => {
  p.x = p2.x;
  p.y = p2.y;
  return p;
}

const add = (a,b) => {
  return make(a.x + b.x, a.y + b.y);
}

const addTo = (a,b) => {
  a.x += b.x;
  a.y += b.y;
  return a;
}

const scale = (p, size) => {
  return make(p.x * size, p.y * size);
}
const scaleTo = (p, size) => {
  p.x *= size;
  p.y *= size;
  return p;
}

const equal = (p1, p2) => {
  return p1.x === p2.x && p1.y === p2.y;
}

const ZERO = Object.freeze(make(0,0));
// TODO: add frozen directions
export default {
  make,
  set,
  offset,
  copy,
  copyTo,
  add,
  addTo,
  scale,
  scaleTo,
  equal
}
