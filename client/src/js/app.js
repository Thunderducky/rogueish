// import test from './exportExample';
import '../style/main.scss';
import Shapes from './Shapes';
import RenderGrid from './RenderGrid'
import {calculateFOV} from './fov';
const {Point, Grid} = Shapes;
import { calculatePathSequence } from './pathfinding';
//console.log(test); // eslint-disable-line no-console
const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);

const white = RenderGrid.makeColor(192, 192, 192);
const lightgray = RenderGrid.makeColor(128, 128, 128);
const darkgray = RenderGrid.makeColor(64, 64, 64);
const black = RenderGrid.makeColor(0, 0, 0);

const blue = RenderGrid.makeColor(0, 0, 255);


const GRID_WIDTH = 21;
const GRID_HEIGHT = 21;
const randomInt = (maxExclusive) => { return Math.floor(Math.random() * maxExclusive)}
const player = Point.make(randomInt(GRID_WIDTH), randomInt(GRID_HEIGHT));
const renderGrid = RenderGrid.make(GRID_WIDTH, GRID_HEIGHT);
// right now I don't know what we want to store, let's go ahead and just say
// if a tile is a wall or not
const makeMapCell = (x,y) => {
  return { x,y,
    data: {
      wall: false
    }
  }
}
// let's make a visibility grid


const mapGrid = Grid.setEach(Grid.make(GRID_WIDTH, GRID_HEIGHT), (x,y) => makeMapCell(x,y));
// let's build a grid traverser
// WORST MAP GENERATION EVER!!!111!!
// We should do a way of freezing or unfreezing things
mapGrid.cells.forEach(c => c.data.wall = (Math.random() < 0.3));
mapGrid.getP(player).data.wall = false;
const goal = Point.make(randomInt(GRID_WIDTH),randomInt(GRID_HEIGHT));
console.log(goal);
mapGrid.getP(goal).data.wall = false;

const playerPath = calculatePathSequence(mapGrid, player, goal);
console.log(playerPath);

const renderCell = (mapCell, renderCell, fovCell) => {
  if(mapCell.data.wall){
    renderCell.cellColor = fovCell.visible ? darkgray : black;
  } else {
    renderCell.cellColor = fovCell.visible ? white : lightgray
  }
  renderCell.character = ' ';
}
// let's hardcode some VALUES

// this will need to eventually take into account a "camera" concept
const renderMapToGrid = (map, renderGrid) => {
    // eventually we'll move this out of here
    const fovGrid = Grid.setEach(Grid.make(GRID_WIDTH, GRID_HEIGHT), (x,y) => {
      return { visible: true };
    });
    calculateFOV(map, fovGrid, player);
    map.cells.forEach((cell, index) => {
      renderCell(cell, renderGrid.cells[index], fovGrid.cells[index]);
    });
};
renderGrid.getP(player).character = "@";


//console.log(RenderGrid.printStr(renderGrid));
const container = $("#container")
container.innerHTML = RenderGrid.renderHTML(renderGrid);

const squareListener = (eventName, fn) => {
  container.addEventListener(eventName, function(e){
    // if we are exiting to a child, mark it as so
    //console.log("container out", e);
    if(e.target.className === "square"){
      // retain original function binding I guess
      return fn.bind(e.target)(e);
    }
  });
}

const renderPathToGrid = (path, renderGrid) => {
  const RED = {r:255,g: 0,b: 0,a: 255};
  const DARK_RED = {r:128,g: 0,b: 0,a: 255};
  renderGrid.getP(path.start).cellColor = RED;
  const traverser = Point.copy(path.start);
  path.path.forEach(move => {
    const cell = renderGrid.getP(move);
    cell.cellColor = DARK_RED;
  })
}

const rerender = () => {
  renderMapToGrid(mapGrid, renderGrid);
  renderPathToGrid(playerPath, renderGrid);
  const playerCell = renderGrid.getP(player);
  playerCell.character = "@";
  playerCell.textColor = blue;
  const goalCell = renderGrid.getP(goal);
  console.log(goalCell);
  goalCell.cellColor = {r:0,g:220,b:0, a:255};
  container.innerHTML = RenderGrid.renderHTML(renderGrid);
}


const getCellFromHTML = (element) => {
  return mapGrid.getXY(+element.getAttribute('x'),+element.getAttribute('y'))
}
// TODO: build this from map cells


rerender();

const SQUARE_EXIT_EVENT = "mouseout";
const SQUARE_ENTER_EVENT = "mouseover";
const SQUARE_MOVE_EVENT = "mousemove";
const SQUARE_LEFT_CLICK_EVENT = "click";
const SQUARE_RIGHT_CLICK_EVENT = "contextmenu";
squareListener(SQUARE_LEFT_CLICK_EVENT, function(e){
  const cell = getCellFromHTML(this);
  console.log(cell);
  cell.data.wall = false;
  rerender();
  return false;
})

squareListener(SQUARE_RIGHT_CLICK_EVENT, function(e){
  e.preventDefault();
  const cell = getCellFromHTML(this);
  cell.data.wall = true;
  rerender();
  return false;
})

const preventEvents = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

console.log(playerPath);
window.setTimeout(() => {
  window.setInterval(() => {
    if(playerPath.path.length <= 0){
      window.location.reload();
    } else {
      Point.copyTo(player, playerPath.path.pop());
      rerender();
    }
  }, 400)
}, 2000)
document.onkeydown = function(e){
  const key = e.key;

  if(key === "ArrowLeft"){
    player.x--;
    if(mapGrid.getP(player).data.wall){
      player.x++;
    }
  }
  else if(key === "ArrowRight"){
    player.x++;
    if(mapGrid.getP(player).data.wall){
      player.x--;
    }
  }
  else if(key === "ArrowUp"){
    player.y--;
    if(mapGrid.getP(player).data.wall){
      player.y++;
    }
  }
  else if(key === "ArrowDown"){
    player.y++;
    if(mapGrid.getP(player).data.wall){
      player.y--;
    }
  }
  rerender();
  //console.log(e.key);
  if(preventEvents.indexOf(key) >= 0){
    e.preventDefault();
    return false;
  }
  return true;
}

rerender();
window.player = player;
window.rerender = rerender;
