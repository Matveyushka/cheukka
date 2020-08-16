import { ConnectionPathPoint, Entity, ConnectionAreaPoint, FreeConnectionPoint, EntityConnectionPoint, Connection, ConnectionPoint } from '../types'
import { getTheClosestAreaPointPosition } from '.'
import { ConnectionDirection } from '../types'
import { Point } from '../types/geometry'
import { IntermediateConnectionPoint } from '../types/DiagramConnectionTypes/ConnectionPathPoint/IntermediateConnectionPoint'

export const getTheClosestSegmentPointToFreePoint = (freePoint: Point, segmentBegin: Point, segmentEnd: Point) => {
  const p1 = segmentBegin
  const p2 = segmentEnd

  if (p1.x === p2.x && p1.y === p2.y) {
    return { x: p1.x, y: p1.y }
  }

  const xc1 = p1.y - p2.y
  const yc1 = p2.x - p1.x
  const fc1 = p1.x * p2.y - p2.x * p1.y

  const xc2 = -yc1
  const yc2 = xc1
  const fc2 = -(xc1 * freePoint.y - yc1 * freePoint.x)

  const crossX = (fc1 * yc2 - fc2 * yc1) / (yc1 * xc2 - xc1 * yc2)

  const leftBorder = p1.x < p2.x ? p1.x : p2.x
  const rightBorder = p1.x > p2.x ? p1.x : p2.x

  const topBorder = p1.y < p2.y ? p1.y : p2.y
  const bottomBorder = p1.y > p2.y ? p1.y : p2.y

  const desiredX = crossX < leftBorder ? leftBorder : crossX > rightBorder ? rightBorder : crossX
  const desiredY = (yc1 === 0) ?
    (freePoint.y < topBorder ? topBorder : freePoint.y > bottomBorder ? bottomBorder : freePoint.y)
    : ((-xc1 * desiredX - fc1) / yc1)

  return { x: desiredX, y: desiredY }
}

export const radsToDegrees = (rads: number) => rads * 180 / Math.PI

