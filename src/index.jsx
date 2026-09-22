import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCellFromPointer, drawMaze, drawTrace, drawTraceCells } from './canvas.mjs';
import { createInitialMazeState, extendTrace, isPassage, isTraceVisited } from './maze.mjs';
import { createSeededRandom, getMazeSeed } from './maze-seed.mjs';
import { getMazeSize } from './maze-size.mjs';
import {
  canActivatePointer,
  shouldReleasePointer,
  shouldTrackPointerMove,
} from './pointer-input.mjs';

const CELL_SIZE = 7.5;
const COARSE_POINTER_CELL_SIZE = 15;


class Maze extends React.Component {
  constructor(props) {
    super(props);

    const initialMaze = createInitialMazeState(this.props.w, this.props.h, this.props.random);
    this.rows = initialMaze.rows;
    this.trace = initialMaze.trace;
    this.state = {
      completed: initialMaze.completed,
    };
    this.canvasRef = React.createRef();
    this.activePointerId = null;
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

  handlePointerPosition(event) {
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

    this.extendTraceTo(cell.x, cell.y);
  }

  handlePointerDown(event) {
    if (!canActivatePointer(event.pointerType, event.isPrimary, this.activePointerId)) {
      return;
    }

    this.activePointerId = event.pointerId;

    const canvas = this.canvasRef.current;
    if (canvas && typeof canvas.setPointerCapture === 'function') {
      canvas.setPointerCapture(event.pointerId);
    }

    this.handlePointerPosition(event);
  }

  handlePointerMove(event) {
    if (!shouldTrackPointerMove(event.pointerType, event.pointerId, this.activePointerId)) {
      return;
    }

    this.handlePointerPosition(event);
  }

  handlePointerEnd(event, processPosition = true) {
    if (!shouldReleasePointer(event.pointerId, this.activePointerId)) {
      return;
    }

    if (processPosition) {
      this.handlePointerPosition(event);
    }
    this.activePointerId = null;

    const canvas = this.canvasRef.current;
    if (
      canvas &&
      typeof canvas.hasPointerCapture === 'function' &&
      canvas.hasPointerCapture(event.pointerId)
    ) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  handleLostPointerCapture(event) {
    if (shouldReleasePointer(event.pointerId, this.activePointerId)) {
      this.activePointerId = null;
    }
  }

  extendTraceTo(x, y) {
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
      '--maze-width': String(canvasWidth * CELL_SIZE) + 'px',
      '--maze-height': String(canvasHeight * CELL_SIZE) + 'px',
      '--maze-coarse-width': String(canvasWidth * COARSE_POINTER_CELL_SIZE) + 'px',
      '--maze-coarse-height': String(canvasHeight * COARSE_POINTER_CELL_SIZE) + 'px',
    };

    return (
      <canvas
        ref={this.canvasRef}
        className="maze"
        width={canvasWidth}
        height={canvasHeight}
        style={style}
        onPointerDown={(event) => this.handlePointerDown(event)}
        onPointerMove={(event) => this.handlePointerMove(event)}
        onPointerUp={(event) => this.handlePointerEnd(event)}
        onPointerCancel={(event) => this.handlePointerEnd(event, false)}
        onLostPointerCapture={(event) => this.handleLostPointerCapture(event)}
      />
    );
  }
}

const root = createRoot(document.getElementById("root"));
const search = window.location.search;
const mazeSize = getMazeSize(search);
const seed = getMazeSeed(search);
const random = seed === null ? undefined : createSeededRandom(seed);

root.render(
  <Maze
      w={mazeSize.w}
      h={mazeSize.h}
      random={random}
  />,
);
