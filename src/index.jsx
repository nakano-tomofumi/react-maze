import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createInitialMazeState, isMazeCompleted } from './maze.mjs';

const CELL_SIZE = 7.5;
const DEFAULT_WIDTH = 84;
const DEFAULT_HEIGHT = 42;
const MAX_SIZE = 200;


function getMazeSize() {
  const params = new URLSearchParams(window.location.search);
  const parseSize = (name, fallback) => {
    const value = Number.parseInt(params.get(name), 10);
    if (!Number.isInteger(value)) {
      return fallback;
    }
    return Math.min(Math.max(value, 1), MAX_SIZE);
  };

  return {
    w: parseSize('w', DEFAULT_WIDTH),
    h: parseSize('h', DEFAULT_HEIGHT),
  };
}


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


class Maze extends React.Component {
  constructor(props) {
    super(props);
    this.state = createInitialMazeState(this.props.w, this.props.h);
  }

  handleMouseOver(x, y) {
    const rows = this.state.rows.slice();
    const arrows = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]];
    arrows.forEach(a => {
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
        const completed = isMazeCompleted(rows);
        this.setState({
          rows: rows,
          completed: completed,
        });
      }
    });
  }

  render() {
    const rows = this.state.rows;
    const [width, height] = [this.props.w, this.props.h].map(
      s => String((parseInt(s)*2+1)*CELL_SIZE)+"px");
    return (
      <table
          className={this.state.completed ? "maze completed" : "maze"}
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

const root = createRoot(document.getElementById("root"));
const mazeSize = getMazeSize();

root.render(
  <Maze
      w={mazeSize.w}
      h={mazeSize.h}
  />);
