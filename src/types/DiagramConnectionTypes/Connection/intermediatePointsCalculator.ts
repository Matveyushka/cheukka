//THIS MODULE IS AWFUl
//IT SHOULD BE REWRITTEN (IT WON'T BE)

import { ConnectionPathPoint } from '../ConnectionPathPoint'
import { FreeConnectionPoint } from '../ConnectionPathPoint/FreeConnectionPoint'
import { ConnectionDirection } from '../ConnectionDirection'
import { ConnectionAreaPoint } from '../ConnectionPathPoint/ConnectionAreaPoint'
import { Entity } from '../..'
import { EntityConnectionPoint } from '../ConnectionPathPoint/EntityConnectionPoint'
import { getEntityConnectionClosestPoint, getTheClosestConnectionAreaId } from '../../../utils/geometry'
import { IntermediateConnectionPoint } from '../ConnectionPathPoint/IntermediateConnectionPoint'
import { ConnectionArea } from '../ConnectionArea'

const getPointDirections = (
  point: ConnectionPathPoint,
  oppositePoint: ConnectionPathPoint,
  entities: Map<number, Entity>
) => {
  if (point instanceof FreeConnectionPoint) {
    return [
      ConnectionDirection.Top,
      ConnectionDirection.Right,
      ConnectionDirection.Bottom,
      ConnectionDirection.Left,
    ]
  } else if (point instanceof ConnectionAreaPoint) {
    const relatedEntity = entities.get(point.entityId)
    return relatedEntity.connectionAreaCreators[point.areaId](relatedEntity).directions
  } else if (point instanceof EntityConnectionPoint) {
    const relatedEntity = entities.get(point.entityId)
    const closestPoint = getEntityConnectionClosestPoint(oppositePoint, relatedEntity, entities)
    const closestAreaId = getTheClosestConnectionAreaId(oppositePoint, relatedEntity, entities)

    if (closestPoint) {
      return closestPoint.directions
    } else {
      return relatedEntity.connectionAreaCreators[closestAreaId](relatedEntity).directions
    }
  } else if (point instanceof IntermediateConnectionPoint) {
    return [point.direction]
  }
}

