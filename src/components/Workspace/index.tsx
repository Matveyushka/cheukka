import * as React from 'react'
import { Canvas } from '../Canvas'
import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
} from '../../constants'
import { useWorkspaceOffsetAndScale } from './offsetAndScaleHook'
import { TextCustomizationPanel } from '../CustomizationPanels/TextCustomizationPanel'
import { RightActionPanel } from '../ActionPanels/RightActionPanel'
import { LeftActionPanel } from '../ActionPanels/LeftActionPanel'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { EntityCustomizationPanel } from '../CustomizationPanels/EntityCustomizationPanel'
import { ConnectionCustomizationPanel } from '../CustomizationPanels/ConnectionCustomizationPanel'
import { useHotKeys } from './hotKeysHook'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const {
    scale,
    workspaceRef,
    mouseMoveHandler,
    scrollHandler,
    preventContextMenu,
  } = useWorkspaceOffsetAndScale()

  useHotKeys()

  const [
    textSettingsAreOpen,
    entitySettingsAreOpen,
    connectionSettingsAreOpen,
    saved
  ] = useSelector((state: Store) => [
    state.textSettingsAreOpen,
    state.entitySettingsAreOpen,
    state.connectionSettingsAreOpen,
    state.actualVersionSaved
  ])

  return (
    <div className='workspace'
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
      onScroll={scrollHandler}
      ref={workspaceRef}
    >
      <div style={{position: "fixed", left: "20px", top: "20px"}}>{saved ? "saved" : "no"}</div>
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

      <LeftActionPanel />
      <RightActionPanel />
      <div className='customization-panels'>
        {textSettingsAreOpen && <><TextCustomizationPanel /> <div className='customization-panels-spacing'/></>}
        {entitySettingsAreOpen && <><EntityCustomizationPanel /><div className='customization-panels-spacing'/></>}
        {connectionSettingsAreOpen && <ConnectionCustomizationPanel />}
      </div>
    </div>)
}