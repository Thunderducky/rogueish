import './GameState';
// This is largely used internally just to help with setup and staging, allowing stuff to be asynchronous and go on to the next stage when completed
// It shouldn't affect the chain of events very much, but perhaps we shoehorn it into an event?
// eh that seems like a bit much
class GameStateManager {
  constructor(){
    this.current = new GameState(this);
  }
  // should be using closures if necessary
  makeState({onEnter = NOOP, onExit = NOOP}){
    if(onEnter === NOOP && onExit === NOOP){
      console.log("Warning, no enter or exit function provided to GameState")
    }
    return new GameState(this, onEnter, onExit)
  }

  change(nextGameState){
    this.current.exit();
    this.current = nextGameState;
    this.current.enter();
  }
}

export default GameStateManager;