const areCrossing = (
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
) => {
  const f = (x: number, y: number) => (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
  const g = (x: number, y: number) => (x - x3) * (y4 - y3) - (y - y3) * (x4 - x3)

  return f(x3, y3) * f(x4, y4) < 0 && g(x1, y1) * g(x2, y2) < 0
}


const isWayClear = (
  firstPoint: ConnectionPathPoint,
  secondPoint: ConnectionPathPoint,
  entities: Map<number, Entity>
) => {
  const firstX = firstPoint.getX(secondPoint, entities)
  const firstY = firstPoint.getY(secondPoint, entities)
  const secondX = secondPoint.getX(firstPoint, entities)
  const secondY = secondPoint.getY(firstPoint, entities)

  return !Array.from(entities.entries()).map(
    (entrie) => {
      const left = entrie[1].x
      const right = entrie[1].x + entrie[1].width
      const top = entrie[1].y
      const bottom = entrie[1].y + entrie[1].height

      return areCrossing(firstX, firstY, secondX, secondY, left, top, right, top) ||
        areCrossing(firstX, firstY, secondX, secondY, right, top, right, bottom) ||
        areCrossing(firstX, firstY, secondX, secondY, right, bottom, left, bottom) ||
        areCrossing(firstX, firstY, secondX, secondY, left, bottom, left, top)
    }
  ).reduce((a, v) => a || v)
}

const getEntityCornerPoints = (entity: Entity) => [
  { x: entity.x - 5, y: entity.y - 5 },
  { x: entity.x + entity.width + 5, y: entity.y - 5 },
  { x: entity.x + entity.width + 5, y: entity.height + entity.y + 5 },
  { x: entity.x - 5, y: entity.height + entity.y + 5 },
]

const getBypassIntermediatePoints = (
  beginPoint: ConnectionPathPoint,
  endPoint: ConnectionPathPoint,
  entities: Map<number, Entity>
) => {
  const firstX = beginPoint.getX(endPoint, entities)
  const firstY = beginPoint.getY(endPoint, entities)
  const secondX = endPoint.getX(beginPoint, entities)
  const secondY = endPoint.getY(beginPoint, entities)

  const bypassBeginPoints = (() => {
    if (beginPoint instanceof FreeConnectionPoint || beginPoint instanceof IntermediateConnectionPoint) {
      return []
    } else if (beginPoint instanceof ConnectionAreaPoint || beginPoint instanceof EntityConnectionPoint) {
      return getEntityCornerPoints(entities.get(beginPoint.entityId))
    }
  })()

 const bypassEndPoints = (() => {
    if (endPoint instanceof FreeConnectionPoint || endPoint instanceof IntermediateConnectionPoint) {
      return []
    } else if (endPoint instanceof ConnectionAreaPoint || endPoint instanceof EntityConnectionPoint) {
      return getEntityCornerPoints(entities.get(endPoint.entityId))
    }
  })()

  const points = [
    { x: firstX, y: firstY },
    ...bypassBeginPoints,
    ...bypassEndPoints,
    { x: secondX, y: secondY },
  ]

  const pointsWithLength = points.map((point, index) => ({
    length: (index === 0 ? 0 : 99999),
    x: point.x,
    y: point.y,
  }))

  const getDistance = (p1: FreeConnectionPoint, p2: FreeConnectionPoint) => {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  }

  const nextStep = (pwl: Array<{ length: number, x: number, y: number }>, remainSteps: number) : Array<{ length: number, x: number, y: number }> => {
    if (remainSteps === 0) return pwl

    const DEBUG = (point1: { x: number, y: number, length: number }, index1: number) => {
      const RESULT = Math.min(...pwl.map((point2, index2) => {
        if (index1 === index2) return point1.length

        const c1 = new FreeConnectionPoint(point1.x, point1.y)
        const c2 = new FreeConnectionPoint(point2.x, point2.y)

        if (isWayClear(c1, c2, entities)) {
          const distance = getDistance(c1, c2)

          if (point2.length + distance < point1.length) {
            return point2.length + distance
          } else return point1.length
        } else return point1.length

      }))

      return RESULT
    }

    const nextArray = pwl.map((point1, index1) => ({
      length: DEBUG(point1, index1),
      x: point1.x,
      y: point1.y
    }))

    return nextStep(
      nextArray,
      remainSteps - 1,
    )
  }

  const lengthedPoints = nextStep(pointsWithLength, 20)

  const whereIsDeWay = (currentPoint: number, deWay: Array<IntermediateConnectionPoint>) : Array<IntermediateConnectionPoint>=> {
    if (currentPoint === 0) return deWay
    
    const mapp = lengthedPoints.map((point: any, index: any) => {
      if (index === currentPoint) return 99999

      const c1 = new FreeConnectionPoint(lengthedPoints[currentPoint].x, lengthedPoints[currentPoint].y)
      const c2 = new FreeConnectionPoint(point.x, point.y)

      if (isWayClear(c1, c2, entities)) {
        return point.length + getDistance(c1, c2)
      } else return 99999
    })

    const indexOfmin = mapp.indexOf(Math.min(...mapp))

    return whereIsDeWay(indexOfmin, [...deWay, new IntermediateConnectionPoint(
      lengthedPoints[indexOfmin].x,
      lengthedPoints[indexOfmin].y,
      false,
      lengthedPoints[indexOfmin].y > lengthedPoints[currentPoint].y ?
      ConnectionDirection.Bottom :
      lengthedPoints[indexOfmin].y < lengthedPoints[currentPoint].y ?
      ConnectionDirection.Top :
      lengthedPoints[indexOfmin].x > lengthedPoints[currentPoint].x ?
      ConnectionDirection.Right :
      ConnectionDirection.Left,
    )])
  }

  const rrrr = whereIsDeWay(lengthedPoints.length - 1, [])


  return rrrr.slice(0, rrrr.length - 1).reverse()
}

export const getIntermediatePoints = (
  firstPoint: ConnectionPathPoint,
  secondPoint: ConnectionPathPoint,
  entities: Map<number, Entity>
) => {
  const firstPointDirections = getPointDirections(firstPoint, secondPoint, entities)
  const secondPointDirections = getPointDirections(secondPoint, firstPoint, entities)

  const firstX = firstPoint.getX(secondPoint, entities)
  const firstY = firstPoint.getY(secondPoint, entities)
  const secondX = secondPoint.getX(firstPoint, entities)
  const secondY = secondPoint.getY(firstPoint, entities)

  const firstIsHorizontal = firstPointDirections.indexOf(ConnectionDirection.Right) >= 0 ||
    firstPointDirections.indexOf(ConnectionDirection.Left) >= 0

  const firstIsVertical = firstPointDirections.indexOf(ConnectionDirection.Top) >= 0 ||
    firstPointDirections.indexOf(ConnectionDirection.Bottom) >= 0

  const secondIsHorizontal = secondPointDirections.indexOf(ConnectionDirection.Right) >= 0 ||
    secondPointDirections.indexOf(ConnectionDirection.Left) >= 0

  const secondIsVertical = secondPointDirections.indexOf(ConnectionDirection.Top) >= 0 ||
    secondPointDirections.indexOf(ConnectionDirection.Bottom) >= 0

  if (!isWayClear(firstPoint, secondPoint, entities)) {

    const bypass = getBypassIntermediatePoints(firstPoint, secondPoint, entities)

    const preBypass = new IntermediateConnectionPoint(
      firstPointDirections.indexOf(ConnectionDirection.Left) >= 0 ?
      firstX - 5 : 
      firstPointDirections.indexOf(ConnectionDirection.Right) >= 0 ?
      firstX + 5 :
      firstX,
      firstPointDirections.indexOf(ConnectionDirection.Top) >= 0 ?
      firstY - 5 : 
      firstPointDirections.indexOf(ConnectionDirection.Bottom) >= 0 ?
      firstY + 5 :
      firstY,
      false,
      firstPointDirections[0]
    )

    const postBypass = new IntermediateConnectionPoint(
      secondPointDirections.indexOf(ConnectionDirection.Left) >= 0 ?
      secondX - 5 : 
      secondPointDirections.indexOf(ConnectionDirection.Right) >= 0 ?
      secondX + 5 :
      secondX,
      secondPointDirections.indexOf(ConnectionDirection.Top) >= 0 ?
      secondY - 5 : 
      secondPointDirections.indexOf(ConnectionDirection.Bottom) >= 0 ?
      secondY + 5 :
      secondY,
      false,
      secondPointDirections[0]
    )

    const preFull = [
      preBypass,
      ...bypass,
      postBypass
    ]

    const turnIndex = (() => {
      let result = -1
      preFull.forEach((v, i) => {

        if (i < preFull.length - 1) {
          if (Math.abs((preFull[i].x - preFull[i + 1].x) * (preFull[i].y - preFull[i + 1].y)) > 0.01) {
            result = i
          }
        }
      })
      return result
    })()

    if (turnIndex < 0 )
    {
      return preFull
    } else {
      const p1 = preFull.slice(0, turnIndex + 1)
      const p3 = preFull.slice(turnIndex + 1, preFull.length)
     const p2 : any = getIntermediatePoints(preFull[turnIndex], preFull[turnIndex + 1], entities)
      return [
        preBypass,
        ...p1, 
        ...p2, 
        ...p3,
        postBypass
      ]
    }

  }

  const condition = (
    (firstPointDirections.indexOf(ConnectionDirection.Right) >= 0 && secondPointDirections.indexOf(ConnectionDirection.Left) >= 0) ||
    (firstPointDirections.indexOf(ConnectionDirection.Left) >= 0 && secondPointDirections.indexOf(ConnectionDirection.Right) >= 0) ||
    (firstPointDirections.indexOf(ConnectionDirection.Top) >= 0 && secondPointDirections.indexOf(ConnectionDirection.Bottom) >= 0) ||
    (firstPointDirections.indexOf(ConnectionDirection.Bottom) >= 0 && secondPointDirections.indexOf(ConnectionDirection.Top) >= 0)
  )

  if (condition) {
    if (firstIsHorizontal) {
      return [
        new IntermediateConnectionPoint(firstX + (secondX - firstX) / 2, firstY, false,
          secondX > firstX ? ConnectionDirection.Right : ConnectionDirection.Left
        ),
        new IntermediateConnectionPoint(firstX + (secondX - firstX) / 2, secondY, false,
          secondY > firstY ? ConnectionDirection.Bottom : ConnectionDirection.Top
        )
      ]
    } else {
      return [
        new IntermediateConnectionPoint(firstX, firstY + (secondY - firstY) / 2, false,
          secondY > firstY ? ConnectionDirection.Bottom : ConnectionDirection.Top
        ),
        new IntermediateConnectionPoint(secondX, firstY + (secondY - firstY) / 2, false,
          secondX > firstX ? ConnectionDirection.Right : ConnectionDirection.Left
        )
      ]
    }
  } else {
    if (firstIsHorizontal) {
      return [
        new IntermediateConnectionPoint(secondX, firstY, false,
          secondX > firstX ? ConnectionDirection.Right : ConnectionDirection.Left
        )
      ]
    } else {
      return [
        new IntermediateConnectionPoint(firstX, secondY, false,
          secondY > firstY ? ConnectionDirection.Bottom : ConnectionDirection.Top
        )
      ]
    }
  }
}