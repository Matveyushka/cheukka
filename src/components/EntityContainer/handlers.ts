import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale, getCanvasX, getCanvasY } from '../../utils'
import { LEFT_MOUSE_BUTTON } from '../../constants'
import { MouseMode } from '../../types'
import { setMouseMode, updateEntity } from '../../actions'

export const useEntityContainerHandlers = (entityId: number) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(true)

  const [ scale, entities ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramEntities, 
  ])

  const dispatch = useDispatch()

  const thisEntity = entities.get(entityId)

  const onMouseDownHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    event.stopPropagation()
    if (event.button !== LEFT_MOUSE_BUTTON) {
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

  const onMouseEnterHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>) => { setIsHovered(true) }

  const onMouseLeaveHandler = (event: React.MouseEvent<SVGGElement, MouseEvent>) => { setIsHovered(false) }

  return {
    onMouseDownHandler,
    onMouseEnterHandler,
    onMouseLeaveHandler,
    isHovered
  }
}