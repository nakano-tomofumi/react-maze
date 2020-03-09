import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <div className="square" >
      {props.value}
    </div>
  );
}


function Row(props) {
  const row = props.row
  return (
    <div className="board-row">
        {row.map((square) =>
                 <Square value={square} />)}
    </div>    
  );
}


function makeMaze(rows, open) {
  const arrows = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]];
  while(open.length > 0) {
    const i = Math.floor(Math.random() * Math.floor(open.length));
    const [xy, arrow] = open[i];
    const [x, y] = xy;
    const [xa, ya] = arrow;
    const [x2, y2] = [x+xa*2, y+ya*2];
    if (0 < x2 && x2 < rows[0].length && 0 < y2 && y2 < rows.length) {
      if (rows[y2][x2] !== '') {
        const [x1, y1] = [x+xa, y+ya];
        rows[y1][x1] = '';
        rows[y2][x2] = '';      
        arrows.forEach((arrow) => {
          open.push([[x2, y2], arrow]);
        });
      }
    }
    open.splice(i, 1); // delete
  }
}

class Maze extends React.Component {
  constructor(props) {
    super(props);
    const rows = Array(21).fill('X').map(x => Array(31).fill('X'));
    rows[1][1] = '';
    const xy = [1, 1];
    makeMaze(rows, [[xy, [1, 0]],
                    [xy, [0, 1]]]);
    this.state = {
      rows: rows,
    }
  }

  render() {
    const rows = this.state.rows;
    return (
      <div>
          {rows.map((row) =>
                    <Row row={row}/>)}
      </div>
    );
  }
}

ReactDOM.render(<Maze />, document.getElementById("root"));
