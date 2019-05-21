// import GameStateManager from './GameState/GameStateManager';
// import makeInputState from './GameState/makeInputState';
// import makeWorldState from './GameState/makeWorldState';
// const gsm = new GameStateManager();

// Game states mostly enable and disable certain event listeners?
// that seems like it'd get out of control really quick
// okay let's go through making each one of the parts
import {PUBSUB} from './Pubsub/pubsub.js'
import {Point, Grid} from './Shapes';

const player = {
  id: 1,
  character: "@",
  position: Point.make(1,1)
};
const ActorData = {
  actors:[player],
  getActorById: function(id){
    return this.actors.find(actor => actor.id === id);
  } // TODO: Eventually we'll add a reference for this
};
const GeometryData = {};
const FovData = {};
const PathfindingData = {};   // Potential overlap I guess? If we could memoize this that'd be awesome I guess?
const RenderData = {
};
const UIData = {};

const Actions = [];

// Saver and Loader
// All arrow functions, no state for any system

const SETTINGS = {
  GRID_WIDTH: 11,
  GRID_HEIGHT: 5
}
console.log("test");
const linearize = str => str.split('\n').map(s => s.trim()).join('').trim();
window.linearize = linearize;
const levelString = linearize(`
  .....X.....
  ...........
  ...XXXXX...
  .....X.....
  .....X.....
`);

// Let's prototype out a system and then move it into the appropriate data
GeometryData.grid = Grid.make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);
RenderData.grid = Grid.make(SETTINGS.GRID_WIDTH, SETTINGS.GRID_HEIGHT);
Grid.setEach(RenderData.grid, (x,y) => {
  return {
    character: '.'
  }
});

const GeometrySystem = {
  save: () => {},
  load: () => {},
  simpleStringLoader: ({geometry},str) => {
    Grid.setEach(geometry.grid, (x,y, index) => {
      return { x,y, wall: str[index] === "X"}
    });
  },
  generate: () => {}
};

// we might do this with closures
const RenderSystem = {
  render: ({geometryData, actorData, renderData}) => {
    // Little bit extra here, but hey
    const geoGrid = geometryData.grid;
    const rendGrid = renderData.grid;

    // Draw all the geometry stuff
    Grid.forEach(geoGrid, (geoCell, x,y, index) => {
      const renderCell = rendGrid.getIndex(index);
      renderCell.character = geoCell.wall ? 'X' : '.';
    });

    // Override the specific pieces with monsters
    actorData.actors.forEach(actor => {
      // cameras are going to make this troublesome
      const renderCell = rendGrid.getP(actor.position);
      renderCell.character = actor.character;
    });

    // This is an extra debug helpful step, eventually we'll provide more data for the UI system to use
    console.log(Grid.print(renderData.grid, cell => cell.character));
  }
};

const MoveSystem = {
  processAction: ({geometryData, actorData}, moveAction) => {
    console.log("test");
    const mover = actorData.getActorById(moveAction.actorId);
    if(mover){
      Point.copyTo(mover.position, moveAction.destination);
    }
  }
};

const TOPICS = {
  NEW_LEVEL: "NEW_LEVEL",
  RERENDER: "RERENDER",
  MOVE: "MOVE"
}
PUBSUB.subscribe(TOPICS.NEW_LEVEL, ({levelString}) => {
  GeometrySystem.simpleStringLoader({geometry: GeometryData}, levelString)
  PUBSUB.publish(TOPICS.RERENDER, null);
})

PUBSUB.subscribe(TOPICS.RERENDER, () => {
  RenderSystem.render({geometryData: GeometryData, actorData: ActorData, renderData: RenderData});
})

PUBSUB.subscribe(TOPICS.MOVE, move => {
  MoveSystem.processAction({geometryData: GeometryData, actorData: ActorData }, move);
  PUBSUB.publish(TOPICS.RERENDER, null);
})


// We might want to also consider doing a message pump
PUBSUB.publish(TOPICS.NEW_LEVEL, { levelString });
MoveSystem.processAction(
  {geometryData: GeometryData, actorData: ActorData },
  { actorId: 1, destination: Point.make(1,3)}
);
PUBSUB.publish(TOPICS.RERENDER, null);

window.PUBSUB = PUBSUB;

