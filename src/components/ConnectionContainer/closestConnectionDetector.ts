import { getTheClosestSegmentPointToFreePoint, getPointsDistance } from '../../utils/geometry'
import { Connection, ConnectionPathPoint } from '../../types'
import { Segment, newSegment, newPoint, Point } from '../../types/geometry'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'

export const useConnectionDistanceCalculator = () => {
  const [connections, entities] = useSelector((state: Store) => [
    state.diagramConnections,
    state.diagramEntities,])


  const getPointFromPathPoint = (srcPoint: ConnectionPathPoint, oppositePoint: ConnectionPathPoint) => newPoint(
    srcPoint.getX(oppositePoint), srcPoint.getY(oppositePoint)
  )

  const getConnectionSegments = (connection: Connection): Array<Segment> => {
    const beginPoint = newPoint(
      connection.begin.getX(connection.end),
      connection.begin.getY(connection.end)
    )
    const endPoint = newPoint(
      connection.end.getX(connection.begin),
      connection.end.getY(connection.begin)
    )

    if (connection.intermediatePoints.length === 0) {
      return [newSegment(beginPoint, endPoint)]
    } else {
      const firstSegment = newSegment(beginPoint, getPointFromPathPoint(
        connection.intermediatePoints[0], connection.begin
      ))

      const lastSegment = newSegment(getPointFromPathPoint(
        connection.intermediatePoints[connection.intermediatePoints.length - 1], connection.end
      ), endPoint)

      const intermediateSegments = (() => {
        if (connection.intermediatePoints.length === 1) {
          return []
        } else {
          return connection.intermediatePoints.map((_, index, arr) => {
            if (index === connection.intermediatePoints.length - 1) {
              return null
            } else {
              return newSegment(
                getPointFromPathPoint(arr[index], connection.begin),
                getPointFromPathPoint(arr[index + 1], connection.end),
              )
            }
          }).filter(segment => segment !== null)
        }
      })()

      const result = [
        firstSegment,
        ...intermediateSegments,
        lastSegment,
      ]
      return result
    }
  }

  const getFreePointToConnectionDistance = (freePoint: Point, connection: Connection) => {
    const connectionSegments = getConnectionSegments(connection)

    return connectionSegments.map(segment => getPointsDistance(
      freePoint,
      getTheClosestSegmentPointToFreePoint(freePoint, segment.point1, segment.point2)
    )).reduce((a, v) => v < a ? v : a)
  }

  const getTheClosestConnectionId = (x: number, y: number) => {
    const connectionWithDistances = Array.from(connections.entries()).map(connection => ({
      id: connection[0],
      distance: getFreePointToConnectionDistance(newPoint(x, y), connection[1])
    }))
    return connectionWithDistances.reduce((a, v) => v.distance < a.distance ? v : a).id
  }

  const getTheClosestConnectionSegmentPointsId = (x: number, y: number, connection: Connection) => {
    const freePoint = newPoint(x, y)
    const segments = getConnectionSegments(connection)

    const distances = segments.map((segment, index) => ({
      index,
      distance: getPointsDistance(
        freePoint,
        getTheClosestSegmentPointToFreePoint(freePoint, segment.point1, segment.point2)
      )
    }))

    const firstIndex = distances.reduce((a, v) => v.distance < a.distance ? v : a).index - 1

    return [firstIndex, firstIndex + 1]
  }

  return {
    getTheClosestConnectionId,
    getTheClosestConnectionSegmentPointsId
  }
}


