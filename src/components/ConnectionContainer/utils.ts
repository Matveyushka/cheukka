import { ConnectionPathPoint, FreeConnectionPoint, ConnectionAreaPoint, Entity, EntityConnectionPoint, Connection } from "../../types"
import { getTheClosestAreaPointPosition } from "../../utils"
import { getTheClosestSegmentPointToFreePoint } from "../../utils/geometry"

export const getConnectionPointCoordinates = (point: ConnectionPathPoint, entities: Map<number, Entity>) => {
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

export const getTheClosestEntityConnectablePointCoordinates = (
  srcPoint: ConnectionPathPoint, 
  entity: Entity, 
  entities: Map<number,Entity>,
) => {
  const [pointX, pointY] = getConnectionPointCoordinates(srcPoint, entities)
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

  const closestAreaId = distances.indexOf(Math.min(...distances))

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

export const getPointX = (point: ConnectionPathPoint, srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => {
  if (point instanceof EntityConnectionPoint) {
    return getTheClosestEntityConnectablePointCoordinates(srcPoint, entities.get(point.entityId), entities).x
  } else if (point instanceof ConnectionAreaPoint) {
    const entity = entities.get(point.entityId)
    const area = entity.connectionAreaCreators[point.areaId](entity)
    return entity.x + area.xBegin + (area.xEnd - area.xBegin) * point.positionPercent
  } else if (point instanceof FreeConnectionPoint) {
    return point.x
  }
}

export const getPointY = (point: ConnectionPathPoint, srcPoint: ConnectionPathPoint, entities: Map<number, Entity>) => {
  if (point instanceof EntityConnectionPoint) {
    return getTheClosestEntityConnectablePointCoordinates(srcPoint, entities.get(point.entityId), entities).y
  } else if (point instanceof ConnectionAreaPoint) {
    const entity = entities.get(point.entityId)
    const area = entity.connectionAreaCreators[point.areaId](entity)
    return entity.y + area.yBegin + (area.yEnd - area.yBegin) * point.positionPercent
  } else if (point instanceof FreeConnectionPoint) {
    return point.y
  }
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
export const getFreePointToConnectionDistance = (freeX: number, freeY: number, connection: Connection, entities: Map<number, Entity>) => {
  const beginX = getPointX(connection.begin, connection.begin, entities)
  const endX = getPointX(connection.end, connection.begin, entities)
  const beginY = getPointY(connection.begin, connection.begin, entities)
  const endY = getPointY(connection.end, connection.begin, entities)

  const result = getTheClosestSegmentPointToFreePoint(
    {x: freeX, y: freeY},
    {x: beginX, y: beginY},
    {x: endX, y: endY }
  )

  return Math.sqrt((result.x - freeX) ** 2 + (result.y - freeY) ** 2)
}