import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../../stores'
import { Entity, ConnectionArea, Connection, ConnectionAreaPoint } from '../../../types'
import { getScale, getCanvasX, getCanvasY } from '../../../utils'
import { getTheClosestSegmentPointToFreePoint } from '../../../utils/geometry'
import { setMouseMode, setCurrentDiagramConnection, addConnection } from '../../../actions'
import { MouseMode } from '../../../types'

export interface ConnectionAreaContainerProps {
  width: number;
  entityId: number;
  entity: Entity;
  areaId: number;
  area: ConnectionArea;
}

export const ConnectionAreaContainer = (props: ConnectionAreaContainerProps) => {
  const [ scale, mouseMode, currentConnection ] = useSelector((state: Store) => [
    getScale(state.scale),
    state.mouseMode,
    state.currentDiagramConnection
  ])
  const dispatch = useDispatch()

  const getPointPosition = (event: React.MouseEvent) => {
    const freePoint = {x: getCanvasX(event, scale), y: getCanvasY(event, scale)}
    const segmentBegin = { x: props.entity.x + props.area.xBegin, y: props.entity.y + props.area.yBegin}
    const segmentEnd = { x: props.entity.x + props.area.xEnd, y: props.entity.y + props.area.yEnd}
  
    const {x, y} = getTheClosestSegmentPointToFreePoint(
      freePoint,
      segmentBegin,
      segmentEnd,
    )  
  
    const costyl1 = x === Infinity ? 0 : (x - segmentBegin.x) ** 2
    const costyl2 = y === Infinity ? 0 : (y - segmentBegin.y) ** 2
  
    const segmentLength = Math.sqrt((segmentEnd.x - segmentBegin.x) ** 2 + (segmentEnd.y - segmentBegin.y) ** 2)
    const pointDistantionFromBegin = Math.sqrt(costyl1 + costyl2)
  
    return segmentLength === 0 ? 0.5 : Math.abs(pointDistantionFromBegin / segmentLength)
  }

  const mouseDownHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    dispatch(setMouseMode(MouseMode.connecting))
    dispatch(setCurrentDiagramConnection(new Connection(
      new ConnectionAreaPoint(props.entityId, props.areaId, getPointPosition(event)),
      new ConnectionAreaPoint(props.entityId, props.areaId, getPointPosition(event)),
    )))
  }

  const mouseUpHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (mouseMode === MouseMode.connecting) {
      dispatch(setMouseMode(MouseMode.default))
      dispatch(addConnection(new Connection(
        currentConnection.begin,
        new ConnectionAreaPoint(props.entityId, props.areaId, getPointPosition(event))
      )))
    }
  }

  return <line
    x1={(props.entity.x + props.area.xBegin + props.area.visualOffsetX * props.width / 2) * scale}
    y1={(props.entity.y + props.area.yBegin + props.area.visualOffseyY * props.width / 2) * scale}
    x2={(props.entity.x + props.area.xEnd + props.area.visualOffsetX * props.width / 2) * scale}
    y2={(props.entity.y + props.area.yEnd + props.area.visualOffseyY * props.width / 2) * scale}
    stroke="green"
    opacity={0.5}
    strokeWidth={props.width * scale}
    onMouseDown={mouseDownHandler}
    onMouseUp={mouseUpHandler}
  />
}