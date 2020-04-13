import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getBackgroundSvg } from '../../svg'
import { EntityContainer } from '../EntityContainer'
import { ConnectionContainer } from '../ConnectionContainer'
import { MouseMode } from '../../types'
import { useCanvasHandlers } from './handlers'
import { EntityTypeChooser } from '../EntityTypeChooser'
import { entityGroups } from '../../types/DiagramEntityTypes/EntityType'
import { getScale } from '../../utils'
import { ConnectionTypeChooser } from '../ConnectionTypeChooser'
import { Saver } from '../Saver'

export interface CanvasProps { }

export const Canvas = (props: CanvasProps) => {
  const {
    doubleClickHandler,
    mouseDownHandler,
    mouseUpHandler,
    mouseMoveHandler,
    selectingState,
  } = useCanvasHandlers()

  const [
    scale,
    scaleLevel,
    entities,
    connections,
    mode,
    currentDiagramConnection,
    EntityTypeChooserState,
    diagramType,
    connectionTypeChooserState,
    saveSettings,
    isSaving
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.scaleLevel,
    state.diagramEntities,
    state.diagramConnections,
    state.mouseMode,
    state.currentDiagramConnection,
    state.entityTypeChooserState,
    state.diagramType,
    state.connectionTypeChooserState,
    state.lastSaveSettings,
    state.isSaving
  ])

  const renderEntities = () => Array.from(entities.entries()).map((entity, index) => (
    <EntityContainer key={index} entityId={entity[0]} entity={entity[1]} scale={scale} />
  ))

  const renderConnections = () => Array.from(connections.entries()).map((connection, index) => (
    <ConnectionContainer key={index} connectionId={connection[0]} connection={connection[1]} scale={scale}/>
  ))

  const renderSelection = () => {
    const x = Math.min(selectingState.beginX, selectingState.endX)
    const y = Math.min(selectingState.beginY, selectingState.endY)
    const width = Math.max(selectingState.beginX - x, selectingState.endX - x)
    const height = Math.max(selectingState.beginY - y, selectingState.endY - y)

    return (
      <rect
        x={x * scale}
        y={y * scale}
        width={width * scale}
        height={height * scale}
        stroke={'#777799'}
        strokeWidth={1}
        fill={'#77779977'}
      />
    )
  }

  const backgroundBlocksAmountInWidth = (() => {
    if (scaleLevel > 10) return 10
    if (scaleLevel > 5) return 5
    return 2
  })()

  return (
    <div className='canvas-main'>
      <div
        onDoubleClick={doubleClickHandler}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        className='diagram-canvas'
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,${getBackgroundSvg(scale, backgroundBlocksAmountInWidth)}')`,
          backgroundSize: `${100 / backgroundBlocksAmountInWidth}%`,
        }}
      >
        {
          isSaving ? <Saver saveSettings={saveSettings} /> : ""
        }
        <svg width='100%' height='100%' id="TEMPO">
          {renderConnections()}
          {renderEntities()}
          {(mode === MouseMode.connecting ||
            connectionTypeChooserState.isActive ||
            EntityTypeChooserState.isActive && EntityTypeChooserState.withConnecting) ?
            (
              <g pointerEvents='none'>
                <ConnectionContainer connectionId={null} connection={currentDiagramConnection} scale={scale}/>
              </g>
            ) : ''}
          { mode === MouseMode.selecting ? renderSelection() : '' }
        </svg>
        {
          EntityTypeChooserState.isActive ?
            <EntityTypeChooser
              x={EntityTypeChooserState.x}
              y={EntityTypeChooserState.y}
            />
            : ''
        }
        {
          connectionTypeChooserState.isActive ?
            <ConnectionTypeChooser
              x={connectionTypeChooserState.x}
              y={connectionTypeChooserState.y}
              endPoint={connectionTypeChooserState.endPoint}
            /> : ''
        }
      </div>
    </div>
  )
}