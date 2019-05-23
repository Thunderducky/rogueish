import {PUBSUB} from '../Pubsub/pubsub.js'
import {Point, Grid} from '../Shapes';
import Colors from '../colors';

const makeColorSet = (cellHex, textHex, darkenAmount) => {
  const cell = Colors.makeColorFromHexStr(cellHex);
  const text = Colors.makeColorFromHexStr(textHex);
  return {
    CELL_DEFAULT: cell,
    TEXT_DEFAULT: text,
    CELL_DARK: Colors.darken(cell, darkenAmount),
    TEXT_DARK: Colors.darken(text, darkenAmount),
  }
}
const COLORS = {
  WALL: makeColorSet("#888", "#222", 20),
  FLOOR: makeColorSet("#4A6776", "#eee", 20),
  UNKNOWN: makeColorSet("#333", "#222", 0)
}

// NEED TO DARKEN OR LIGHTEN THE COLOR

export const RenderSystem = {
  render: ({geometryData, actorData, renderData, fovData}) => {
    // Little bit extra here, but hey
    const geoGrid = geometryData.grid;
    const rendGrid = renderData.grid;
    const fovGrid = fovData.grid;

    // Draw all the geometry stuff
    Grid.forEach(geoGrid, (geoCell, x,y, index) => {
      const renderCell = rendGrid.getIndex(index);
      const fovCell = fovGrid.getIndex(index);
      if(geoCell.explored){
        renderCell.character = geoCell.wall ? 'X' : '.';
        const colorSet = geoCell.wall ? COLORS.WALL : COLORS.FLOOR;
        if(fovCell.visible){
          renderCell.textColor = colorSet.TEXT_DEFAULT;
          renderCell.cellColor = colorSet.CELL_DEFAULT;
        } else {
          renderCell.character = geoCell.wall ? 'X' : '.';
          renderCell.textColor = colorSet.TEXT_DARK;
          renderCell.cellColor = colorSet.CELL_DARK;
        }
      } else {
        renderCell.character = '?';
        renderCell.textColor = COLORS.UNKNOWN.TEXT_DEFAULT
        renderCell.cellColor = COLORS.UNKNOWN.CELL_DEFAULT
      }
    });

    // Override the specific pieces with monsters
    actorData.actors.forEach(actor => {
      // cameras are going to make this troublesome
      const renderCell = rendGrid.getP(actor.position);
      renderCell.character = actor.character;
    });

    // This is an extra debug helpful step, eventually we'll provide more data for the UI system to use
  }
};
