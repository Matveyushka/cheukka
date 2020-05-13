import * as React from 'react'
import { allConnectionTypes } from '../../types/DiagramConnectionTypes/ConnectionType'
import { useSelector, useDispatch } from 'react-redux'
import { getScale } from '../../utils'
import { Store } from '../../stores'
import {
  Connection,
  nonActiveConnectionTypeChooserState,
  ConnectionPathPoint,
  ConnectionAreaPoint,
  EntityConnectionPoint,
} from '../../types'
import { addConnection, setConnectionTypeChooserState, setMouseMode } from '../../actions'
import {
  validEntityConnectionsBegin,
  validEntityConnectionsEnd
} from '../../constants/dictionaries/validEntityConnections'
import { connectionTypeArrows } from '../../constants/dictionaries/connectionTypeArrows'
import { connectionTypeDashedPaths } from '../../constants/arrays/connectionTypePaths'

export interface ConnectionTypeChooserProps {
  x: number
  y: number
  endPoint: ConnectionPathPoint
}

export const ConnectionTypeChooser = (props: ConnectionTypeChooserProps) => {
  const [
    scale,
    currentDiagramConnection,
    diagramEntities,
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.currentDiagramConnection,
    state.diagramEntities
  ])
  const dispatch = useDispatch()

  const getStyle = () => ({
    left: props.x * scale,
    top: props.y * scale,
  })

  const getPossibleConnectionTypes = () => {
    const possibleBegins = (() => {
      if (currentDiagramConnection.begin instanceof ConnectionAreaPoint ||
        currentDiagramConnection.begin instanceof EntityConnectionPoint) {
        return validEntityConnectionsBegin.get(diagramEntities.get(currentDiagramConnection.begin.entityId).type)
      } else {
        return allConnectionTypes
      }
    })()
    const possibleEnds = (() => {
      if (props.endPoint instanceof ConnectionAreaPoint ||
        props.endPoint instanceof EntityConnectionPoint) {
        return validEntityConnectionsEnd.get(diagramEntities.get(props.endPoint.entityId).type)
      } else {
        return allConnectionTypes
      }
    })()

    return possibleBegins.filter(type => possibleEnds.indexOf(type) >= 0)
  }

  const possibleConnectionTypes = getPossibleConnectionTypes()

  const renderChooser = () => {
    return possibleConnectionTypes.map((type, index) => {
      return <button
        key={index}
        onClick={() => {
          dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
          dispatch(addConnection(new Connection(
            currentDiagramConnection.begin,
            props.endPoint,
            type
          )))
        }}>
        <svg width="100%" height="100%">
          <path
            d="M 14 5 L 14 30"
            stroke="black"
            strokeWidth="1"
            strokeDasharray={connectionTypeDashedPaths.indexOf(type) !== -1 ? '4 4' : '1 0'}
          />
          {connectionTypeArrows.get(type)(14, 5, 1, "black", 5)}
        </svg>
      </button>
    })
  }

  if (possibleConnectionTypes.length === 1) {
    dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
    dispatch(addConnection(new Connection(
      currentDiagramConnection.begin,
      props.endPoint,
      possibleConnectionTypes[0]
    )))
  }

  if (possibleConnectionTypes.length === 0) {
    dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
  }

  return (
    <div
      className='diagram-entity-type-chooser'
      onMouseDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      style={getStyle()}>
      {renderChooser()}
    </div>
  )
}