import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCellFromPointer, drawMaze } from './canvas.mjs';
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


class Maze extends React.Component {
  constructor(props) {
    super(props);
    this.state = createInitialMazeState(this.props.w, this.props.h);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    drawMaze(context, this.state.rows, this.state.completed);
  }

  handleMouseMove(event) {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }

    const cell = getCellFromPointer(
      event.clientX,
      event.clientY,
      canvas.getBoundingClientRect(),
      canvas.width,
      canvas.height,
    );

    if (!cell || this.state.rows[cell.y][cell.x] !== '') {
      return;
    }

    this.handleMouseOver(cell.x, cell.y);
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
    const canvasWidth = rows[0].length;
    const canvasHeight = rows.length;
    const style = {
      width: String(canvasWidth * CELL_SIZE) + 'px',
      height: String(canvasHeight * CELL_SIZE) + 'px',
    };

    return (
      <canvas
        ref={this.canvasRef}
        className="maze"
        width={canvasWidth}
        height={canvasHeight}
        style={style}
        onMouseMove={(event) => this.handleMouseMove(event)}
      />
    );
  }
}

const root = createRoot(document.getElementById("root"));
const mazeSize = getMazeSize();

root.render(
  <Maze
      w={mazeSize.w}
      h={mazeSize.h}
  />,
);
