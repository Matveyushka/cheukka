import * as React from 'react'
import { allConnectionTypes } from '../../types/ConnectionType'
import { useSelector, useDispatch } from 'react-redux'
import { getScale } from '../../utils'
import { Store } from '../../stores'
import { 
  Connection,
  nonActiveConnectionTypeChooserState,
  ConnectionPoint,
  ConnectionAreaPoint,
 } from '../../types'
import { addConnection, setConnectionTypeChooserState, setMouseMode } from '../../actions'

export interface ConnectionTypeChooserProps {
  x: number
  y: number
  endPoint: ConnectionPoint
}

export const ConnectionTypeChooser = (props: ConnectionTypeChooserProps) => {
  const [ 
    scale,
    currentDiagramConnection,
    diagramEntities,
  ]= useSelector((state: Store) => [
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
      if (currentDiagramConnection.begin instanceof ConnectionAreaPoint) {
        return diagramEntities.get(currentDiagramConnection.begin.entityId).validConnectionToBegin
      } else {
        return allConnectionTypes
      }
    })()
    const possibleEnds = (() => {
      if (props.endPoint instanceof ConnectionAreaPoint) {
        return diagramEntities.get(props.endPoint.entityId).validConnectionToEnd
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
        }}
      />
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