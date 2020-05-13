import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../../stores'
import { roundEntityCoordinateOrSize, getCanvasX, getCanvasY, getScale, roundConnectionCoordinateOrSize } from '../../utils'
import {
  updateEntity, setMouseMode,
  setConnectionTypeChooserState,
  updateConnection
} from '../../actions'
import { MouseMode, Entity, nonActiveConnectionTypeChooserState, Connection } from '../../types'
import { RIGHT_MOUSE_BUTTON } from '../../constants'
import { useCurrentDiagramConnectionController } from '../../hooks/currentDiagramConnectionHook'
import { useEntityTypeChooserController } from '../../hooks/entityTypeChooserHook'
import { IntermediateConnectionPoint } from '../../types/DiagramConnectionTypes/ConnectionPathPoint/IntermediateConnectionPoint'
import { isEntityInArea, isAreaInsideAnotherArea } from '../../utils/geometry'

export const useCanvasHandlers = () => {
  const currentConnectionController = useCurrentDiagramConnectionController()
  const entityTypeChooserController = useEntityTypeChooserController()

  const updateEntities = (
    fieldsToUpdate: (id: number, entity: Entity) => Partial<Entity>,
    condition?: (id: number, entity: Entity) => boolean) => {
    Array.from(entities.entries()).forEach(entrie => {
      if (!condition || condition(entrie[0], entrie[1])) {
        dispatch(updateEntity(entrie[0], { ...entrie[1], ...fieldsToUpdate(entrie[0], entrie[1]) }))
      }
    })
  }

  const updateConnections = (
    fieldsToUpdate: (id: number, connection: Connection) => Partial<Connection>,
    condition?: (id: number, connection: Connection) => boolean) => {
    Array.from(connections.entries()).forEach(entrie => {
      if (!condition || condition(entrie[0], entrie[1])) {
        dispatch(updateConnection(entrie[0], { ...entrie[1], ...fieldsToUpdate(entrie[0], entrie[1]) }))
      }
    })
  }

  const [selectingState, setSelectingState] = React.useState({
    beginX: 0,
    beginY: 0,
    endX: 0,
    endY: 0,
  })

  const [
    scale,
    entities,
    connections,
    mode
  ] = useSelector((state: Store) => [
    getScale(state.scaleLevel),
    state.diagramEntities,
    state.diagramConnections,
    state.mouseMode,
  ])
  const dispatch = useDispatch()

  const doubleClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode === MouseMode.default) {
      entityTypeChooserController.activate(getCanvasX(event, scale), getCanvasY(event, scale), false)
    }
  }

  const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    entityTypeChooserController.deactivate()
    dispatch(setConnectionTypeChooserState(nonActiveConnectionTypeChooserState))
    if (event.button !== RIGHT_MOUSE_BUTTON) {
      setSelectingState({
        beginX: getCanvasX(event, scale),
        beginY: getCanvasY(event, scale),
        endX: getCanvasX(event, scale),
        endY: getCanvasY(event, scale),
      })
      dispatch(setMouseMode(MouseMode.selecting))

      if (!event.ctrlKey) {
        updateEntities(() => ({ selected: false }))
        updateConnections(() => ({ selected: false }))
      }
    }
  }

  const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode === MouseMode.connecting && event.button !== RIGHT_MOUSE_BUTTON) {
      entityTypeChooserController.activate(getCanvasX(event, scale), getCanvasY(event, scale), true)
    }

    dispatch(setMouseMode(MouseMode.default))

    if (mode === MouseMode.dragging) {
      updateConnections((id, connection) => ({
        intermediatePoints: connection.intermediatePoints.map(point => {
          const pointWasMoved = roundConnectionCoordinateOrSize(point.x) !== roundConnectionCoordinateOrSize(point.prevX) ||
          roundConnectionCoordinateOrSize(point.y) !== roundConnectionCoordinateOrSize(point.prevY)
  
          if (point.movedX || point.movedY) {
            return new IntermediateConnectionPoint(
              roundConnectionCoordinateOrSize(point.x),
              roundConnectionCoordinateOrSize(point.y),
              pointWasMoved,
            )
          } else {
            return point
          }
        })
      }))
    }

    if (mode === MouseMode.selecting) {
      updateConnections((id, connection) => {
        const connectionArea = connection.getConnectionBounds()
        return {
          selected: isAreaInsideAnotherArea(
            {
              beginX: connectionArea.left,
              beginY: connectionArea.top,
              endX: connectionArea.right,
              endY: connectionArea.bottom
            },
            selectingState
          )
        }
      })
    }


    updateEntities((entityId, entity) => ({
      selected: (mode === MouseMode.selecting && isEntityInArea(entity, selectingState)) ? true : entity.selected,
      height: entity.heightToContentAdapter ? entity.heightToContentAdapter(entityId, scale) : entity.height,
      moved: false,
      sizeChangedOnBottom: false,
      sizeChangedOnLeft: false,
      sizeChangedOnRight: false,
      sizeChangedOnTop: false,
    }))

  }

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== RIGHT_MOUSE_BUTTON) {
      if (mode === MouseMode.connecting) {
        currentConnectionController.setEndFreePoint(
          roundConnectionCoordinateOrSize(getCanvasX(event, scale)),
          roundConnectionCoordinateOrSize(getCanvasY(event, scale)))
      }
      if (mode === MouseMode.selecting) {
        setSelectingState({
          ...selectingState,
          endX: getCanvasX(event, scale),
          endY: getCanvasY(event, scale)
        })
      }
      if (mode === MouseMode.dragging) {
        console.log("DRAGGING")
        updateConnections((id, connection) => ({
          intermediatePoints: connection.intermediatePoints.map(point => {
            if (point.movedX || point.movedY) {
              return new IntermediateConnectionPoint(
                point.movedX ? point.x + event.movementX / scale : point.x,
                point.movedY ? point.y + event.movementY / scale : point.y,
                true,
                point.movedX,
                point.movedY,
              )
            } else {
              return point
            }
          })
        }))

        updateEntities((id, entity) => {
          const possibleNewX = getCanvasX(event, scale)
          const rightX = entity.x + entity.width
          const possibleNewY = getCanvasY(event, scale)
          const bottomY = entity.y + entity.height

          const newX = (() => {
            if (entity.moved) return getCanvasX(event, scale) - entity.movementOriginX
            if (entity.sizeChangedOnLeft) {
              return possibleNewX > rightX ? rightX : possibleNewX
            }
            if (entity.sizeChangedOnRight) {
              return getCanvasX(event, scale) < entity.x ? getCanvasX(event, scale) : entity.x
            }
            return entity.x
          })()

          const newY = (() => {
            if (entity.moved) return getCanvasY(event, scale) - entity.movementOriginY
            if (entity.sizeChangedOnTop) {
              return possibleNewY > bottomY ? bottomY : possibleNewY
            }
            if (entity.sizeChangedOnBottom) {
              return getCanvasY(event, scale) < entity.y ? getCanvasY(event, scale) : entity.y
            }
            return entity.y
          })()

          const newWidth = (() => {
            if (entity.sizeChangedOnLeft) {
              const possibleNewWidth = rightX - getCanvasX(event, scale)
              return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
            }
            if (entity.sizeChangedOnRight) {
              const possibleNewWidth = getCanvasX(event, scale) - entity.x
              return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
            }
            return entity.width
          })()

          const newHeight = (() => {
            if (entity.sizeChangedOnTop) {
              const possibleNewHeight = bottomY - getCanvasY(event, scale)
              return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
            }
            if (entity.sizeChangedOnBottom) {
              const possibleNewHeight = getCanvasY(event, scale) - entity.y
              return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
            }
            return entity.height
          })()

          const newSizeChangedOnTop = (() => {
            if (entity.sizeChangedOnTop && possibleNewY > bottomY) return false
            if (entity.sizeChangedOnBottom && entity.y !== newY) return true
            return entity.sizeChangedOnTop
          })()

          const newSizeChangedOnLeft = (() => {
            if (entity.sizeChangedOnLeft && possibleNewX > rightX) return false
            if (entity.sizeChangedOnRight && entity.x !== newX) return true
            return entity.sizeChangedOnLeft
          })()

          const newSizeChangedOnBottom = (() => {
            if (entity.sizeChangedOnTop && possibleNewY > bottomY) return true
            if (entity.sizeChangedOnBottom && entity.y !== newY) return false
            return entity.sizeChangedOnBottom
          })()

          const newSizeChangedOnRight = (() => {
            if (entity.sizeChangedOnLeft && possibleNewX > rightX) return true
            if (entity.sizeChangedOnRight && entity.x !== newX) return false
            return entity.sizeChangedOnRight
          })()

          return {
            x: roundEntityCoordinateOrSize(newX),
            y: roundEntityCoordinateOrSize(newY),
            width: roundEntityCoordinateOrSize(newWidth),
            height: roundEntityCoordinateOrSize(newHeight),
            sizeChangedOnTop: newSizeChangedOnTop,
            sizeChangedOnBottom: newSizeChangedOnBottom,
            sizeChangedOnLeft: newSizeChangedOnLeft,
            sizeChangedOnRight: newSizeChangedOnRight,
          }
        }, (id, entity) => (entity.sizeChangedOnBottom || entity.sizeChangedOnLeft ||
          entity.sizeChangedOnTop || entity.sizeChangedOnRight || entity.moved))
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