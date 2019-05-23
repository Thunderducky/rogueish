import {PUBSUB} from './Pubsub/pubsub.js'
import {Point, Grid} from './Shapes'
import { TOPICS } from './Pubsub/topics.js'
import { RenderSystem } from './Systems/RenderSystem.js'
import { MoveSystem } from './Systems/MoveSystem.js'
import Colors from './colors.js'

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
const RenderData = {};
const UIData = {};

const Actions = [];

// Saver and Loader
// All arrow functions, no state for any system

const SETTINGS = {
  GRID_WIDTH: 11,
  GRID_HEIGHT: 5
}

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
    x,y,
    character: '.',
    textColor: Colors.makeColorFromHexStr("#eee"),
    cellColor: Colors.makeColorFromHexStr("#4A6776")
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

// ACTIONS with there own ids and types would probably be useful
const FovSystem = {};

// This is for HTML and displaying

const UISystem = {
  displayRenderGrid: ({renderData}) => {
    const makeCell = cell => {
      return (cell.x === 0 && cell.y !== 0 ? "<br>" : "")
       + `<div x="${cell.x}" y="${cell.y}" class="cell" style="color:${Colors.toHexStr(cell.textColor)}; background:${Colors.toHexStr(cell.cellColor)}">${cell.character}</div>`
    }
    // Let's go ahead and put it on the screen
    document.getElementById("display").innerHTML = renderData.grid.cells.map(makeCell).join('');
    console.log(Grid.print(renderData.grid, cell => cell.character));
  }
}


PUBSUB.subscribe(TOPICS.NEW_LEVEL, ({levelString}) => {
  GeometrySystem.simpleStringLoader({geometry: GeometryData}, levelString)
  PUBSUB.publish(TOPICS.RERENDER, null);
})

PUBSUB.subscribe(TOPICS.RERENDER, () => {
  RenderSystem.render({geometryData: GeometryData, actorData: ActorData, renderData: RenderData});
  UISystem.displayRenderGrid({renderData: RenderData})
})

PUBSUB.subscribe(TOPICS.MOVE, move => {
  MoveSystem.processAction({geometryData: GeometryData, actorData: ActorData }, move);
  PUBSUB.publish(TOPICS.RERENDER, null);
})


// This would all be part of our UI app
PUBSUB.publish(TOPICS.NEW_LEVEL, { levelString });

const tryMoveDirection = (mover, direction) => {
  PUBSUB.publish(TOPICS.MOVE, {actorId: mover.id, destination: Point.add(mover.position, direction)})
}
const DIRECTIONS = {
  UP: Point.make(0, -1),
  DOWN: Point.make(0, 1),
  LEFT: Point.make(-1, 0),
  RIGHT: Point.make(1, 0)
}
document.addEventListener("keyup", event => {
  let defaultHappen = false;
  switch(event.key){
    case "ArrowDown":
      tryMoveDirection(player, DIRECTIONS.DOWN);
      break;
    case "ArrowUp":
      tryMoveDirection(player, DIRECTIONS.UP);
        break;
    case "ArrowLeft":
      tryMoveDirection(player, DIRECTIONS.LEFT);
      break;
    case "ArrowRight":
      tryMoveDirection(player, DIRECTIONS.RIGHT);
        break;
    default:
      defaultHappen = true;
      break;
  }
  if(!defaultHappen){
    event.preventDefault();
  }
})
window.PUBSUB = PUBSUB;
