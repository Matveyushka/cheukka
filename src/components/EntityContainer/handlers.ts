import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale, getCanvasX, getCanvasY, getTheClosestAreaPointPosition } from '../../utils'
import { LEFT_MOUSE_BUTTON } from '../../constants'
import { MouseMode, nonActiveConnectionTypeChooserState, ConnectionAreaPoint, ConnectionPathPoint, FreeConnectionPoint, Entity, EntityConnectionPoint } from '../../types'
import { setMouseMode, updateEntity, setConnectionTypeChooserState } from '../../actions'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'

export const useEntityContainerHandlers = (entityId: number) => {

  const [scale, entities, mouseMode] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramEntities,
    state.mouseMode,
  ])

  const currentConnectionController = useCurrentDiagramConnectionController()

  const dispatch = useDispatch()

  const thisEntity: Entity = entities.get(entityId)

  const isHovered = thisEntity.isHovered

  const onMouseUpHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    if (mouseMode === MouseMode.connecting) {
      event.stopPropagation()
      if (event.button !== LEFT_MOUSE_BUTTON) {
        dispatch(setConnectionTypeChooserState({
          isActive: true,
          x: getCanvasX(event, scale),
          y: getCanvasY(event, scale),
          endPoint: new EntityConnectionPoint(entityId)
        }))
        dispatch(setMouseMode(MouseMode.default))
      }
    }
    if (event.button === LEFT_MOUSE_BUTTON) {
      event.stopPropagation()
      dispatch(updateEntity(entityId, {
        ...thisEntity,
        areaConnectionMode: !(thisEntity.areaConnectionMode)
      }))
    }
  }

  const onMouseDownHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    event.stopPropagation()
    if (event.button !== LEFT_MOUSE_BUTTON) {
      dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
      dispatch(setMouseMode(MouseMode.dragging))
      Array.from(entities.entries()).forEach(entrie => {
        if (entrie[0] === entityId) {
          dispatch(updateEntity(entrie[0], {
            ...entrie[1], selected: true, moved: true,
            movementOriginX: getCanvasX(event, scale) - entrie[1].x,
            movementOriginY: getCanvasY(event, scale) - entrie[1].y,
          }))
        } else {
          if ((thisEntity.selected || event.ctrlKey) && entrie[1].selected) {
            dispatch(updateEntity(entrie[0], {
              ...entrie[1], moved: true,
              movementOriginX: getCanvasX(event, scale) - entrie[1].x,
              movementOriginY: getCanvasY(event, scale) - entrie[1].y,
            }))
          } else if (!event.ctrlKey) {
            dispatch(updateEntity(entrie[0], { ...entrie[1], selected: false }))
          }
        }
      })
    }
  }

  const onMouseEnterHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>) => { 
    dispatch(updateEntity(entityId, { ...thisEntity, isHovered: true }))
  }

  const onMouseLeaveHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>) => { 
    dispatch(updateEntity(entityId, { ...thisEntity, isHovered: false }))
  }

  const onMouseMoveHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
    if (event.button !== LEFT_MOUSE_BUTTON) {
      dispatch(updateEntity(entityId, { ...thisEntity, isHovered: true }))
      if (mouseMode === MouseMode.connecting) {
        event.stopPropagation()
        currentConnectionController.setEndEntityPoint(entityId)
      }
    }
  }

  return {
    onMouseDownHandler,
    onMouseEnterHandler,
    onMouseLeaveHandler,
    onMouseMoveHandler,
    onMouseUpHandler,
    isHovered: thisEntity.isHovered
  }
}