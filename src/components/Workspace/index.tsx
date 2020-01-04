import * as React from 'react'
import { Canvas } from '../Canvas'
import { 
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
} from '../../constants'
import {
  useWorkspaceOffsetAndScale
} from './offsetAndScaleHook'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const {
    scale,
    workspaceRef,
    mouseMoveHandler,
    scrollHandler,
    preventContextMenu,
  } = useWorkspaceOffsetAndScale()

  return (
    <div className="workspace"
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
      onScroll={scrollHandler}
      ref={workspaceRef}
    >
      <div className="canvas-wrapper" style={{
        height: DEFAULT_CANVAS_HEIGHT + 'px',
        width: DEFAULT_CANVAS_WIDTH + 'px',
        borderRight: DEFAULT_EMPTY_SPACE_WIDTH / scale + 'px solid transparent',
        borderLeft: DEFAULT_EMPTY_SPACE_WIDTH / scale + 'px solid transparent',
        borderTop: DEFAULT_EMPTY_SPACE_HEIGHT / scale + 'px solid transparent',
        borderBottom: DEFAULT_EMPTY_SPACE_HEIGHT / scale + 'px solid transparent',
        transform: `Scale(${scale})`,
        transformOrigin: `0 0`,
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}