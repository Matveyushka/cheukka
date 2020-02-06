import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { FreeConnectionPoint } from '../ConnectionPathPoint/FreeConnectionPoint'
import { ConnectionDirection } from '../ConnectionDirection'
import { ConnectionAreaPoint } from '../ConnectionPathPoint/ConnectionAreaPoint'
import { Entity, ConnectionPoint } from '../..'
import { EntityConnectionPoint } from '../ConnectionPathPoint/EntityConnectionPoint'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'

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

interface MapPoint extends Point {
  length: number;
  cost: number;
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
  if (begin1 <= begin2 && end1 >= begin2 && end1 <= end2) { return begin2 + (end1 - begin2) / 2 }
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
  right: Math.max(area1.right, area2.right) + safeDistantion,
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

const areSegmentsTouching = (segment1: Segment, segment2: Segment) => {
  const x1 = segment1.point1.x
  const y1 = segment1.point1.y
  const x2 = segment1.point2.x
  const y2 = segment1.point2.y

  const x3 = segment2.point1.x
  const y3 = segment2.point1.y
  const x4 = segment2.point2.x
  const y4 = segment2.point2.y

  return (
    (x1 === x3 && x1 === x4 && ((y1 >= y4 && y1 <= y3) || (y1 >= y3 && y1 <= y4))) ||
    (x2 === x3 && x2 === x4 && ((y2 >= y4 && y2 <= y3) || (y2 >= y3 && y2 <= y4))) ||
    (x3 === x1 && x3 === x2 && ((y3 >= y2 && y3 <= y1) || (y3 >= y1 && y3 <= y2))) ||
    (x4 === x1 && x4 === x2 && ((y4 >= y2 && y4 <= y1) || (y4 >= y1 && y4 <= y2))) ||
    (y1 === y3 && y1 === y4 && ((x1 >= x4 && x1 <= x3) || (x1 >= x3 && x1 <= x4))) ||
    (y2 === y3 && y2 === y4 && ((x2 >= x4 && x2 <= x3) || (x2 >= x3 && x2 <= x4))) ||
    (y3 === y1 && y3 === y2 && ((x3 >= x2 && x3 <= x1) || (x3 >= x1 && x3 <= x2))) ||
    (y4 === y1 && y4 === y2 && ((x4 >= x2 && x4 <= x1) || (x4 >= x1 && x4 <= x2)))
  )
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
  ).reduce((a, v) => a || v, false) && (srcPoint.x === targetPoint.x || srcPoint.y === targetPoint.y)
}

const getClosestAreaPoint = (srcPoint: Point, targetPoint: Point, area: Area) => {
  if (srcPoint.x >= area.left && srcPoint.x <= area.right) {
    if (srcPoint.y >= area.bottom) {
      return newPoint(srcPoint.x, area.bottom)
    } else if (srcPoint.y <= area.top) {
      return newPoint(srcPoint.x, area.top)
    }
  }
  if (srcPoint.y <= area.bottom && srcPoint.y >= area.top) {
    if (srcPoint.x >= area.right) {
      return newPoint(area.right, srcPoint.y)
    } else if (srcPoint.x <= area.left) {
      return newPoint(area.left, srcPoint.y)
    }
  }
  return targetPoint
}

const getEndWayPoint = (srcPoint: Point, targetPoint: Point, impassableAreas: Array<Area>) => {
  if (isWayClear(srcPoint, targetPoint, impassableAreas)) { return targetPoint }

  const possiblePoints = impassableAreas.map(area => {
    if (isSegmentCrossingArea(newSegment(srcPoint, targetPoint), area)) {
      const closestAreaPoint = getClosestAreaPoint(srcPoint, targetPoint,area)
      return { point: closestAreaPoint, distance: getDistance(srcPoint, closestAreaPoint) }
    } else {
      return { point: targetPoint, distance: getDistance(srcPoint, targetPoint) }
    }
  })

  const minDistance = Math.min(...possiblePoints.map(pp => pp.distance))

  return possiblePoints.filter(pp => pp.distance === minDistance)[0].point
}