export const getSegmentAngle = (beginX: number, beginY: number, endX: number, endY: number) => {
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

export const getConnectionPointCoordinates = (point: ConnectionPathPoint, entities: Map<number, Entity>) => {
  if (point instanceof FreeConnectionPoint || point instanceof IntermediateConnectionPoint) {
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

export const getTheClosestConnectionAreaId = (
  oppositePoint: ConnectionPathPoint,
  entity: Entity,
  entities: Map<number, Entity>,
) => {
  const [pointX, pointY] = getConnectionPointCoordinates(oppositePoint, entities)
  const distances = entity.connectionAreaCreators.map(creator => {
    const area = creator(entity)
    const closestPosition = getTheClosestAreaPointPosition(
      pointX,
      pointY,
      entity,
      area,
    )
    const closestX = (area.xEnd - area.xBegin) * closestPosition + area.xBegin + entity.x
    const closestY = (area.yEnd - area.yBegin) * closestPosition + area.yBegin + entity.y

    return Math.sqrt((closestX - pointX) ** 2 + (closestY - pointY) ** 2)
  })

  return distances.indexOf(Math.min(...distances))
}

export const getTheClosestEntityConnectablePointCoordinates = (
  oppositePoint: ConnectionPathPoint,
  entity: Entity,
  entities: Map<number, Entity>,
) => {
  const [pointX, pointY] = getConnectionPointCoordinates(oppositePoint, entities)

  const closestAreaId = getTheClosestConnectionAreaId(oppositePoint, entity, entities)

  const closestSegmentPosition = getTheClosestAreaPointPosition(
    pointX,
    pointY,
    entity,
    entity.connectionAreaCreators[closestAreaId](entity),
  )

  const closestArea = entity.connectionAreaCreators[closestAreaId](entity)

  return {
    x: entity.x + closestArea.xBegin + (closestArea.xEnd - closestArea.xBegin) * closestSegmentPosition,
    y: entity.y + closestArea.yBegin + (closestArea.yEnd - closestArea.yBegin) * closestSegmentPosition
  }
}

export const getFreePointToConnectionDistance = (freeX: number, freeY: number, connection: Connection, entities: Map<number, Entity>) => {
  const beginX = connection.begin.getX(connection.begin)
  const endX = connection.end.getX(connection.begin)
  const beginY = connection.begin.getY(connection.begin)
  const endY = connection.end.getY(connection.begin)

  const result = getTheClosestSegmentPointToFreePoint(
    { x: freeX, y: freeY },
    { x: beginX, y: beginY },
    { x: endX, y: endY }
  )

  return Math.sqrt((result.x - freeX) ** 2 + (result.y - freeY) ** 2)
}

//------------------------------------------
//------------------------------------------
//------------------------------------------

export const getEntityConnectionClosestPoint = (
  oppositePoint: ConnectionPathPoint,
  targetEntity: Entity,
  entities: Map<number, Entity>,
) => {
  const connectablePoints = targetEntity.connectionAreaCreators
    .map(creator => creator(targetEntity))
    .filter(point => point instanceof ConnectionPoint && point.isForEntityConnectionType)

  const topPoints = connectablePoints.filter(point => {
    return point.directions.indexOf(ConnectionDirection.Top) >= 0
  })

  const bottomPoints = connectablePoints.filter(point => {
    return point.directions.indexOf(ConnectionDirection.Bottom) >= 0
  })

  const rightPoints = connectablePoints.filter(point => {
    return point.directions.indexOf(ConnectionDirection.Right) >= 0
  })

  const leftPoints = connectablePoints.filter(point => {
    return point.directions.indexOf(ConnectionDirection.Left) >= 0
  })

  if (targetEntity.y > oppositePoint.getY(oppositePoint) && topPoints.length > 0) {
    return topPoints[0]
  } else if (targetEntity.y + targetEntity.height < oppositePoint.getY(oppositePoint) && bottomPoints.length > 0) {
    return bottomPoints[0]
  } else if (targetEntity.x > oppositePoint.getX(oppositePoint) && leftPoints.length > 0) {
    return leftPoints[0]
  } else if (targetEntity.x + targetEntity.width < oppositePoint.getX(oppositePoint) && rightPoints.length > 0) {
    return rightPoints[0]
  } else return null
}

export const getEntityConnectionPosition = (
  oppositePoint: ConnectionPathPoint,
  targetEntity: Entity,
  entities: Map<number, Entity>,
) => {
  const closestPoint = getEntityConnectionClosestPoint(oppositePoint, targetEntity, entities)

  if (closestPoint) {
    return {
      x: targetEntity.x + closestPoint.xBegin,
      y: targetEntity.y + closestPoint.yBegin
    }
  } else {
    return getTheClosestEntityConnectablePointCoordinates(
      oppositePoint, targetEntity, entities,
    )
  }
}

export const getPointsDistance = (point1: Point, point2: Point) => {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
}

export const isAreaInsideAnotherArea = (innerArea: {
  beginX: number,
  beginY: number,
  endX: number,
  endY: number,
}, outerArea: {
  beginX: number,
  beginY: number,
  endX: number,
  endY: number,
}) => {
  const innerX = Math.min(innerArea.beginX, innerArea.endX)
  const innerY = Math.min(innerArea.beginY, innerArea.endY)
  const innerWidth = Math.max(innerArea.beginX - innerX, innerArea.endX - innerX)
  const innerHeight = Math.max(innerArea.beginY - innerY, innerArea.endY - innerY)

  const outerX = Math.min(outerArea.beginX, outerArea.endX)
  const outerY = Math.min(outerArea.beginY, outerArea.endY)
  const outerWidth = Math.max(outerArea.beginX - outerX, outerArea.endX - outerX)
  const outerHeight = Math.max(outerArea.beginY - outerY, outerArea.endY - outerY)

  if (innerX > outerX &&
    innerX + innerWidth < outerX + outerWidth &&
    innerY > outerY &&
    innerY + innerHeight < outerY + outerHeight) return true;
  return false;
}

export const isEntityInArea = (entity: Entity, area: {
  beginX: number,
  beginY: number,
  endX: number,
  endY: number,
}) => {
  const x = Math.min(area.beginX, area.endX)
  const y = Math.min(area.beginY, area.endY)
  const width = Math.max(area.beginX - x, area.endX - x)
  const height = Math.max(area.beginY - y, area.endY - y)

  if ((entity.x >= x) &&
    ((entity.x + entity.width) < (x + width)) &&
    (entity.y >= y) &&
    ((entity.y + entity.height) < (y + height))) return true
  return false
}