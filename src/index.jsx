import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCellFromPointer, drawMaze } from './canvas.mjs';
import { createInitialMazeState, extendTrace, isMazeCompleted } from './maze.mjs';
import { getMazeSize } from './maze-size.mjs';

const CELL_SIZE = 7.5;


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
    const rows = extendTrace(this.state.rows, x, y);
    if (rows === this.state.rows) {
      return;
    }

    this.setState({
      rows,
      completed: isMazeCompleted(rows),
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
const mazeSize = getMazeSize(window.location.search);

root.render(
  <Maze
      w={mazeSize.w}
      h={mazeSize.h}
  />,
);
