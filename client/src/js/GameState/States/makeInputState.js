import GameState from '../GameState.js'
import { PUBSUB } from '../../Pubsub/pubsub.js'
const {PUB:publish, SUB:subscribe } = PUBSUB;
const makeInputState = (manager) => {
  const onEnter = (manager) => {
    console.log("INPUT STATE: ENTERED");
  }

  const onExit = (manager) => {
    console.log("INPUT STATE: EXITED")
  }
  return new GameState(manager, onEnter, onExit)
}

export default makeSetupState;
