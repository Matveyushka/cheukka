import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../../stores'
import { roundCoordinateOrSize, getCanvasX, getCanvasY, getScale } from '../../utils'
import {
  updateEntity, setMouseMode,
  setCurrentDiagramConnection,
  setDiagramEntityTypeChooserState,
  setConnectionTypeChooserState
} from '../../actions'
import { MouseMode, Connection, FreeConnectionPoint, Entity, nonActiveConnectionTypeChooserState, ConnectionType } from '../../types'
import { LEFT_MOUSE_BUTTON } from '../../constants'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'

export const useCanvasHandlers = () => {
  const currentConnectionController = useCurrentDiagramConnectionController()

  const [selectingState, setSelectingState] = React.useState({
    beginX: 0,
    beginY: 0,
    endX: 0,
    endY: 0,
  })

  const [
    scale,
    entities,
    mode,
    currentDiagramConnection] = useSelector((state: Store) => [
      getScale(state.scaleLevel),
      state.diagramEntities,
      state.mouseMode,
      state.currentDiagramConnection
    ])
  const dispatch = useDispatch()

  const doubleClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode !== MouseMode.default) return;

    dispatch(setDiagramEntityTypeChooserState({
      isActive: true,
      x: getCanvasX(event, scale),
      y: getCanvasY(event, scale),
      withConnecting: false,
    }))
  }

  const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(setDiagramEntityTypeChooserState({
      x: 0,
      y: 0,
      isActive: false,
      withConnecting: false,
    }))
    dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
    if (event.button !== LEFT_MOUSE_BUTTON) {
      setSelectingState({
        beginX: getCanvasX(event, scale),
        beginY: getCanvasY(event, scale),
        endX: getCanvasX(event, scale),
        endY: getCanvasY(event, scale),
      })
      dispatch(setMouseMode(MouseMode.selecting))
      Array.from(entities.entries()).forEach(entrie => {
        if (!event.ctrlKey) {
          dispatch(updateEntity(entrie[0], { ...entrie[1], selected: false }))
        }
      })
    }
  }

  const isEntityInArea = (entity: Entity, area: {
    beginX: number,
    beginY: number,
    endX: number,
    endY: number,
  }) => {
    const x = Math.min(area.beginX, area.endX)
    const y = Math.min(area.beginY, area.endY)
    const width = Math.max(area.beginX - x, area.endX - x)
    const height = Math.max(area.beginY - y, area.endY - y)

    const a = entity.x >= x
    const b = (entity.x + entity.width) < (x + width)
    const c = entity.y >= y
    const d = (entity.y + entity.height) < (y + height)

    if (a && b && c && d) return true
    return false
  }

  const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode === MouseMode.connecting) {
      if (event.button !== LEFT_MOUSE_BUTTON) {
        dispatch(setDiagramEntityTypeChooserState({
          isActive: true,
          x: getCanvasX(event, scale),
          y: getCanvasY(event, scale),
          withConnecting: true,
        }))
      } else {
        dispatch(setMouseMode(MouseMode.default))
      }
    }
    dispatch(setMouseMode(MouseMode.default))
    Array.from(entities.entries()).forEach(entrie => {
      dispatch(updateEntity(entrie[0], {
        ...entrie[1],
        selected: (mode === MouseMode.selecting && isEntityInArea(entrie[1], selectingState)) ? true : entrie[1].selected,
        moved: false,
        sizeChangedOnBottom: false,
        sizeChangedOnLeft: false,
        sizeChangedOnRight: false,
        sizeChangedOnTop: false,
      }))
    })
    if (mode === MouseMode.selecting) {
      dispatch(setMouseMode(MouseMode.default))
    }
  }

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== LEFT_MOUSE_BUTTON) {
      if (mode === MouseMode.connecting) {
        const newX = roundCoordinateOrSize(getCanvasX(event, scale))
        const newY = roundCoordinateOrSize(getCanvasY(event, scale))

        currentConnectionController.setEndFreePoint(newX, newY)
      }
      if (mode === MouseMode.selecting) {
        setSelectingState({
          ...selectingState,
          endX: getCanvasX(event, scale),
          endY: getCanvasY(event, scale)
        })
      }
      if (mode === MouseMode.dragging) {
        Array.from(entities.entries()).filter(entrie => (
          entrie[1].sizeChangedOnBottom || entrie[1].sizeChangedOnLeft ||
          entrie[1].sizeChangedOnTop || entrie[1].sizeChangedOnRight || entrie[1].moved
        )).forEach(entrie => {
          const possibleNewX = getCanvasX(event, scale)
          const rightX = entrie[1].x + entrie[1].width
          const possibleNewY = getCanvasY(event, scale)
          const bottomY = entrie[1].y + entrie[1].height

          const newX = (() => {
            if (entrie[1].moved) return getCanvasX(event, scale) - entrie[1].movementOriginX
            if (entrie[1].sizeChangedOnLeft) {
              return possibleNewX > rightX ? rightX : possibleNewX
            }
            if (entrie[1].sizeChangedOnRight) {
              return getCanvasX(event, scale) < entrie[1].x ? getCanvasX(event, scale) : entrie[1].x
            }
            return entrie[1].x
          })()

          const newY = (() => {
            if (entrie[1].moved) return getCanvasY(event, scale) - entrie[1].movementOriginY
            if (entrie[1].sizeChangedOnTop) {
              return possibleNewY > bottomY ? bottomY : possibleNewY
            }
            if (entrie[1].sizeChangedOnBottom) {
              return getCanvasY(event, scale) < entrie[1].y ? getCanvasY(event, scale) : entrie[1].y
            }
            return entrie[1].y
          })()

          const newWidth = (() => {
            if (entrie[1].sizeChangedOnLeft) {
              const possibleNewWidth = rightX - getCanvasX(event, scale)
              return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
            }
            if (entrie[1].sizeChangedOnRight) {
              const possibleNewWidth = getCanvasX(event, scale) - entrie[1].x
              return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
            }
            return entrie[1].width
          })()

          const newHeight = (() => {
            if (entrie[1].sizeChangedOnTop) {
              const possibleNewHeight = bottomY - getCanvasY(event, scale)
              return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
            }
            if (entrie[1].sizeChangedOnBottom) {
              const possibleNewHeight = getCanvasY(event, scale) - entrie[1].y
              return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
            }
            return entrie[1].height
          })()

          const newSizeChangedOnTop = (() => {
            if (entrie[1].sizeChangedOnTop && possibleNewY > bottomY) return false
            if (entrie[1].sizeChangedOnBottom && entrie[1].y !== newY) return true
            return entrie[1].sizeChangedOnTop
          })()

          const newSizeChangedOnLeft = (() => {
            if (entrie[1].sizeChangedOnLeft && possibleNewX > rightX) return false
            if (entrie[1].sizeChangedOnRight && entrie[1].x !== newX) return true
            return entrie[1].sizeChangedOnLeft
          })()

          const newSizeChangedOnBottom = (() => {
            if (entrie[1].sizeChangedOnTop && possibleNewY > bottomY) return true
            if (entrie[1].sizeChangedOnBottom && entrie[1].y !== newY) return false
            return entrie[1].sizeChangedOnBottom
          })()

          const newSizeChangedOnRight = (() => {
            if (entrie[1].sizeChangedOnLeft && possibleNewX > rightX) return true
            if (entrie[1].sizeChangedOnRight && entrie[1].x !== newX) return false
            return entrie[1].sizeChangedOnRight
          })()

          dispatch(updateEntity(entrie[0], {
            ...entrie[1],
            x: roundCoordinateOrSize(newX),
            y: roundCoordinateOrSize(newY),
            width: roundCoordinateOrSize(newWidth),
            height: roundCoordinateOrSize(newHeight),
            sizeChangedOnTop: newSizeChangedOnTop,
            sizeChangedOnBottom: newSizeChangedOnBottom,
            sizeChangedOnLeft: newSizeChangedOnLeft,
            sizeChangedOnRight: newSizeChangedOnRight,
          }))
        })
      }
    }
  }

  return {
    doubleClickHandler,
    mouseDownHandler,
    mouseUpHandler,
    mouseMoveHandler,
    selectingState,
  }
}