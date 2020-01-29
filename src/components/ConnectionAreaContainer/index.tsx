import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { Entity, ConnectionArea, Connection, ConnectionAreaPoint, ConnectionType, nonActiveConnectionTypeChooserState, ConnectionPoint } from '../../types'
import { getScale, getCanvasX, getCanvasY, getTheClosestAreaPointPosition } from '../../utils'
import { setMouseMode, setConnectionTypeChooserState, updateEntity } from '../../actions'
import { MouseMode } from '../../types'
import { LEFT_MOUSE_BUTTON } from '../../constants'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'

export interface ConnectionAreaContainerProps {
  width: number;
  entityId: number;
  entity: Entity;
  areaId: number;
  area: ConnectionArea;
}

export const ConnectionAreaContainer = (props: ConnectionAreaContainerProps) => {
  const [scale, mouseMode ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.mouseMode,
    state.currentDiagramConnection,
    state.currentDiagramConnection,
  ])
  const dispatch = useDispatch()

  const currentConnectionController = useCurrentDiagramConnectionController()

  const mouseDownHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (event.button !== LEFT_MOUSE_BUTTON) {
      const position = getTheClosestAreaPointPosition(
        getCanvasX(event, scale),
        getCanvasY(event, scale),
        props.entity,
        props.area
      )

      dispatch(setMouseMode(MouseMode.connecting))

      currentConnectionController.setCurrentConnection(new Connection(
        new ConnectionAreaPoint(props.entityId, props.areaId, position),
        new ConnectionAreaPoint(props.entityId, props.areaId, position),
        ConnectionType.Connecting
      ))
      dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
    }
  }

  const mouseUpHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (mouseMode === MouseMode.connecting) {
      if (event.button !== LEFT_MOUSE_BUTTON) {
        const position = getTheClosestAreaPointPosition(
          getCanvasX(event, scale),
          getCanvasY(event, scale),
          props.entity,
          props.area
        )
        dispatch(setMouseMode(MouseMode.default))
        dispatch(setConnectionTypeChooserState({
          isActive: true,
          x: getCanvasX(event, scale),
          y: getCanvasY(event, scale),
          endPoint: new ConnectionAreaPoint(props.entityId, props.areaId, position),
        }))
      } else {
        dispatch(setMouseMode(MouseMode.default))
      }
    }
    if (event.button !== LEFT_MOUSE_BUTTON) {
      event.stopPropagation()
      dispatch(updateEntity(props.entityId, {
        ...props.entity,
        areaConnectionMode: !(props.entity.areaConnectionMode)
      }))
    }
  }

  const mouseMoveHandler = (event: React.MouseEvent) => {
    if (mouseMode === MouseMode.connecting) {
      event.stopPropagation()
      const position = getTheClosestAreaPointPosition(
        getCanvasX(event, scale),
        getCanvasY(event, scale),
        props.entity,
        props.area
      )
      currentConnectionController.setEndAreaPoint(props.entityId, props.areaId, position)
    }
  }

  const renderConnectionPoint = () => (
    <circle
      className='connection-area'
      cx={(props.entity.x + props.area.xBegin + props.area.visualOffsetX * props.width / 2) * scale}
      cy={(props.entity.y + props.area.yBegin + props.area.visualOffseyY * props.width / 2) * scale}
      opacity={0.5}
      r={props.width * scale / 2}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
    />
  )

  const renderConnectionArea = () => (
    <line
      className='connection-area'
      x1={(props.entity.x + props.area.xBegin + props.area.visualOffsetX * props.width / 2) * scale}
      y1={(props.entity.y + props.area.yBegin + props.area.visualOffseyY * props.width / 2) * scale}
      x2={(props.entity.x + props.area.xEnd + props.area.visualOffsetX * props.width / 2) * scale}
      y2={(props.entity.y + props.area.yEnd + props.area.visualOffseyY * props.width / 2) * scale}
      opacity={0.5}
      strokeWidth={props.width * scale}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseMove={mouseMoveHandler}
    />)

  return (props.area instanceof ConnectionPoint) ?
    renderConnectionPoint() :
    renderConnectionArea()
}