const getExitSegments = (middlePoint: Point, borderArea: Area, impassableAreas: Array<Area>, strictMode?: boolean): Array<Segment> => {
  const topPoint = newPoint(middlePoint.x, borderArea.top)
  const rightPoint = newPoint(borderArea.right, middlePoint.y)
  const bottomPoint = newPoint(middlePoint.x, borderArea.bottom)
  const leftPoint = newPoint(borderArea.left, middlePoint.y)

  const topClear = isWayClear(middlePoint, topPoint, impassableAreas)
  const rightClear = isWayClear(middlePoint, rightPoint, impassableAreas)
  const bottomClear = isWayClear(middlePoint, bottomPoint, impassableAreas)
  const leftClear = isWayClear(middlePoint, leftPoint, impassableAreas)

  const topSegment = newSegment(middlePoint, getEndWayPoint(middlePoint, topPoint, impassableAreas))
  const rightSegment = newSegment(middlePoint, getEndWayPoint(middlePoint, rightPoint, impassableAreas))
  const bottomSegment = newSegment(middlePoint, getEndWayPoint(middlePoint, bottomPoint, impassableAreas))
  const leftSegment = newSegment(middlePoint, getEndWayPoint(middlePoint, leftPoint, impassableAreas))

  return [
    ...((getSegmentsLength(topSegment) > safeDistantion && (!strictMode || topClear)) ? [topSegment] : []),
    ...((getSegmentsLength(rightSegment) > safeDistantion && (!strictMode || rightClear)) ? [rightSegment] : []),
    ...((getSegmentsLength(bottomSegment) > safeDistantion && (!strictMode || bottomClear)) ? [bottomSegment] : []),
    ...((getSegmentsLength(leftSegment) > safeDistantion && (!strictMode || leftClear)) ? [leftSegment] : []),
  ]
}

const getPointDirections = (point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>): Array<ConnectionDirection> => {
  if (point instanceof FreeConnectionPoint || point instanceof IntermediateConnectionPoint) {
    return [
      ConnectionDirection.Top,
      ConnectionDirection.Right,
      ConnectionDirection.Bottom,
      ConnectionDirection.Left
    ]
  } else if (point instanceof ConnectionAreaPoint) {
    const relatedEntity = entities.get(point.entityId)
    return relatedEntity.connectionAreaCreators[point.areaId](relatedEntity).directions
  } else if (point instanceof EntityConnectionPoint) {
    const relatedEntity = entities.get(point.entityId)
    let COSTYL: Array<ConnectionDirection> = []
    relatedEntity.connectionAreaCreators.forEach(creator => {
      const connectionArea = creator(relatedEntity)
      if (connectionArea instanceof ConnectionPoint &&
        relatedEntity.x + connectionArea.xBegin === point.getX(oppositePoint, entities) &&
        relatedEntity.y + connectionArea.yBegin === point.getY(oppositePoint, entities)) {
        COSTYL = connectionArea.directions
      }
    })
    return COSTYL
  }
}

const getDirectionSegment = (point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>,
  borderArea: Area,
  impassableAreas: Array<Area>): Array<Segment> => {
  const directions = getPointDirections(point, oppositePoint, entities)

  if (directions.length !== 1) return []

  const srcPoint = newPoint(point.getX(oppositePoint, entities), point.getY(oppositePoint, entities))

  const topPoint = newPoint(srcPoint.x, borderArea.top)
  const rightPoint = newPoint(borderArea.right, srcPoint.y)
  const bottomPoint = newPoint(srcPoint.x, borderArea.bottom)
  const leftPoint = newPoint(borderArea.left, srcPoint.y)

  if (directions.indexOf(ConnectionDirection.Top) >= 0) return [newSegment(newPoint(srcPoint.x, srcPoint.y - safeDistantion), getEndWayPoint(srcPoint, topPoint, impassableAreas))]
  if (directions.indexOf(ConnectionDirection.Right) >= 0) return [newSegment(newPoint(srcPoint.x + safeDistantion, srcPoint.y), getEndWayPoint(srcPoint, rightPoint, impassableAreas))]
  if (directions.indexOf(ConnectionDirection.Bottom) >= 0) return [newSegment(newPoint(srcPoint.x, srcPoint.y + safeDistantion), getEndWayPoint(srcPoint, bottomPoint, impassableAreas))]
  if (directions.indexOf(ConnectionDirection.Left) >= 0) return [newSegment(newPoint(srcPoint.x - safeDistantion, srcPoint.y), getEndWayPoint(srcPoint, leftPoint, impassableAreas))]
}

const getTerminalIntermediatePoint = (point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>) => {
  const possibleDirections = getPointDirections(point, oppositePoint, entities)

  const deltaX = (() => {
    if (possibleDirections.length > 1) return 0
    if (possibleDirections.indexOf(ConnectionDirection.Right) >= 0) return safeDistantion
    else if (possibleDirections.indexOf(ConnectionDirection.Left) >= 0) return -safeDistantion
    else return 0
  })()

  const deltaY = (() => {
    if (possibleDirections.length > 1) return 0
    if (possibleDirections.indexOf(ConnectionDirection.Bottom) >= 0) return safeDistantion
    else if (possibleDirections.indexOf(ConnectionDirection.Top) >= 0) return -safeDistantion
    else return 0
  })()

  return newPoint(
    point.getX(oppositePoint, entities) + deltaX,
    point.getY(oppositePoint, entities) + deltaY
  )
}

