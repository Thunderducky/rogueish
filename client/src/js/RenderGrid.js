import Shapes from './Shapes';
const {Grid} = Shapes;

const makeColor = (r = 0, g = 0, b = 0, a = 255) => {
  return Object.freeze({ r,g,b,a });
}

const makeCell = (x = 0,y = 0, cellColor, textColor) => {
  return {
    x: x,
    y: y,
    cellColor: cellColor || makeColor(),
    textColor: textColor || makeColor(255,255,255),
    character: ''
  };
}

const printStr = grid => {
  let output = '';
  grid.cells.forEach((cell, index) => {
    if(index % grid.width === 0){
      output += '\n';
    }
    output += cell.character || '.';
    console.log(output);
  })
  return output.trim();
}

const _colorToRgba = color => `rgba(${color.r},${color.g},${color.b},${color.a})`;
const _cellToStyle = cell => {
  return `background: ${_colorToRgba(cell.cellColor)}; ` +
         `color: ${_colorToRgba(cell.textColor)};`
};
const renderHTML = (grid) => {
  return grid.cells.map(c => {
    return `<div class="square" x="${c.x}" y="${c.y}"style="${_cellToStyle(c)}">${c.character}</div>`
  }).join('');
};

const make = (width, height) => {
  return Grid.setEach(Grid.make(width, height), (x,y) => makeCell(x,y));
}

export default {
  make,
  makeCell,
  makeColor,
  printStr,
  renderHTML
}
