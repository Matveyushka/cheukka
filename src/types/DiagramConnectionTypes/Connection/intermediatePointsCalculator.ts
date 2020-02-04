import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { FreeConnectionPoint } from '../ConnectionPathPoint/FreeConnectionPoint'
import { ConnectionDirection } from '../ConnectionDirection'
import { ConnectionAreaPoint } from '../ConnectionPathPoint/ConnectionAreaPoint'
import { Entity } from '../..'
import { EntityConnectionPoint } from '../ConnectionPathPoint/EntityConnectionPoint'
import { getEntityConnectionClosestPoint, getTheClosestConnectionAreaId } from '../../../utils/geometry'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'
import { ConnectionArea } from '../ConnectionArea'
import { ConnectionAreaContainer } from '../../../components/ConnectionAreaContainer'

const safeDistantion = 5

interface Area {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface Point {
  x: number;
  y: number;
}

interface Segment {
  point1: Point;
  point2: Point;
}

const newArea = (x: number, y: number, width: number, height: number): Area => ({
  left: x,
  top: y,
  right: x + width,
  bottom: y + height
})

const newSegment = (point1: Point, point2: Point) => ({ point1, point2 })

const newPoint = (x: number, y: number): Point => ({ x, y })

const getRelatedImpassableArea = (
  point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>
): Area => {
  if (point instanceof FreeConnectionPoint || point instanceof IntermediateConnectionPoint) {
    return newArea(point.getX(oppositePoint, entities), point.getY(oppositePoint, entities), 0, 0)
  } else if (point instanceof ConnectionAreaPoint || point instanceof EntityConnectionPoint) {
    const relatedEntity = entities.get(point.entityId)
    return newArea(relatedEntity.x, relatedEntity.y, relatedEntity.width, relatedEntity.height)
  }
}

const getMiddlePointInOneDimension = (begin1: number, end1: number, begin2: number, end2: number) => {
  if (begin1 > end2) { return end2 + (begin1 - end2) / 2 }
  if (begin2 > end1) { return end1 + (begin2 - end1) / 2 }
  if (begin1 <= begin2 && end1 >= begin2 && end2 <= end2) { return begin2 + (end1 - begin2) / 2 }
  if (begin1 >= begin2 && begin1 <= end2 && end1 >= end2) { return begin1 + (end2 - begin1) / 2 }
  if (begin1 >= begin2 && end1 <= end2) { return begin1 + (end1 - begin1) / 2 }
  if (begin1 <= begin2 && end1 >= end2) { return begin2 + (end2 - begin2) / 2 }
}

const getAreasMiddlePoint = (area1: Area, area2: Area): Point => ({
  x: getMiddlePointInOneDimension(area1.left, area1.right, area2.left, area2.right),
  y: getMiddlePointInOneDimension(area1.top, area1.bottom, area2.top, area2.bottom),
})

const getBorderArea = (area1: Area, area2: Area): Area => ({
  left: Math.min(area1.left, area2.left) - safeDistantion,
  top: Math.min(area1.top, area2.top) - safeDistantion,
  right: Math.max(area1.top, area2.right) + safeDistantion,
  bottom: Math.max(area1.bottom, area2.bottom) + safeDistantion
})

const areSegmentsCrossing = (segment1: Segment, segment2: Segment) => {
  const x1 = segment1.point1.x
  const y1 = segment1.point1.y
  const x2 = segment1.point2.x
  const y2 = segment1.point2.y

  const x3 = segment2.point1.x
  const y3 = segment2.point1.y
  const x4 = segment2.point2.x
  const y4 = segment2.point2.y

  const f = (x: number, y: number) => (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)

  const g = (x: number, y: number) => (x - x3) * (y4 - y3) - (y - y3) * (x4 - x3)

  return (f(x3, y3) * f(x4, y4) < 0) && (g(x1, y1) * g(x2, y2) < 0)
}

const isSegmentCrossingArea = (segment: Segment, area: Area) => {
  const topLeft = newPoint(area.left, area.top)
  const topRight = newPoint(area.right, area.top)
  const bottomRight = newPoint(area.right, area.bottom)
  const bottomLeft = newPoint(area.left, area.bottom)

  return areSegmentsCrossing(segment, newSegment(topLeft, topRight)) ||
    areSegmentsCrossing(segment, newSegment(topRight, bottomRight)) ||
    areSegmentsCrossing(segment, newSegment(bottomRight, bottomLeft)) ||
    areSegmentsCrossing(segment, newSegment(bottomLeft, topLeft))
}

const isWayClear = (srcPoint: Point, targetPoint: Point, impassableAreas: Array<Area>) => {
  return !impassableAreas.map(
    area => isSegmentCrossingArea(newSegment(srcPoint, targetPoint), area)
  ).reduce((a, v) => a || v, false)
}

const getMiddleSegments = (middlePoint: Point, borderArea: Area, impassableAreas: Array<Area>) : Array<Segment> => {
  const topPoint = newPoint(middlePoint.x, borderArea.top)
  const rightPoint = newPoint(borderArea.right, middlePoint.y)
  const bottomPoint = newPoint(middlePoint.x, borderArea.bottom)
  const leftPoint = newPoint(borderArea.left, middlePoint.y)

  const topIsClear = isWayClear(middlePoint, topPoint, impassableAreas)
  const rightIsClear = isWayClear(middlePoint, rightPoint, impassableAreas)
  const bottomIsClear = isWayClear(middlePoint, bottomPoint, impassableAreas)
  const leftIsClear = isWayClear(middlePoint, leftPoint, impassableAreas)

  return [
    ...(topIsClear ? [newSegment(middlePoint, topPoint)] : []),
    ...(rightIsClear ? [newSegment(middlePoint, rightPoint)] : []),
    ...(bottomIsClear ? [newSegment(middlePoint, bottomPoint)] : []),
    ...(leftIsClear ? [newSegment(middlePoint, leftPoint)] : [])
  ]
}

const getPointDirections = (point: ConnectionPathPoint, entities: Map<number, Entity>) => {
  if (point instanceof FreeConnectionPoint || point instanceof IntermediateConnectionPoint) {

  } else if (point instanceof ConnectionAreaPoint) {
    const relatedEntity = entities.get(point.entityId)
    relatedEntity.connectionAreaCreators[point.areaId](relatedEntity).directions
  } else if (point instanceof EntityConnectionPoint) {
    
  }
}

export const getIntermediatePoints = (
  beginPoint: ConnectionPathPoint,
  endPoint: ConnectionPathPoint,
  entities: Map<number, Entity>
): Array<IntermediateConnectionPoint> => {
  const beginImpassableArea = getRelatedImpassableArea(beginPoint, endPoint, entities)
  const endImpassabelArea = getRelatedImpassableArea(endPoint, beginPoint, entities)

  const areasMiddlePoint = getAreasMiddlePoint(beginImpassableArea, endImpassabelArea)
  const borderArea = getBorderArea(beginImpassableArea, endImpassabelArea)

  const middleSegments = getMiddleSegments(areasMiddlePoint, borderArea, [beginImpassableArea, endImpassabelArea])

  

  return []
}