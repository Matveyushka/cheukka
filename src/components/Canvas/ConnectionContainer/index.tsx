import * as React from 'react'
import { Entity, Connection, ConnectionAreaPoint, FreeConnectionPoint } from '../../../types'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../../stores'
import { getScale } from '../../../utils'
import { ConnectionPath } from './ConnectionPath'

export interface ConnectionContainerProps {
  connection: Connection,
}

export const ConnectionContainer = (props: ConnectionContainerProps) => {
  const scale = useSelector((state: Store) => getScale(state.scale))
  const entities = useSelector((state: Store) => state.diagramEntities)

  const getPointX = (point: ConnectionAreaPoint | FreeConnectionPoint) => {
    if (point instanceof ConnectionAreaPoint) {
      const entity = entities.get(point.entityId)
      const area = entity.connectionAreas[point.areaId]
      return entity.x + area.xBegin + (area.xEnd - area.xBegin) * point.positionPercent
    } else if (point instanceof FreeConnectionPoint) {
      return point.x
    }
  }

  const getPointY = (point: ConnectionAreaPoint | FreeConnectionPoint) => {
    if (point instanceof ConnectionAreaPoint) {
      const entity = entities.get(point.entityId)
      const area = entity.connectionAreas[point.areaId]
      return entity.y + area.yBegin + (area.yEnd - area.yBegin) * point.positionPercent
    } else if (point instanceof FreeConnectionPoint) {
      return point.y
    }
  }

  return (
    <>
      <ConnectionPath points={[
        {x:getPointX(props.connection.begin) * scale,y:getPointY(props.connection.begin) * scale},
        {x:getPointX(props.connection.end) * scale,y:getPointY(props.connection.end) * scale}
      ]}/>
      <circle
        cx={getPointX(props.connection.end) * scale}
        cy={getPointY(props.connection.end) * scale}
        r={10}
        fill='black'
      />
    </>
  )
}