import GameState from '../GameState.js'
import { PUBSUB } from '../../Pubsub/pubsub.js'
const makeWorldState = (manager) => {
  const onEnter = (manager) => {
    console.log("WORLD STATE: ENTERED");
  }

  const onExit = (manager) => {
    console.log("WORLD STATE: EXITED")
  }
  return new GameState(manager, onEnter, onExit)
}

export default makeWorldState;
