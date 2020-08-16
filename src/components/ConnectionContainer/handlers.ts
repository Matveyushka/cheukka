import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../../stores'
import { getCanvasX, getScale, getCanvasY } from '../../utils'
import { updateConnection, setMouseMode } from '../../actions'
import { useConnectionDistanceCalculator } from './closestConnectionDetector'
import { IntermediateConnectionPoint } from '../../types/DiagramConnectionTypes/ConnectionPathPoint/IntermediateConnectionPoint'
import { MouseMode } from '../../types'

export const useConnectionHandlers = (connectionId: number) => {
  const [scale, connections, entities] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramConnections,
    state.diagramEntities,])

  const connectionDistanceCalculator = useConnectionDistanceCalculator()

  const dispatch = useDispatch()

  const onMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    const x = getCanvasX(event, scale)
    const y = getCanvasY(event, scale)

    const theClosestConnectionId = connectionDistanceCalculator.getTheClosestConnectionId(x, y)

    const closestConnection = connections.get(theClosestConnectionId)

    const intermediatePoints = closestConnection.intermediatePoints
    
    const theClosestSegmentPointsId = connectionDistanceCalculator.
      getTheClosestConnectionSegmentPointsId(x, y, closestConnection)

    const firstPointX = theClosestSegmentPointsId[0] === -1 ?
    closestConnection.begin.getX(closestConnection.end) :
    intermediatePoints[theClosestSegmentPointsId[0]].x

    const firstPointY = theClosestSegmentPointsId[0] === -1 ?
    closestConnection.begin.getY(closestConnection.end) :
    intermediatePoints[theClosestSegmentPointsId[0]].y

    const lastPointX = theClosestSegmentPointsId[1] === intermediatePoints.length ?
    closestConnection.end.getX(closestConnection.begin) :
    intermediatePoints[theClosestSegmentPointsId[1]].x

    const lastPointY = theClosestSegmentPointsId[1] === intermediatePoints.length ?
    closestConnection.end.getY(closestConnection.begin) :
    intermediatePoints[theClosestSegmentPointsId[1]].y

    const moved = (() => {
      if (Math.abs(firstPointX - lastPointX) < 0.01) { return {movedX: true, movedY: false} }
      if (Math.abs(firstPointY - lastPointY) < 0.01) { return {movedX: false, movedY: true} } 
      return { movedX: true, movedY: true }
    })()

    const newIntermediatePoints = intermediatePoints.map((point, index) => {
      if (theClosestSegmentPointsId.indexOf(index) >= 0) {
        return new IntermediateConnectionPoint(
          point.getX(), 
          point.getY(),
          true,
          moved.movedX,
          moved.movedY,
          point.x,
          point.y)
      } else {
        return point
      }
    })

    const pre = theClosestSegmentPointsId[0] === -1 ? [
      new IntermediateConnectionPoint(
        closestConnection.begin.getX(closestConnection.end),
        closestConnection.begin.getY(closestConnection.end),
        true,
        moved.movedX,
        moved.movedY,
        closestConnection.begin.getX(closestConnection.end),
        closestConnection.begin.getY(closestConnection.end),
        )
    ] : []

    const post = theClosestSegmentPointsId[1] === intermediatePoints.length ? [
      new IntermediateConnectionPoint(
        closestConnection.end.getX(closestConnection.begin),
        closestConnection.end.getY(closestConnection.begin),
        true,
        moved.movedX,
        moved.movedY,
        closestConnection.end.getX(closestConnection.begin),
        closestConnection.end.getY(closestConnection.begin))
    ] : []

    const newPoints = [...pre, ...newIntermediatePoints, ...post]

    dispatch(updateConnection(theClosestConnectionId, {
      ...closestConnection,
      selected: true,
      intermediatePoints: newPoints
    }))
    dispatch(setMouseMode(MouseMode.dragging))
  }

  const onMouseEnterHandler = (event: React.MouseEvent) => {
    const x = getCanvasX(event, scale)
    const y = getCanvasY(event, scale)

    const theClosestConnectionId = connectionDistanceCalculator.getTheClosestConnectionId(x, y)

    Array.from(connections.keys()).forEach(id => {
      if (id === theClosestConnectionId) {
        dispatch(updateConnection(id, { ...connections.get(id), isHovered: true }))
      } else {
        dispatch(updateConnection(id, { ...connections.get(id), isHovered: false }))
      }
    })
  }

  const onMouseLeaveHandler = (event: React.MouseEvent) => {
    Array.from(connections.entries()).map(connection => dispatch(updateConnection(
      connection[0],
      { ...connection[1], isHovered: false }
    )))
  }

  return {
    onMouseEnterHandler,
    onMouseLeaveHandler,
    onMouseDown
  }
}