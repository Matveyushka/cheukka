import * as React from 'react'
import { Canvas } from './Canvas'
import { useDispatch, useSelector } from 'react-redux'
import { increaseScale, decreaseScale, setOffsetX, setOffsetY } from '../actions'
import { Store } from '../stores'
import { vhToPx, vwToPx, getScaledOffsets } from '../utils'
import { defaultCanvasWidth, defaultCanvasHeight, defaultEmptySpaceWidth, defaultEmptySpaceHeight } from '../constants'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const prevScale = useSelector<Store, number>((state: Store) => state.prevScale)
  const offsetX = useSelector<Store, number>((state: Store) => state.xOffset)
  const offsetY = useSelector<Store, number>((state: Store) => state.yOffset)

  const dispatch = useDispatch()

  const workspaceRef = React.useRef(null)

  const [c, sc] = React.useState<boolean>(false)

  const [cost, scost] = React.useState<number>(scale)

  const [mouseXPosition, setMouseXPosition] = React.useState<number>(0);
  const [mouseYPosition, setMouseYPosition] = React.useState<number>(0);


  const mouseMoveHandler = (event: any) => {
    setMouseXPosition(event.clientX)
    setMouseYPosition(event.clientY)
    if (event.buttons === 2) {
      dispatch(setOffsetX(offsetX - event.movementX))
      dispatch(setOffsetY(offsetY - event.movementY))
    }
  }

  const mouseEnterHandler = (event: any) => {
    setMouseXPosition(event.clientX)
    setMouseYPosition(event.clientY)
  }

  const scrollHandler = (event: any) => {
    if (!c)
    {
      dispatch(setOffsetX(workspaceRef.current.scrollLeft))
      dispatch(setOffsetY(workspaceRef.current.scrollTop))
    }
    sc(false)
  }

  const preventContextMenu = (event: any) => {
    event.preventDefault()
    return false
  }

  const onWheelHandler = (event: any) => {
    if (event.ctrlKey) {
      event.preventDefault()
      const wheelDelta = Math.sign(event.deltaY)
      if (wheelDelta < 0) {
        dispatch(increaseScale(5))
      }
      else if (wheelDelta > 0) {
        dispatch(decreaseScale(5))
      }
    }
  }

  React.useEffect(() => {
    const { _offsetX, _offsetY } = getScaledOffsets(
      offsetX,
      offsetY,
      mouseXPosition,
      mouseYPosition - 18,
      scale / 100,
      prevScale / 100,
    )

    dispatch(setOffsetX(_offsetX))
    dispatch(setOffsetY(_offsetY))
  }, [scale])

  React.useEffect(() => {
    workspaceRef.current.scrollLeft = offsetX;
    workspaceRef.current.scrollTop = offsetY; 
    scost(scale / 100)
    sc(true)
  }, [offsetX, offsetY])

  React.useEffect(() => {
    workspaceRef.current.addEventListener("mousewheel", onWheelHandler, { passive: false });

    const defaultXOffset = defaultEmptySpaceWidth - vwToPx(50) + defaultCanvasWidth / 2
    const defaultYOffset = defaultEmptySpaceHeight - vhToPx(50) + defaultCanvasHeight / 2 + 25

    dispatch(setOffsetX(defaultXOffset))
    dispatch(setOffsetY(defaultYOffset))
  }, [])

  return (
    <div className="workspace"
      onMouseEnter={mouseEnterHandler}
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
      onScroll={scrollHandler}
      ref={workspaceRef}
    >
      <div className="canvas-wrapper" style={{
        height: defaultCanvasHeight + 'px',
        width: defaultCanvasWidth + 'px',
        borderRight: defaultEmptySpaceWidth / cost + 'px solid transparent',
        borderLeft: defaultEmptySpaceWidth / cost + 'px solid transparent',
        borderTop: defaultEmptySpaceHeight / cost + 'px solid transparent',
        borderBottom: defaultEmptySpaceHeight / cost + 'px solid transparent',
        transform: `scale(${cost})`,
        transformOrigin: `0 0`,
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}