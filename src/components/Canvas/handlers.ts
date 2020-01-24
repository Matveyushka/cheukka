import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../../stores'
import { isPointInRectangle, roundCoordinateOrSize, getCanvasX, getCanvasY, getScale } from '../../utils'
import { updateEntity, setMouseMode, addConnection, setCurrentDiagramConnection, setDiagramEntityTypeChooserState } from '../../actions'
import { MouseMode, Connection, FreeConnectionPoint, } from '../../types'
import { DEFAULT_CANVAS_WIDTH, LEFT_MOUSE_BUTTON } from '../../constants'
import { ComponentDiagramModule } from '../DiagramEntities/ComponentDiagram/ComponentDiagramModule'

export const useCanvasHandlers = () => {
  const [
    scale,
    entities,
    mode,
    currentDiagramConnection] = useSelector((state: Store) => [
      state.scale,
      state.diagramEntities,
      state.mouseMode,
      state.currentDiagramConnection
    ])
  const dispatch = useDispatch()

  const getHoveredBlock = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientX = getCanvasX(event, getScale(scale))
    const clientY = getCanvasY(event, getScale(scale))

    return Array.from(entities.entries()).filter(enitity =>
      isPointInRectangle(clientX, clientY, enitity[1].x, enitity[1].y, enitity[1].width, enitity[1].height)
    ).reverse()[0] || null
  }

  const doubleClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode !== MouseMode.default) return;
    if (getHoveredBlock(event) !== null) return;

    dispatch(setDiagramEntityTypeChooserState({
      isActive: true,
      x: getCanvasX(event, getScale(scale)),
      y: getCanvasY(event, getScale(scale)),
    }))
  }

  const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(setDiagramEntityTypeChooserState({
      x: 0,
      y: 0,
      isActive: false,
    }))
    if (event.button !== LEFT_MOUSE_BUTTON) {
      const hoveredBlock = getHoveredBlock(event)
      if (hoveredBlock !== null) {
        dispatch(setMouseMode(MouseMode.dragging))
        Array.from(entities.entries()).forEach(entrie => {
          if (entrie[0] === hoveredBlock[0]) {
            dispatch(updateEntity(entrie[0], {
              ...entrie[1], selected: true, moved: true,
              movementOriginX: getCanvasX(event, getScale(scale)) - entrie[1].x,
              movementOriginY: getCanvasY(event, getScale(scale)) - entrie[1].y,
            }))
          } else {
            if ((hoveredBlock[1].selected || event.ctrlKey) && entrie[1].selected) {
              dispatch(updateEntity(entrie[0], {
                ...entrie[1], moved: true,
                movementOriginX: getCanvasX(event, getScale(scale)) - entrie[1].x,
                movementOriginY: getCanvasY(event, getScale(scale)) - entrie[1].y,
              }))
            } else if (!event.ctrlKey) {
              dispatch(updateEntity(entrie[0], { ...entrie[1], selected: false }))
            }
          }
        })
      } else {
        Array.from(entities.entries()).forEach(entrie => {
          if (!event.ctrlKey) {
            dispatch(updateEntity(entrie[0], { ...entrie[1], selected: false }))
          }
        })
      }
    }
  }

  const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode === MouseMode.connecting) {
      dispatch(addConnection(currentDiagramConnection))
    }
    dispatch(setMouseMode(MouseMode.default))
    Array.from(entities.entries()).forEach(entrie => {
      dispatch(updateEntity(entrie[0], {
        ...entrie[1],
        moved: false,
        sizeChangedOnBottom: false,
        sizeChangedOnLeft: false,
        sizeChangedOnRight: false,
        sizeChangedOnTop: false,
      }))
    })
  }

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== LEFT_MOUSE_BUTTON) {
      if (mode === MouseMode.connecting) {
        dispatch(setCurrentDiagramConnection(
          new Connection(
            currentDiagramConnection.begin,
            new FreeConnectionPoint(getCanvasX(event, getScale(scale)), getCanvasY(event, getScale(scale))))
        ))
      }
      if (mode === MouseMode.dragging) {
        Array.from(entities.entries()).forEach(entrie => {
          const possibleNewX = roundCoordinateOrSize(getCanvasX(event, getScale(scale)))
          const rightX = entrie[1].x + entrie[1].width
          const possibleNewY = roundCoordinateOrSize(getCanvasY(event, getScale(scale)))
          const bottomY = entrie[1].y + entrie[1].height

          const newX = (() => {
            if (entrie[1].moved) return roundCoordinateOrSize(getCanvasX(event, getScale(scale)) - entrie[1].movementOriginX)
            if (entrie[1].sizeChangedOnLeft) {
              return possibleNewX > rightX ? rightX : possibleNewX
            }
            if (entrie[1].sizeChangedOnRight) {
              return getCanvasX(event, getScale(scale)) < entrie[1].x ? getCanvasX(event, getScale(scale)) : entrie[1].x
            }
            return entrie[1].x
          })()

          const newY = (() => {
            if (entrie[1].moved) return roundCoordinateOrSize(getCanvasY(event, getScale(scale)) - entrie[1].movementOriginY)
            if (entrie[1].sizeChangedOnTop) {
              return possibleNewY > bottomY ? bottomY : possibleNewY
            }
            if (entrie[1].sizeChangedOnBottom) {
              return getCanvasY(event, getScale(scale)) < entrie[1].y ? getCanvasY(event, getScale(scale)) : entrie[1].y
            }
            return entrie[1].y
          })()

          const newWidth = (() => {
            if (entrie[1].sizeChangedOnLeft) {
              const possibleNewWidth = roundCoordinateOrSize(rightX - getCanvasX(event, getScale(scale)))
              return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
            }
            if (entrie[1].sizeChangedOnRight) {
              const possibleNewWidth = roundCoordinateOrSize(getCanvasX(event, getScale(scale)) - entrie[1].x)
              return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
            }
            return entrie[1].width
          })()

          const newHeight = (() => {
            if (entrie[1].sizeChangedOnTop) {
              const possibleNewHeight = roundCoordinateOrSize(bottomY - getCanvasY(event, getScale(scale)))
              return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
            }
            if (entrie[1].sizeChangedOnBottom) {
              const possibleNewHeight = roundCoordinateOrSize(getCanvasY(event, getScale(scale)) - entrie[1].y)
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
            width: newWidth,
            height: newHeight,
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
  }
}