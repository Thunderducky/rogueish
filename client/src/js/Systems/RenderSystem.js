import {PUBSUB} from '../Pubsub/pubsub.js'
import {Point, Grid} from '../Shapes';

export const RenderSystem = {
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
  }
};
