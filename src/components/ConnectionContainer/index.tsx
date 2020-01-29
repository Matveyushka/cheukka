import * as React from 'react'
import {
  Connection,
  ConnectionPoint,
  ConnectionAreaPoint,
  FreeConnectionPoint,
 
  EntityConnectionPoint,
  Entity
} from '../../types'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale, roundCoordinateOrSize, getTheClosestSegmentPointPosition } from '../../utils'
import { ConnectionPath } from './ConnectionPath'
import { ConnectionTypeArrows } from '../../constants/dictionaries'

export interface ConnectionContainerProps {
  connection: Connection,
}

export const ConnectionContainer = (props: ConnectionContainerProps) => {
  const scale = useSelector((state: Store) => getScale(state.scaleLevel))
  const entities = useSelector((state: Store) => state.diagramEntities)

  const [h, sh] = React.useState(false)

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

  const radsToDegrees = (rads: number) => rads * 180 / Math.PI

  const getSegmentAngle = (beginX: number, beginY: number, endX: number, endY: number) => {
    const xDifference = endX - beginX
    const yDifference = endY - beginY
    const distance = Math.sqrt(xDifference ** 2 + yDifference ** 2)

    if (distance === 0) {
      return 0
    } else if (xDifference >= 0 && yDifference < 0) {
      return radsToDegrees(Math.asin(xDifference / distance))
    } else if (xDifference > 0 && yDifference >= 0) {
      return 90 + radsToDegrees(Math.asin(yDifference / distance))
    } else if (xDifference <= 0 && yDifference > 0) {
      return 180 - radsToDegrees(Math.asin(xDifference / distance))
    } else if (xDifference < 0 && yDifference <= 0) {
      return 270 - radsToDegrees(Math.asin(yDifference / distance))
    }
  }

  const beginX = getPointX(props.connection.begin)
  const beginY = getPointY(props.connection.begin)
  const endX = getPointX(props.connection.end)
  const endY = getPointY(props.connection.end)

  const pathPoints = [
    { x: beginX * scale, y: beginY * scale },
    { x: endX * scale, y: endY * scale }
  ]

  return (
    <>
      <ConnectionPath
        points={pathPoints}
        width={1}
        color='black'
        dashed={false}
      />
      {
        <g transform={`rotate(${getSegmentAngle(
          beginX,
          beginY,
          endX,
          endY)} ${endX * scale} ${endY * scale})`}>
          {ConnectionTypeArrows.get(props.connection.type)(endX, endY, scale)}
        </g>
      }
      {
        h ?
          <ConnectionPath
            points={pathPoints}
            width={4}
            color='red'
            dashed={true}
          />
          : ''
      }
      <g
        onMouseEnter={() => sh(true)}
        onMouseMove={() => sh(true)}
        onMouseLeave={() => sh(false)}
      >
        <ConnectionPath
          points={pathPoints}
          width={25}
          color='transparent'
          dashed={false}
        />
      </g>
    </>
  )
}