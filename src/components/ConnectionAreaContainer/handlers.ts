import { setMouseMode, setConnectionTypeChooserState, updateEntity } from '../../actions'
import { MouseMode } from '../../types'
import { LEFT_MOUSE_BUTTON } from '../../constants'
import { Entity, ConnectionArea, Connection, ConnectionAreaPoint, ConnectionType, nonActiveConnectionTypeChooserState, ConnectionPoint } from '../../types'
import { getScale, getCanvasX, getCanvasY, getTheClosestAreaPointPosition } from '../../utils'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'

export const useConnectionAreaHandlers = (
  entity: Entity,
  entityId: number,
  area: ConnectionArea,
  areaId: number
) => {
  const [scale, mouseMode ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.mouseMode,
  ])
  const currentConnectionController = useCurrentDiagramConnectionController()
  const dispatch = useDispatch()

  const mouseDownHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (event.button !== LEFT_MOUSE_BUTTON) {
      const position = getTheClosestAreaPointPosition(
        getCanvasX(event, scale),
        getCanvasY(event, scale),
        entity,
        area
      )

      dispatch(setMouseMode(MouseMode.connecting))

      currentConnectionController.setCurrentConnection(new Connection(
        new ConnectionAreaPoint(entityId, areaId, position),
        new ConnectionAreaPoint(entityId, areaId, position),
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
          entity,
          area
        )
        dispatch(setMouseMode(MouseMode.default))
        dispatch(setConnectionTypeChooserState({
          isActive: true,
          x: getCanvasX(event, scale),
          y: getCanvasY(event, scale),
          endPoint: new ConnectionAreaPoint(entityId, areaId, position),
        }))
      } else {
        dispatch(setMouseMode(MouseMode.default))
      }
    }
  }

  const mouseMoveHandler = (event: React.MouseEvent) => {
    if (mouseMode === MouseMode.connecting) {
      event.stopPropagation()
      const position = getTheClosestAreaPointPosition(
        getCanvasX(event, scale),
        getCanvasY(event, scale),
        entity,
        area
      )
      currentConnectionController.setEndAreaPoint(entityId, areaId, position)
    }
  }

  return {
    mouseDownHandler,
    mouseUpHandler,
    mouseMoveHandler,
  }
}