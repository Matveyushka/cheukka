import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { ConnectionPoint } from '../../types'
import { getScale } from '../../utils'
import { useConnectionAreaHandlers } from './handlers'

export interface ConnectionAreaContainerProps {
  width: number;
  entityId: number;
  areaId: number;
}

export const ConnectionAreaContainer = (props: ConnectionAreaContainerProps) => {
  const [ scale, entities ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramEntities
  ])

  const entity = entities.get(props.entityId)
  const area = entity.connectionAreaCreators[props.areaId](entity)

  const {
    mouseDownHandler,
    mouseUpHandler,
    mouseMoveHandler,
  } = useConnectionAreaHandlers(entity, props.entityId, area, props.areaId)

  const renderConnectionPoint = () => (
    <circle
      className='connection-area'
      cx={(entity.x + area.xBegin + area.visualOffsetX * props.width / 2) * scale}
      cy={(entity.y + area.yBegin + area.visualOffseyY * props.width / 2) * scale}
      opacity={0.5}
      r={props.width * scale / 2}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
    />
  )

  const renderConnectionArea = () => (
    <line
      className='connection-area'
      x1={(entity.x + area.xBegin + area.visualOffsetX * props.width / 2) * scale}
      y1={(entity.y + area.yBegin + area.visualOffseyY * props.width / 2) * scale}
      x2={(entity.x + area.xEnd + area.visualOffsetX * props.width / 2) * scale}
      y2={(entity.y + area.yEnd + area.visualOffseyY * props.width / 2) * scale}
      opacity={0.5}
      strokeWidth={props.width * scale}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
    />)

  return (area instanceof ConnectionPoint) ?
    renderConnectionPoint() :
    renderConnectionArea()
}