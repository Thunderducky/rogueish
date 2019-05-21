// INTERNAL USE ONLY
class GameState {
  constructor(manager, onEnter, onExit){
    this.manager = manager;
    this.onEnter = onEnter;
    this.onExit = onExit;
  }
  enter(){
    this.onEnter && this.onEnter(this.manager);
  }
  exit(){
    this.onExit && this.onExit(this.manager);
  }
}
export default GameState
