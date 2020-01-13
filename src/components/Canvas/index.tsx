import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../stores'
import { getScale, roundCoordinateOrSize, isPointInRectangle } from '../../utils'
import { addEntity, updateEntity } from '../../actions'
import { DEFAULT_CANVAS_WIDTH, LEFT_MOUSE_BUTTON } from '../../constants'
import { getBackgroundSvg } from './Background'
import { EntityContainer } from './EntityContainer'
import { EntityType } from '../../types'

export interface CanvasProps { }

enum MouseMode {
  default,
  dragging,
}

export const Canvas = (props: CanvasProps) => {
  const scale = useSelector((state: Store) => state.scale)
  const entities = useSelector((state: Store) => state.diagramEntities)
  const dispatch = useDispatch()

  const [mode, setMode] = React.useState<MouseMode>(MouseMode.default)

  const getCanvasX = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientRect = event.currentTarget.getBoundingClientRect()
    return (event.clientX - clientRect.left) / getScale(scale)
  }

  const getCanvasY = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientRect = event.currentTarget.getBoundingClientRect()
    return (event.clientY - clientRect.top) / getScale(scale)
  }

  const getHoveredBlock = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientX = getCanvasX(event)
    const clientY = getCanvasY(event)

    return Array.from(entities.entries()).filter(enitity =>
      isPointInRectangle(clientX, clientY, enitity[1].x, enitity[1].y, enitity[1].width, enitity[1].height)
    ).reverse()[0] || null
  }

  const doubleClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode !== MouseMode.default) return;
    if (getHoveredBlock(event) !== null) return;
    const width = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH * 0.1)
    const height = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH * 0.066)

    const x = roundCoordinateOrSize(getCanvasX(event) - width / 2)
    const y = roundCoordinateOrSize(getCanvasY(event) - height / 2)

    dispatch(addEntity({
      type: EntityType.BlockSchemeAction,
      x,
      y,
      width,
      height,
      blocks: [{ x: 0, y: 0, width, height }],
      selected: false,
      moved: false,
      movementOriginX: 0,
      movementOriginY: 0,
      sizeChangedOnBottom: false,
      sizeChangedOnLeft: false,
      sizeChangedOnRight: false,
      sizeChangedOnTop: false,
    }))
  }

  const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.button !== LEFT_MOUSE_BUTTON) {
      const hoveredBlock = getHoveredBlock(event)
      if (hoveredBlock !== null) {
        Array.from(entities.entries()).forEach(entrie => {
          if (entrie[0] === hoveredBlock[0]) {
            dispatch(updateEntity(entrie[0], {
              ...entrie[1], selected: true, moved: true,
              movementOriginX: getCanvasX(event) - entrie[1].x,
              movementOriginY: getCanvasY(event) - entrie[1].y,
            }))
          } else {
            if ((hoveredBlock[1].selected || event.ctrlKey) && entrie[1].selected) {
              dispatch(updateEntity(entrie[0], {
                ...entrie[1], moved: true,
                movementOriginX: getCanvasX(event) - entrie[1].x,
                movementOriginY: getCanvasY(event) - entrie[1].y,
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
    setMode(MouseMode.default)
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
      Array.from(entities.entries()).forEach(entrie => {
        const possibleNewX = roundCoordinateOrSize(getCanvasX(event))
        const rightX = entrie[1].x + entrie[1].width
        const possibleNewY = roundCoordinateOrSize(getCanvasY(event))
        const bottomY = entrie[1].y + entrie[1].height

        const newX = (() => {
          if (entrie[1].moved) return roundCoordinateOrSize(getCanvasX(event) - entrie[1].movementOriginX)
          if (entrie[1].sizeChangedOnLeft) {
            return possibleNewX > rightX ? rightX : possibleNewX
          }
          if (entrie[1].sizeChangedOnRight) {
            return getCanvasX(event) < entrie[1].x ? getCanvasX(event) : entrie[1].x
          }
          return entrie[1].x
        })()

        const newY = (() => {
          if (entrie[1].moved) return roundCoordinateOrSize(getCanvasY(event) - entrie[1].movementOriginY)
          if (entrie[1].sizeChangedOnTop) {
            return possibleNewY > bottomY ? bottomY : possibleNewY
          }
          if (entrie[1].sizeChangedOnBottom) {
            return getCanvasY(event) < entrie[1].y ? getCanvasY(event) : entrie[1].y
          }
          return entrie[1].y
        })()

        const newWidth = (() => {
          if (entrie[1].sizeChangedOnLeft) {
            const possibleNewWidth = roundCoordinateOrSize(rightX - getCanvasX(event))
            return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
          }
          if (entrie[1].sizeChangedOnRight) {
            const possibleNewWidth = roundCoordinateOrSize(getCanvasX(event) - entrie[1].x)
            return possibleNewWidth > 0 ? possibleNewWidth : -possibleNewWidth
          }
          return entrie[1].width
        })()

        const newHeight = (() => {
          if (entrie[1].sizeChangedOnTop) {
            const possibleNewHeight = roundCoordinateOrSize(bottomY - getCanvasY(event))
            return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
          }
          if (entrie[1].sizeChangedOnBottom) {
            const possibleNewHeight = roundCoordinateOrSize(getCanvasY(event) - entrie[1].y)
            return possibleNewHeight > 0 ? possibleNewHeight : -possibleNewHeight
          }
          return entrie[1].height
        })()

        const newSizeChangedOnTop = (() => {
          console.log(newY > entrie[1].y + entrie[1].height)
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

        dispatch(updateEntity(entrie[0], {...entrie[1],
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

  const getBlocks = () => {
    return Array.from(entities.entries()).map((entity, index) => <EntityContainer key={index}
      entityId={entity[0]}
      entity={entity[1]}
    />)
  }

  const backgroundBlocksAmountInWidth = (() => {
    if (scale > 10) return 10
    if (scale > 5) return 5
    return 2
  })()

  return (
    <div className="canvas-main">
      <div
        onDoubleClick={doubleClickHandler}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        className="diagram-canvas"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,${getBackgroundSvg(scale, backgroundBlocksAmountInWidth)}')`,
          backgroundSize: `${100 / backgroundBlocksAmountInWidth}%`,
        }}
      >
        <svg width="100%" height="100%">
          {getBlocks()}
        </svg>
      </div>
    </div>
  )
}