import * as React from 'react'
import {
  Connection,
  ConnectionPoint,
  ConnectionAreaPoint,
  FreeConnectionPoint,
  ConnectionType,
  EntityConnectionPoint,
  Entity
} from '../../types'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale, roundCoordinateOrSize, getTheClosestSegmentPointPosition } from '../../utils'
import { ConnectionPath } from './ConnectionPath'

export interface ConnectionContainerProps {
  connection: Connection,
}

export const ConnectionContainer = (props: ConnectionContainerProps) => {
  const scale = useSelector((state: Store) => getScale(state.scaleLevel))
  const entities = useSelector((state: Store) => state.diagramEntities)

  const getConnectionPointCoordinates = (point: ConnectionPoint) => {
    if (point instanceof FreeConnectionPoint) {
      return [point.x, point.y]
    } else if (point instanceof ConnectionAreaPoint) {
      const srcEntity = entities.get(point.entityId)
      const srcArea = srcEntity.connectionAreaCreators[point.areaId](srcEntity)

      return [
        srcEntity.x + srcArea.xBegin + (srcArea.xEnd - srcArea.xBegin) * point.positionPercent,
        srcEntity.y + srcArea.yBegin + (srcArea.yEnd - srcArea.yBegin) * point.positionPercent
      ]
    }
  }

  const getTheClosestEntityConnectablePointCoordinates = (srcPoint: ConnectionPoint, entity: Entity) => {
    const [pointX, pointY] = getConnectionPointCoordinates(props.connection.begin)
    const distances = entity.connectionAreaCreators.map(creator => {
      const area = creator(entity)
      const closestPosition = getTheClosestSegmentPointPosition(
        pointX,
        pointY,
        entity,
        area,
      )
      const closestX = (area.xEnd - area.xBegin) * closestPosition + area.xBegin + entity.x
      const closestY = (area.yEnd - area.yBegin) * closestPosition + area.yBegin + entity.y

      return Math.sqrt((closestX - pointX) ** 2 + (closestY - pointY) ** 2)
    })

    const closestAreaId = distances.indexOf(Math.min(...distances))

    const closestSegmentPosition = getTheClosestSegmentPointPosition(
      pointX,
      pointY,
      entity,
      entity.connectionAreaCreators[closestAreaId](entity),
    )

    const closestArea = entity.connectionAreaCreators[closestAreaId](entity)

    return {
      x: roundCoordinateOrSize(entity.x + closestArea.xBegin + (closestArea.xEnd - closestArea.xBegin) * closestSegmentPosition),
      y: roundCoordinateOrSize(entity.y + closestArea.yBegin + (closestArea.yEnd - closestArea.yBegin) * closestSegmentPosition)
    }
  }

  const getPointX = (point: ConnectionPoint) => {
    if (point instanceof EntityConnectionPoint) {
      return getTheClosestEntityConnectablePointCoordinates(props.connection.begin, entities.get(point.entityId)).x
    } else if (point instanceof ConnectionAreaPoint) {
      const entity = entities.get(point.entityId)
      const area = entity.connectionAreaCreators[point.areaId](entity)
      return roundCoordinateOrSize(entity.x + area.xBegin + (area.xEnd - area.xBegin) * point.positionPercent)
    } else if (point instanceof FreeConnectionPoint) {
      return roundCoordinateOrSize(point.x)
    }
  }

  const getPointY = (point: ConnectionPoint) => {
    if (point instanceof EntityConnectionPoint) {
      return getTheClosestEntityConnectablePointCoordinates(props.connection.begin, entities.get(point.entityId)).y
    } else if (point instanceof ConnectionAreaPoint) {
      const entity = entities.get(point.entityId)
      const area = entity.connectionAreaCreators[point.areaId](entity)
      return roundCoordinateOrSize(entity.y + area.yBegin + (area.yEnd - area.yBegin) * point.positionPercent)
    } else if (point instanceof FreeConnectionPoint) {
      return roundCoordinateOrSize(point.y)
    }
  }

  return (
    <>
      <ConnectionPath points={[
        { x: getPointX(props.connection.begin) * scale, y: getPointY(props.connection.begin) * scale },
        { x: getPointX(props.connection.end) * scale, y: getPointY(props.connection.end) * scale }
      ]} />
      {
        (() => {
          if (props.connection.type === ConnectionType.Connecting) return (<circle
            cx={getPointX(props.connection.end) * scale}
            cy={getPointY(props.connection.end) * scale}
            r={5}
            fill='black'
          />)
          if (props.connection.type === ConnectionType.BlockSchemeArrow) return (<circle
            cx={getPointX(props.connection.end) * scale}
            cy={getPointY(props.connection.end) * scale}
            r={10}
            fill='black'
          />)
        })()
      }

    </>
  )
}