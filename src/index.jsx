import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCellFromPointer, drawMaze, drawTrace, drawTraceCells } from './canvas.mjs';
import { createInitialMazeState, extendTrace, isPassage, isTraceVisited } from './maze.mjs';
import { getMazeSize } from './maze-size.mjs';

const CELL_SIZE = 7.5;


class Maze extends React.Component {
  constructor(props) {
    super(props);

    const initialMaze = createInitialMazeState(this.props.w, this.props.h);
    this.rows = initialMaze.rows;
    this.trace = initialMaze.trace;
    this.state = {
      completed: initialMaze.completed,
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const context = this.getContext();
    if (context) {
      drawMaze(context, this.rows, this.trace, this.state.completed);
    }
  }

  getContext() {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return null;
    }

    return canvas.getContext('2d');
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

    if (
      !cell ||
      !isPassage(this.rows, cell.x, cell.y) ||
      isTraceVisited(this.trace, cell.x, cell.y)
    ) {
      return;
    }

    this.handleMouseOver(cell.x, cell.y);
  }

  handleMouseOver(x, y) {
    const previousCompleted = this.state.completed;
    const update = extendTrace(this.rows, this.trace, x, y);

    if (update.addedCells.length === 0) {
      return;
    }

    const context = this.getContext();
    if (context) {
      if (update.completed && !previousCompleted) {
        drawTrace(context, this.trace, true);
      } else {
        drawTraceCells(context, update.addedCells, previousCompleted);
      }
    }

    if (update.completed !== previousCompleted) {
      this.setState({ completed: update.completed });
    }
  }

  render() {
    const canvasWidth = this.rows[0].length;
    const canvasHeight = this.rows.length;
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