const getSegmentsEndPoints = (segments: Array<Segment>) => [...new Set([
  ...segments.map(segment => segment.point1),
  ...segments.map(segment => segment.point2)
])]

const pointsToIntermediatePoints = (points: Array<Point>) => {
  return points.map(
    point => new IntermediateConnectionPoint(point.x, point.y, false)
  )
}

const getVerticcalHorizontalSegmentsIntersection = (segment1: Segment, segment2: Segment) => {
  if (areSegmentsCrossing(segment1, segment2) || areSegmentsTouching(segment1, segment2)) {
    if (segment1.point1.y === segment1.point2.y && segment2.point1.x === segment2.point2.x) {
      return newPoint(segment2.point1.x, segment1.point1.y)
    } else if (segment1.point1.x === segment1.point2.x && segment2.point1.y === segment2.point2.y) {
      return newPoint(segment1.point1.x, segment2.point1.y)
    } else if (segment1.point1.x === segment1.point2.x) {
      return newPoint(segment1.point1.x, getMiddlePointInOneDimension(
        segment1.point1.y, segment1.point2.y, segment2.point1.y, segment2.point2.y
      ))
    } else if (segment1.point1.y === segment1.point2.y) {
      return newPoint(getMiddlePointInOneDimension(
        segment1.point1.x, segment1.point2.x, segment2.point1.x, segment2.point2.x
      ), segment1.point1.y)
    }
  } else {
    return null
  }
}

const getIntersections = (segments1: Array<Segment>, segments2: Array<Segment>) =>
  [].concat(...segments1.map(segment1 => segments2.map(
    segment2 => getVerticcalHorizontalSegmentsIntersection(segment1, segment2)).filter(point => point !== null)
  ))

const getDistance = (point1: Point, point2: Point) => {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2)
}

const getSegmentsLength = (segment: Segment) => {
  return getDistance(segment.point1, segment.point2)
}

