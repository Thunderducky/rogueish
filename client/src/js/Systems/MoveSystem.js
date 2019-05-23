import {PUBSUB} from '../Pubsub/pubsub.js'
import {Point, Grid} from '../Shapes';

export const MoveSystem = {
  processAction: ({geometryData, actorData}, moveAction) => {
    const mover = actorData.getActorById(moveAction.actorId);
    // currently don't allow movement into walls or out of bounds
    if(mover){
      // Check if we can move there
      if(!Grid.inBoundsXY(geometryData.grid, moveAction.destination.x, moveAction.destination.y)){
        console.log("cannot move out of bounds");
      } else if(geometryData.grid.getP(moveAction.destination).wall === true){
        console.log("cannot move into a wall");
      } else {
        Point.copyTo(mover.position, moveAction.destination);
      }
    }
    // currently allows us to move, no problem, we should prevent this from happening if we can't
  }
};
