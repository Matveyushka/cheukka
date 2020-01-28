import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getBackgroundSvg } from '../../svg'
import { EntityContainer } from '../EntityContainer'
import { ConnectionContainer } from '../ConnectionContainer'
import { MouseMode, DiagramEntityType } from '../../types'
import { useCanvasHandlers } from './handlers'
import { DiagramEntityTypeChooser } from '../DiagramEntityTypeChooser'
import { diagramEntityGroups, diagramEntityCreators } from '../../types/DiagramEntityType'
import { getScale } from '../../utils'
import { ConnectionTypeChooser } from '../ConnectionTypeChooser'
import { ConnectionType } from '../../types/ConnectionType'

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
    diagramEntityTypeChooserState,
    diagramType,
    connectionTypeChooserState,
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.scaleLevel,
    state.diagramEntities,
    state.diagramConnections,
    state.mouseMode,
    state.currentDiagramConnection,
    state.diagramEntityTypeChooserState,
    state.diagramType,
    state.connectionTypeChooserState
  ])

  const renderEntities = () => {
    return Array.from(entities.entries()).map((entity, index) => (
      <EntityContainer key={index}
        entityId={entity[0]}
        entity={entity[1]}
      />
    ))
  }

  const renderConnections = () => {
    return Array.from(connections.entries()).map((connection, index) => (
      <ConnectionContainer key={index}
        connection={connection[1]}
      />
    ))
  }

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
    <div className="canvas-main">
      <div
        onDoubleClick={doubleClickHandler}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        className="diagram-canvas"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,${getBackgroundSvg(scale, backgroundBlocksAmountInWidth)}')`,
          backgroundSize: `${100 / backgroundBlocksAmountInWidth}%`,
        }}
      >
        <svg width="100%" height="100%">
          {renderConnections()}
          {renderEntities()}
          {(mode === MouseMode.connecting || connectionTypeChooserState.isActive) ?
            (
              <g pointerEvents="none">
                <ConnectionContainer connection={currentDiagramConnection} />
              </g>
            ) : ''}
          {
            mode === MouseMode.selecting ?
              renderSelection()
              : ''
          }
        </svg>
        {
          diagramEntityTypeChooserState.isActive ?
            <DiagramEntityTypeChooser
              x={diagramEntityTypeChooserState.x}
              y={diagramEntityTypeChooserState.y}
              diagramEntityTypes={diagramEntityGroups.get(diagramType).types}
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