// // import test from './exportExample';
// import '../style/main.scss';
// import Shapes from './Shapes';
// import RenderGrid from './RenderGrid'
// import {calculateFOV} from './fov';
// const {Point, Grid} = Shapes;
// import { calculatePathSequence } from './pathfinding';
// //console.log(test); // eslint-disable-line no-console
// const $ = q => document.querySelector(q);
// const $$ = q => document.querySelectorAll(q);
//
// const white = RenderGrid.makeColor(192, 192, 192);
// const lightgray = RenderGrid.makeColor(128, 128, 128);
// const darkgray = RenderGrid.makeColor(64, 64, 64);
// const black = RenderGrid.makeColor(0, 0, 0);
//
// const blue = RenderGrid.makeColor(0, 0, 255);
//
//
// const GRID_WIDTH = 21;
// const GRID_HEIGHT = 21;
// const randomInt = (maxExclusive) => { return Math.floor(Math.random() * maxExclusive)}
// const player = Point.make(randomInt(GRID_WIDTH), randomInt(GRID_HEIGHT));
// const renderGrid = RenderGrid.make(GRID_WIDTH, GRID_HEIGHT);
//
// const makeMapCell = (x,y) => {
//   return { x,y,
//     data: {
//       wall: false
//     }
//   }
// }
// // let's make a visibility grid
//
//
// const mapGrid = Grid.setEach(Grid.make(GRID_WIDTH, GRID_HEIGHT), (x,y) => makeMapCell(x,y));
// // let's build a grid traverser
// // WORST MAP GENERATION EVER!!!111!!
// // We should do a way of freezing or unfreezing things
// mapGrid.cells.forEach(c => c.data.wall = (Math.random() < 0.3));
// mapGrid.getP(player).data.wall = false;
// const goal = Point.make(randomInt(GRID_WIDTH),randomInt(GRID_HEIGHT));
// console.log(goal);
// mapGrid.getP(goal).data.wall = false;
//
// const playerPath = calculatePathSequence(mapGrid, player, goal);
// console.log(playerPath);
//
// const renderCell = (mapCell, renderCell, fovCell) => {
//   if(mapCell.data.wall){
//     renderCell.cellColor = fovCell.visible ? darkgray : black;
//   } else {
//     renderCell.cellColor = fovCell.visible ? white : lightgray
//   }
//   renderCell.character = ' ';
// }
// // let's hardcode some VALUES
//
// // this will need to eventually take into account a "camera" concept
// const renderMapToGrid = (map, renderGrid) => {
//     // eventually we'll move this out of here
//     const fovGrid = Grid.setEach(Grid.make(GRID_WIDTH, GRID_HEIGHT), (x,y) => {
//       return { visible: true };
//     });
//     calculateFOV(map, fovGrid, player);
//     map.cells.forEach((cell, index) => {
//       renderCell(cell, renderGrid.cells[index], fovGrid.cells[index]);
//     });
// };
// renderGrid.getP(player).character = "@";
//
//
// //console.log(RenderGrid.printStr(renderGrid));
// const container = $("#container")
// container.innerHTML = RenderGrid.renderHTML(renderGrid);
//
// const squareListener = (eventName, fn) => {
//   container.addEventListener(eventName, function(e){
//     // if we are exiting to a child, mark it as so
//     //console.log("container out", e);
//     if(e.target.className === "square"){
//       // retain original function binding I guess
//       return fn.bind(e.target)(e);
//     }
//   });
// }
//
// const renderPathToGrid = (path, renderGrid) => {
//   const RED = {r:255,g: 0,b: 0,a: 255};
//   const DARK_RED = {r:128,g: 0,b: 0,a: 255};
//   renderGrid.getP(path.start).cellColor = RED;
//   const traverser = Point.copy(path.start);
//   path.path.forEach(move => {
//     const cell = renderGrid.getP(move);
//     cell.cellColor = DARK_RED;
//   })
// }
//
// const rerender = () => {
//   renderMapToGrid(mapGrid, renderGrid);
//   renderPathToGrid(playerPath, renderGrid);
//   const playerCell = renderGrid.getP(player);
//   playerCell.character = "@";
//   playerCell.textColor = blue;
//   const goalCell = renderGrid.getP(goal);
//   console.log(goalCell);
//   goalCell.cellColor = {r:0,g:220,b:0, a:255};
//   container.innerHTML = RenderGrid.renderHTML(renderGrid);
// }
//
//
// const getCellFromHTML = (element) => {
//   return mapGrid.getXY(+element.getAttribute('x'),+element.getAttribute('y'))
// }
// // TODO: build this from map cells
//
//
// rerender();
//
// const SQUARE_EXIT_EVENT = "mouseout";
// const SQUARE_ENTER_EVENT = "mouseover";
// const SQUARE_MOVE_EVENT = "mousemove";
// const SQUARE_LEFT_CLICK_EVENT = "click";
// const SQUARE_RIGHT_CLICK_EVENT = "contextmenu";
// squareListener(SQUARE_LEFT_CLICK_EVENT, function(e){
//   const cell = getCellFromHTML(this);
//   console.log(cell);
//   cell.data.wall = false;
//   rerender();
//   return false;
// })
//
// squareListener(SQUARE_RIGHT_CLICK_EVENT, function(e){
//   e.preventDefault();
//   const cell = getCellFromHTML(this);
//   cell.data.wall = true;
//   rerender();
//   return false;
// })
//
// const preventEvents = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
//
// console.log(playerPath);
// window.setTimeout(() => {
//   window.setInterval(() => {
//     if(playerPath.path.length <= 0){
//       window.location.reload();
//     } else {
//       Point.copyTo(player, playerPath.path.pop());
//       rerender();
//     }
//   }, 400)
// }, 2000)
// document.onkeydown = function(e){
//   const key = e.key;
//
//   if(key === "ArrowLeft"){
//     player.x--;
//     if(mapGrid.getP(player).data.wall){
//       player.x++;
//     }
//   }
//   else if(key === "ArrowRight"){
//     player.x++;
//     if(mapGrid.getP(player).data.wall){
//       player.x--;
//     }
//   }
//   else if(key === "ArrowUp"){
//     player.y--;
//     if(mapGrid.getP(player).data.wall){
//       player.y++;
//     }
//   }
//   else if(key === "ArrowDown"){
//     player.y++;
//     if(mapGrid.getP(player).data.wall){
//       player.y--;
//     }
//   }
//   rerender();
//   //console.log(e.key);
//   if(preventEvents.indexOf(key) >= 0){
//     e.preventDefault();
//     return false;
//   }
//   return true;
// }
//
// rerender();
// window.player = player;
// window.rerender = rerender;
