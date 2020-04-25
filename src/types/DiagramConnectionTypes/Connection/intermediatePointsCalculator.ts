import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { FreeConnectionPoint } from '../ConnectionPathPoint/FreeConnectionPoint'
import { ConnectionDirection } from '../ConnectionDirection'
import { ConnectionAreaPoint } from '../ConnectionPathPoint/ConnectionAreaPoint'
import { Entity, ConnectionPoint } from '../..'
import { EntityConnectionPoint } from '../ConnectionPathPoint/EntityConnectionPoint'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'
import { Point, Segment, newSegment, newPoint } from '../../geometry'

const safeDistantion = 5

interface Area {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface MapPoint extends Point {
  length: number;
  cost: number;
}

const newArea = (x: number, y: number, width: number, height: number): Area => ({
  left: x,
  top: y,
  right: x + width,
  bottom: y + height
})

const getRelatedImpassableArea = (
  point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>
): Area | null => {
  if (point instanceof FreeConnectionPoint || point instanceof IntermediateConnectionPoint) {
    return newArea(point.x, point.y, 0, 0)
  } else if (point instanceof ConnectionAreaPoint || point instanceof EntityConnectionPoint) {
    const relatedEntity = entities.get(point.entityId)
    return newArea(
      relatedEntity.x - safeDistantion,
      relatedEntity.y - safeDistantion,
      relatedEntity.width + safeDistantion * 2,
      relatedEntity.height + safeDistantion * 2
    )
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
  left: Math.min(area1.left, area2.left) - 0.001,
  top: Math.min(area1.top, area2.top) - 0.001,
  right: Math.max(area1.right, area2.right) + 0.001,
  bottom: Math.max(area1.bottom, area2.bottom) + 0.001
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
  ).reduce((a, v) => a || v, false)
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
      const closestAreaPoint = getClosestAreaPoint(srcPoint, targetPoint, area)
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
  impassableAreas: Array<Area>): Segment => {
  const directions = getPointDirections(point, oppositePoint, entities)

  if (directions.length !== 1) return null

  const srcPoint = newPoint(point.getX(oppositePoint, entities), point.getY(oppositePoint, entities))

  const topPoint = newPoint(srcPoint.x, borderArea.top)
  const rightPoint = newPoint(borderArea.right, srcPoint.y)
  const bottomPoint = newPoint(srcPoint.x, borderArea.bottom)
  const leftPoint = newPoint(borderArea.left, srcPoint.y)

  if (directions.indexOf(ConnectionDirection.Top) >= 0) return newSegment(newPoint(srcPoint.x, srcPoint.y - safeDistantion), getEndWayPoint(srcPoint, topPoint, impassableAreas))
  if (directions.indexOf(ConnectionDirection.Right) >= 0) return newSegment(newPoint(srcPoint.x + safeDistantion, srcPoint.y), getEndWayPoint(srcPoint, rightPoint, impassableAreas))
  if (directions.indexOf(ConnectionDirection.Bottom) >= 0) return newSegment(newPoint(srcPoint.x, srcPoint.y + safeDistantion), getEndWayPoint(srcPoint, bottomPoint, impassableAreas))
  if (directions.indexOf(ConnectionDirection.Left) >= 0) return newSegment(newPoint(srcPoint.x - safeDistantion, srcPoint.y), getEndWayPoint(srcPoint, leftPoint, impassableAreas))
}

const getTerminalIntermediatePoint = (point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>) => {
  const possibleDirections = getPointDirections(point, oppositePoint, entities)

  const deltaX = (() => {
    if (possibleDirections.length > 1) return 0
    if (possibleDirections.indexOf(ConnectionDirection.Right) >= 0) return safeDistantion + 0.001
    else if (possibleDirections.indexOf(ConnectionDirection.Left) >= 0) return -safeDistantion - 0.001
    else return 0
  })()

  const deltaY = (() => {
    if (possibleDirections.length > 1) return 0
    if (possibleDirections.indexOf(ConnectionDirection.Bottom) >= 0) return safeDistantion + 0.001
    else if (possibleDirections.indexOf(ConnectionDirection.Top) >= 0) return -safeDistantion - 0.001
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
  if (segment1 === null || segment2 === null) return null
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

const isWayValid = (way: Array<Point>) => {
  return !way.map(
    (point, index) => index !== way.length - 1 ? (Math.abs(point.x - way[index + 1].x) > 0.01 && Math.abs(point.y - way[index + 1].y) > 0.01) : false
  ).reduce(
    (a, v) => a || v
  )
}

const getWayLength = (way: Array<Point>): number => {
  return Math.floor(way.map(
    (point, index) => index !== way.length - 1 ? getDistance(point, way[index + 1]) : 0
  ).reduce(
    (wayLength, segmentLength) => wayLength + segmentLength
  ) * 1000) / 1000
}

const getShortestWays = (ways: Array<Array<Point>>) => {
  const shortestLength = Math.min(...ways.map(way => getWayLength(way)))

  return ways.filter(way => (getWayLength(way) <= shortestLength + 0.01))
}

const arePointsStraight = (point1: Point, point2: Point, point3: Point) => {
  const x1 = point1.x
  const y1 = point1.y
  const x2 = point2.x
  const y2 = point2.y
  const x3 = point3.x
  const y3 = point3.y

  const precision = 0.001

  if (Math.abs(x1 - x2) < precision && Math.abs(x2 - x3) < precision) return true

  if (Math.abs(y1 - y2) < precision && Math.abs(y2 - y3) < precision) return true

  const a = (x1 - x2) / (y1 - y2)

  const b = (x2 - x3) / (y2 - y3)

  return (a - b < precision) && ((x1 - x2) * (x2 - x3) >= precision) && ((y1 - y2) * (y2 - y3) >= precision)
}

const getWayTurnsAmount = (way: Array<Point>): number => {
  if (way.length < 3) return 0

  return way.map((point, index) => {
    if (index < way.length - 2) {
      if (arePointsStraight(point, way[index + 1], way[index + 2])) return 0 + 0
      else return 1 + 0
    } else return 0 + 0
  }).reduce((a, v) => a + v)
}

const getStraightestWays = (ways: Array<Array<Point>>): Array<Array<Point>> => {
  const minTurnsAmount = Math.min(...ways.map(way => getWayTurnsAmount(way)))

  return ways.filter(way => getWayTurnsAmount(way) === minTurnsAmount)
}

const getAreaBorderLines = (
  area: Area,
  borderArea: Area,
  impassableAreas: Array<Area>) => {

  const topLeft = newPoint(area.left - 0.001, area.top - 0.001)
  const topRight = newPoint(area.right + 0.001, area.top - 0.001)
  const bottomRight = newPoint(area.right + 0.001, area.bottom + 0.001)
  const bottomLeft = newPoint(area.left - 0.001, area.bottom + 0.001)

  const topLine = newSegment(
    getEndWayPoint(topRight, newPoint(borderArea.left, area.top - 0.001), impassableAreas),
    getEndWayPoint(topLeft, newPoint(borderArea.right, area.top - 0.001), impassableAreas)
  )

  const rightLine = newSegment(
    getEndWayPoint(bottomRight, newPoint(area.right + 0.001, borderArea.top), impassableAreas),
    getEndWayPoint(topRight, newPoint(area.right + 0.001, borderArea.bottom), impassableAreas)
  )

  const bottomLine = newSegment(
    getEndWayPoint(bottomLeft, newPoint(borderArea.right, area.bottom + 0.001), impassableAreas),
    getEndWayPoint(bottomRight, newPoint(borderArea.left, area.bottom + 0.001), impassableAreas)
  )

  const leftLine = newSegment(
    getEndWayPoint(topLeft, newPoint(area.left - 0.001, borderArea.bottom), impassableAreas),
    getEndWayPoint(bottomLeft, newPoint(area.left - 0.001, borderArea.top), impassableAreas)
  )

  return [
    topLine,
    rightLine,
    bottomLine,
    leftLine
  ]
}

const getFirstBorderLine = (beginLine: Segment, borderLines: Array<Segment>): Segment => {
  return borderLines.reduce((a, v) => {
    if (getVerticcalHorizontalSegmentsIntersection(v, beginLine)) return v
    return a
  })
}

const getSecondBorderLines = (firstBorderLine: Segment, borderLines: Array<Segment>): Array<Segment> => {
  return borderLines.filter(line =>
    (getVerticcalHorizontalSegmentsIntersection(line, firstBorderLine) !== null &&
      (
        firstBorderLine.point1.x !== line.point1.x ||
        firstBorderLine.point1.y !== line.point1.y ||
        firstBorderLine.point2.x !== line.point2.x ||
        firstBorderLine.point2.y !== line.point2.y
      )
    )
  )
}

export const getIntermediatePoints = (
  beginPoint: ConnectionPathPoint,
  endPoint: ConnectionPathPoint,
  entities: Map<number, Entity>
): Array<IntermediateConnectionPoint> => {
  const beginXYPoint = newPoint(beginPoint.getX(endPoint, entities), beginPoint.getY(endPoint, entities))
  const endXYPoint = newPoint(endPoint.getX(beginPoint, entities), endPoint.getY(beginPoint, entities))

  const beginImpassableArea = getRelatedImpassableArea(beginPoint, endPoint, entities)
  const endImpassabelArea = getRelatedImpassableArea(endPoint, beginPoint, entities)

  const impassableAreas = [beginImpassableArea, endImpassabelArea].filter(area => area !== null)

  const areasMiddlePoint = getAreasMiddlePoint(beginImpassableArea, endImpassabelArea)
  const borderArea = getBorderArea(beginImpassableArea, endImpassabelArea)

  const beginTerminalPoint = getTerminalIntermediatePoint(beginPoint, endPoint, entities)
  const endTerminalPoint = getTerminalIntermediatePoint(endPoint, beginPoint, entities)

  const beginSegment = getDirectionSegment(beginPoint, endPoint, entities, borderArea, impassableAreas)
  const endSegment = getDirectionSegment(endPoint, beginPoint, entities, borderArea, impassableAreas)
  const middleSegments = getExitSegments(areasMiddlePoint, borderArea, impassableAreas, true)
  const beginAreaBorderLines = getAreaBorderLines(beginImpassableArea, borderArea, impassableAreas)
  const endAreaBorderLines = getAreaBorderLines(endImpassabelArea, borderArea, impassableAreas)
  const beginFirstBorderLine = getFirstBorderLine(beginSegment, beginAreaBorderLines)
  const beginSecondBorderLines = getSecondBorderLines(beginFirstBorderLine, beginAreaBorderLines)
  const endFirstBorderLine = getFirstBorderLine(endSegment, endAreaBorderLines)
  const endSecondBorderLines = getSecondBorderLines(endFirstBorderLine, endAreaBorderLines)

  //return pointsToIntermediatePoints(getSegmentsEndPoints(endAreaBorderLines))

  let possibleWays: Array<Array<Point>> = []

  const addWay = (way: Array<Point>) => {
    for (const pt of way) {
      if (pt === null || pt === undefined) return
    }

    const wayIsClear = (() => {
      if (way.length === 0) {
        return isWayClear(beginTerminalPoint, endTerminalPoint, impassableAreas)
      }
      const begin = isWayClear(beginTerminalPoint, way[0], impassableAreas)

      const end = isWayClear(endTerminalPoint, way[way.length - 1], impassableAreas)

      const wayClear = way.map((v, i) => i === way.length - 1 ? true : isWayClear(v, way[i + 1], impassableAreas))
        .reduce((a, v) => a && v)

      return begin && end && wayClear
    })()

    if (wayIsClear) {
      possibleWays.push([
        beginTerminalPoint,
        ...way,
        endTerminalPoint
      ])
    }
  }

  if (isWayClear(beginXYPoint, endXYPoint, impassableAreas) && isWayValid([beginXYPoint, endXYPoint])) return []

  const beginEndIntersection = getVerticcalHorizontalSegmentsIntersection(beginSegment, endSegment)

  addWay([beginEndIntersection])

  const beginMiddleIntersections = getIntersections([beginSegment], middleSegments)
  const endMiddleIntersections = getIntersections([endSegment], middleSegments)

  addWay([
    beginMiddleIntersections[0],
    endMiddleIntersections[0],
  ])

  const beginFirstMiddleIntersections = getIntersections([beginFirstBorderLine], middleSegments)

  const endFirstMiddleIntersections = getIntersections([endFirstBorderLine], middleSegments)

  const beginSegmentEndFirstI = getVerticcalHorizontalSegmentsIntersection(beginSegment, endFirstBorderLine)

  const beginFirstEndSegmentI = getVerticcalHorizontalSegmentsIntersection(beginFirstBorderLine, endSegment)

  const beginFirstEndFirstI = getVerticcalHorizontalSegmentsIntersection(beginFirstBorderLine, endFirstBorderLine)



  addWay([
    beginFirstMiddleIntersections[0],
    endMiddleIntersections[0]
  ])

  addWay([
    beginFirstMiddleIntersections[0],
    endFirstMiddleIntersections[0]
  ])

  addWay([
    beginMiddleIntersections[0],
    endFirstMiddleIntersections[0]
  ])

  addWay([
    beginMiddleIntersections[0],
    endFirstMiddleIntersections[0]
  ])

  addWay([
    beginSegmentEndFirstI
  ])

  addWay([
    beginFirstEndSegmentI
  ])

  addWay([
    beginFirstEndFirstI
  ])

  beginSecondBorderLines.forEach(line => {
    const beginFirstLineI = getVerticcalHorizontalSegmentsIntersection(line, beginFirstBorderLine)
    const middleLineIs = getIntersections(middleSegments, [line])
    const endSegmentLineI = getVerticcalHorizontalSegmentsIntersection(endSegment, line)
    const endFirstLineI = getVerticcalHorizontalSegmentsIntersection(endFirstBorderLine, line)

    addWay([
      beginFirstLineI,
      endSegmentLineI
    ])

    addWay([
      beginFirstLineI,
      endSegmentLineI
    ])

    addWay([
      beginFirstLineI,
      middleLineIs[0],
      endMiddleIntersections[0]
    ])

    addWay([
      beginFirstLineI,
      endFirstLineI
    ])
  })

  endSecondBorderLines.forEach(line => {
    const endFirstLineI = getVerticcalHorizontalSegmentsIntersection(line, endFirstBorderLine)
    const middleLineIs = getIntersections(middleSegments, [line])

    addWay([
      beginMiddleIntersections[0],
      middleLineIs[0],
      endFirstLineI
    ])

    addWay([
      beginFirstMiddleIntersections[0],
      middleLineIs[0],
      endFirstLineI
    ])
  })

  endAreaBorderLines.forEach(line => {
    addWay([getVerticcalHorizontalSegmentsIntersection(line, beginSegment)])
  })

  const ppWays = possibleWays.map(way => [
    beginXYPoint,
    ...way,
    endXYPoint,
  ]).filter(way => isWayValid(way))

  const shortWays = getShortestWays(ppWays)

  const straightWays = getStraightestWays(shortWays)

  if (straightWays.length === 0) {
    return [
      new IntermediateConnectionPoint(endXYPoint.x, beginXYPoint.y, false)
    ]
  }

  const result = (straightWays[0]).map((point, index, srcArray) => {
    if (index !== 0) {
      return new IntermediateConnectionPoint(
        point.x, point.y, false
      )
    } else {
      return null
    }
  }).filter(p => p !== null)

  while (result[result.length - 1].getX(beginPoint, entities) === endPoint.getX(beginPoint, entities) &&
    result[result.length - 1].getY(beginPoint, entities) === endPoint.getY(beginPoint, entities)
  ) {
    result.pop()
  }

  const result2 = result.filter((point, index) => {
    if (index !== 0) {
      if (Math.abs(point.x - result[index - 1].x) < 0.001 &&
      Math.abs(point.y - result[index - 1].y) < 0.001) {
        return false
      }
      return true
    }
    return true
  })


  const result3 = result2.filter((point, index) => {
    if (index !== 0 && index !== result2.length - 1) {
      return !(
        Math.abs(result2[index - 1].x - result2[index + 1].x) < 0.001 || 
        Math.abs(result2[index - 1].y - result2[index + 1].y) < 0.001)
    }
    return true
  })
  return result3
}