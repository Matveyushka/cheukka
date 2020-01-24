import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getBackgroundSvg } from '../../svg'
import { EntityContainer } from './EntityContainer'
import { ConnectionContainer } from './ConnectionContainer'
import { MouseMode } from '../../types'
import { useCanvasHandlers } from './handlers'

export interface CanvasProps { }

export const Canvas = (props: CanvasProps) => {
  const {
    doubleClickHandler,
    mouseDownHandler,
    mouseUpHandler,
    mouseMoveHandler
  } = useCanvasHandlers()

  const [
    scale,
    entities,
    connections,
    mode,
    currentDiagramConnection] = useSelector((state: Store) => [
      state.scale,
      state.diagramEntities,
      state.diagramConnections,
      state.mouseMode,
      state.currentDiagramConnection
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

  const backgroundBlocksAmountInWidth = (() => {
    if (scale > 10) return 10
    if (scale > 5) return 5
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
          {mode === MouseMode.connecting ?
            (
              <g pointerEvents="none">
                <ConnectionContainer connection={currentDiagramConnection}/>
              </g>
            ) : ''}
        </svg>
      </div>
    </div>
  )
}