const calculateMapPoints = (currentMapPoints: Array<MapPoint>, remainSteps: number, impassableAreas: Array<Area>): Array<MapPoint> => {
  if (remainSteps === 0) return currentMapPoints

  return calculateMapPoints(
    currentMapPoints.map(targetPoint => ({
      ...targetPoint,
      length: Math.min(...currentMapPoints.map(srcPoint => {
        if (isWayClear(srcPoint, targetPoint, impassableAreas) &&
          (srcPoint.x === targetPoint.x || srcPoint.y === targetPoint.y)) {
          if (srcPoint.length + getDistance(srcPoint, targetPoint) < targetPoint.length) {
            return srcPoint.length + getDistance(srcPoint, targetPoint)
          } else {
            return targetPoint.length
          }
        } else {
          return targetPoint.length
        }
      }))
    })), remainSteps - 1, impassableAreas)
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

  const beginTerminalPoint = getTerminalIntermediatePoint(beginPoint, endPoint, entities)
  const endTerminalPoint = getTerminalIntermediatePoint(endPoint, beginPoint, entities)

  const beginSegment = getDirectionSegment(beginPoint, endPoint, entities, borderArea, [beginImpassableArea, endImpassabelArea])
  const endSegment = getDirectionSegment(endPoint, beginPoint, entities, borderArea, [beginImpassableArea, endImpassabelArea])

  const middleSegments = getExitSegments(areasMiddlePoint, borderArea, [beginImpassableArea, endImpassabelArea], true)
  const beginTerminalSegments = getExitSegments(beginTerminalPoint, borderArea, [beginImpassableArea, endImpassabelArea])
  const endTerminalSegments = getExitSegments(endTerminalPoint, borderArea, [beginImpassableArea, endImpassabelArea])

  const beginEndPoints = getIntersections(beginSegment, endSegment)
  if (beginEndPoints.length > 0) return [(pointsToIntermediatePoints(beginEndPoints))[0]]

  const beginMiddlePoints = getIntersections(beginSegment, middleSegments)
  const endMiddlePoints = getIntersections(endSegment, middleSegments)
  if (beginMiddlePoints.length > 0 && endMiddlePoints.length > 0) return [
    pointsToIntermediatePoints(beginMiddlePoints)[0],
    pointsToIntermediatePoints(endMiddlePoints)[0],
  ]

  const beginTerminalEndPoints = getIntersections(beginTerminalSegments, endSegment)
  if (beginTerminalEndPoints.length > 0) return [
    pointsToIntermediatePoints([beginTerminalPoint])[0],
    pointsToIntermediatePoints(beginTerminalEndPoints)[0],
  ]

  const beginEndTerminalPoints = getIntersections(beginSegment, endTerminalSegments)
  if (beginEndTerminalPoints.length > 0) return [
    pointsToIntermediatePoints(beginEndTerminalPoints)[0],
    pointsToIntermediatePoints([endTerminalPoint])[0],
  ]

  const beginTerminalMiddlePoints = getIntersections(beginTerminalSegments, middleSegments)
  const middleEndTerminalPoints = getIntersections(middleSegments, endTerminalSegments)

  if (beginMiddlePoints.length > 0 && middleEndTerminalPoints.length > 0) return [
    pointsToIntermediatePoints(beginMiddlePoints)[0],
    pointsToIntermediatePoints(middleEndTerminalPoints)[0],
    pointsToIntermediatePoints([endTerminalPoint])[0],
  ]

  if (beginTerminalMiddlePoints.length > 0 && endMiddlePoints.length > 0) return [
    pointsToIntermediatePoints([beginTerminalPoint])[0],
    pointsToIntermediatePoints(beginTerminalMiddlePoints)[0],
    pointsToIntermediatePoints(endMiddlePoints)[0]
  ]

  const beginTerminalEndTerminalPoints = getIntersections(beginTerminalSegments, endTerminalSegments)

  if (beginTerminalEndTerminalPoints.length > 0) return [
    pointsToIntermediatePoints([beginTerminalPoint])[0],
    pointsToIntermediatePoints(beginTerminalEndTerminalPoints)[0],
    pointsToIntermediatePoints([endTerminalPoint])[0],
  ]

  if (beginTerminalMiddlePoints.length > 0 && middleEndTerminalPoints.length > 0) return [
    pointsToIntermediatePoints([beginTerminalPoint])[0],
    pointsToIntermediatePoints(beginTerminalMiddlePoints)[0],
    pointsToIntermediatePoints([areasMiddlePoint])[0],
    pointsToIntermediatePoints(middleEndTerminalPoints)[0],
    pointsToIntermediatePoints([endTerminalPoint])[0],
  ]

  const topBorderSegment = newSegment(newPoint(borderArea.left, borderArea.top), newPoint(borderArea.right, borderArea.top))
  const rightBorderSegment = newSegment(newPoint(borderArea.right, borderArea.top), newPoint(borderArea.right, borderArea.bottom))
  const bottomBorderSegment = newSegment(newPoint(borderArea.right, borderArea.bottom), newPoint(borderArea.left, borderArea.bottom))
  const leftBorderSegment = newSegment(newPoint(borderArea.left, borderArea.bottom), newPoint(borderArea.left, borderArea.top))

  for (const sideSegment of [topBorderSegment, rightBorderSegment, bottomBorderSegment, leftBorderSegment]) {
      const beginTerminalSidePoints = getIntersections(beginTerminalSegments, [sideSegment])
      const endTerminalSidePoints = getIntersections(endTerminalSegments, [sideSegment])

      if (beginTerminalMiddlePoints.length > 0) {
        const middleSidePoints = getIntersections(middleSegments, [sideSegment])
        if (middleSidePoints.length > 0 && endTerminalSidePoints.length > 0) return [
          pointsToIntermediatePoints([beginTerminalPoint])[0],
          pointsToIntermediatePoints(beginTerminalMiddlePoints)[0],
          pointsToIntermediatePoints(middleSidePoints)[0],
          pointsToIntermediatePoints(endTerminalSidePoints)[0],
          pointsToIntermediatePoints([endTerminalPoint])[0],
        ]
      }

      if (middleEndTerminalPoints.length > 0) {
        const middleSidePoints = getIntersections(middleSegments, [sideSegment])
        if (middleSidePoints.length > 0 && beginTerminalSidePoints.length > 0) return [
          pointsToIntermediatePoints([beginTerminalPoint])[0],
          pointsToIntermediatePoints(beginTerminalSidePoints)[0],
          pointsToIntermediatePoints(middleSidePoints)[0],
          pointsToIntermediatePoints(middleEndTerminalPoints)[0],
          pointsToIntermediatePoints([endTerminalPoint])[0],
        ]
      }

      if (beginTerminalSidePoints.length > 0 && endTerminalSidePoints.length > 0) {
        return [
          pointsToIntermediatePoints([beginTerminalPoint])[0],
          pointsToIntermediatePoints(beginTerminalSidePoints)[0],
          pointsToIntermediatePoints(endTerminalSidePoints)[0],
          pointsToIntermediatePoints([endTerminalPoint])[0],
        ]
      }
  }


  return pointsToIntermediatePoints(
    [
      //...getSegmentsEndPoints(beginTerminalSegments),
      ...getSegmentsEndPoints([topBorderSegment, rightBorderSegment, bottomBorderSegment, leftBorderSegment]),
    ]
  )
}