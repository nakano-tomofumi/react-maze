import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  if (props.value === "X") {
    return (
      <td className="square wall">
          {props.value}
      </td>
    )
  } else if (props.value === ".") {
    return (
      <td className="square trace">
          {props.value}
      </td>
    )
  }
  return (
    <td className="square"
        onMouseOver={props.onMouseOver}>
        {props.value}
    </td>
  );
}


function Row(props) {
  const row = props.row
  return (
    <tr>
        {row.map((square, x) =>
                 <Square key={x}
                         value={square}
                         onMouseOver={() => props.onMouseOver(x)}/>)}
    </tr>
  );
}


function makeMaze(rows, open) {
  var arrows = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]];
  while(open.length > 0) {
    var i = open.length-1;
    if (Math.random() < 0.2) {
      i = Math.floor(Math.random() * Math.floor(open.length));
    }
    const [xy, arrow] = open[i];
    const [x, y] = xy;
    const [xa, ya] = arrow;
    const [x2, y2] = [x+xa*2, y+ya*2];
    if (0 < x2 && x2 < rows[0].length && 0 < y2 && y2 < rows.length) {
      if (rows[y2][x2] !== '') {
        const [x1, y1] = [x+xa, y+ya];
        rows[y1][x1] = '';
        rows[y2][x2] = '';
        arrows.sort(function() { return Math.random() - Math.random(); });
        arrows.forEach((arrow) => {
          open.push([[x2, y2], arrow]);
        });
      }
    }
    open.splice(i, 1);
  }
}


class Maze extends React.Component {
  constructor(props) {
    super(props);
    const [w, h] = [this.props.w, this.props.h].map(s => parseInt(s));
    const rows = Array(h*2+1).fill('X').map(x => Array(w*2+1).fill('X'));
    rows[1][1] = '';
    const xy = [1, 1];
    makeMaze(rows, [[xy, [1, 0]],
                    [xy, [0, 1]]]);
    rows[1][1] = '.';
    this.state = {
      rows: rows,
    }
  }

  handleMouseOver(x, y) {
    const rows = this.state.rows.slice();
    const arrows = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]];
    arrows.map(a => {
      var [x1, y1] = [x, y];
      while(rows[y1][x1] === '') {
        [x1, y1] = [x1+a[1], y1+a[0]];
      }
      if (rows[y1][x1] === '.') {
        [x1, y1] = [x, y];
        while(rows[y1][x1] === '') {
          rows[y1][x1] = '.';
          [x1, y1] = [x1+a[1], y1+a[0]];
        }
        this.setState({
          rows: rows,
        });
      }
    });
  }

  render() {
    const rows = this.state.rows;
    const [width, height] = [this.props.w, this.props.h].map(
      s => String((parseInt(s)*2+1)*15)+"px");
    return (
      <table
          className="maze"
          width={width}
          height={height}>
          <tbody>
              {rows.map((row, y) =>
                        <Row key={y}
                             row={row}
                             onMouseOver={(x) => this.handleMouseOver(x, y)}
                        />)}
          </tbody>
      </table>
    );
  }
}

ReactDOM.render(
  <Maze
      w="21"
      h="21"
  />, document.getElementById("root"));
