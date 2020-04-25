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
import { TextCustomizationPanel } from '../CustomizationPanels/TextCustomizationPanel'
import { RightActionPanel } from '../ActionPanels/RightActionPanel'
import { LeftActionPanel } from '../ActionPanels/LeftActionPanel'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const {
    scale,
    workspaceRef,
    mouseMoveHandler,
    scrollHandler,
    preventContextMenu,
  } = useWorkspaceOffsetAndScale()

  const [
    textSettingsAreOpen
  ] = useSelector((state: Store) => [
    state.textSettingsAreOpen
  ])

  return (
    <div className='workspace'
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
      onScroll={scrollHandler}
      ref={workspaceRef}
    >
      <div className='canvas-wrapper' style={{
        height: DEFAULT_CANVAS_HEIGHT * scale + 'px',
        width: DEFAULT_CANVAS_WIDTH * scale + 'px',
        borderRight: DEFAULT_EMPTY_SPACE_WIDTH + 'px solid transparent',
        borderLeft: DEFAULT_EMPTY_SPACE_WIDTH + 'px solid transparent',
        borderTop: DEFAULT_EMPTY_SPACE_HEIGHT + 'px solid transparent',
        borderBottom: DEFAULT_EMPTY_SPACE_HEIGHT + 'px solid transparent',
      }}>
        <Canvas>
        </Canvas>
      </div>

      <LeftActionPanel/>
      <RightActionPanel/>
      {
        textSettingsAreOpen && <TextCustomizationPanel/>
      }
    </div>)
}