import * as React from 'react'
import { Canvas } from './Canvas'
import { useDispatch, useSelector } from 'react-redux'
import { increaseScale, decreaseScale } from '../actions'
import { Store } from '../stores'
import { vhToPx, pxToVh, vwToPx, pxToVw } from '../utils'
import { defaultCanvasWidth, defaultCanvasHeight, defaultEmptySpaceWidth, defaultEmptySpaceHeight } from '../constants'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const prevScale = useSelector<Store, number>((state: Store) => state.prevScale)
  const dispatch = useDispatch()

  const workspaceRef = React.useRef(null)

  const [c, sc] = React.useState<boolean>(false)

  const [cost, scost] = React.useState<number>(scale)

  const scaleMultiplier = scale / 100
  const prevScaleMultiplier = prevScale / 100

  const defaultXOffset = defaultEmptySpaceWidth - vwToPx(50) + defaultCanvasWidth / 2
  const defaultYOffset = defaultEmptySpaceHeight - vhToPx(50) + defaultCanvasHeight / 2 + 25

  const [mouseXPosition, setMouseXPosition] = React.useState<number>(0);
  const [mouseYPosition, setMouseYPosition] = React.useState<number>(0);
  const [offsetX, setOffsetX] = React.useState<number>(defaultXOffset);
  const [offsetY, setOffsetY] = React.useState<number>(defaultYOffset);

  const mouseMoveHandler = (event: any) => {
    setMouseXPosition(event.clientX)
    setMouseYPosition(event.clientY)
    if (event.buttons === 2) {
      setOffsetX(offsetX - event.movementX)
      setOffsetY(offsetY - event.movementY)
    }
  }

  const mouseEnterHandler = (event: any) => {
    setMouseXPosition(event.clientX)
    setMouseYPosition(event.clientY)
  }

  const scrollHandler = (event: any) => {
    if (!c)
    {
      setOffsetX(workspaceRef.current.scrollLeft)
      setOffsetY(workspaceRef.current.scrollTop)
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

  const getScaledOffsets = (
    prevOffsetX: number,
    prevOffsetY: number,
    scaleFocusX: number,
    scaleFocusY: number,
    newScale: number,
    oldScale: number,
    ) => {
      const mfxo = scaleFocusX + prevOffsetX
      const mfyo = scaleFocusY + prevOffsetY
  
      const wid = defaultCanvasWidth * newScale + defaultEmptySpaceWidth * 2
      const hei = defaultCanvasHeight * newScale + defaultEmptySpaceHeight * 2
  
      const prevwid = defaultCanvasWidth * oldScale + defaultEmptySpaceWidth * 2
      const prevhei = defaultCanvasHeight * oldScale + defaultEmptySpaceHeight * 2
  
      const mfxn = (mfxo - defaultEmptySpaceWidth) * (wid - defaultEmptySpaceWidth * 2) / (prevwid - defaultEmptySpaceWidth * 2) + defaultEmptySpaceWidth
      const mfyn = (mfyo - defaultEmptySpaceHeight) * (hei - defaultEmptySpaceHeight * 2) / (prevhei - defaultEmptySpaceHeight * 2) + defaultEmptySpaceHeight
  
      const _offsetX = mfxn - scaleFocusX
      const _offsetY = mfyn - scaleFocusY

      return { _offsetX, _offsetY }
  }

  React.useEffect(() => {
    const { _offsetX, _offsetY } = getScaledOffsets(
      offsetX,
      offsetY,
      mouseXPosition,
      mouseYPosition - 18,
      scaleMultiplier,
      prevScaleMultiplier,
    )

    setOffsetX(_offsetX)
    setOffsetY(_offsetY)
  }, [scale])

  React.useEffect(() => {
    workspaceRef.current.scrollLeft = offsetX;
    workspaceRef.current.scrollTop = offsetY;
    scost(scale)
    sc(true)
  }, [offsetX, offsetY])

  React.useEffect(() => {
    workspaceRef.current.addEventListener("mousewheel", onWheelHandler, { passive: false });
    workspaceRef.current.scrollLeft = defaultXOffset
    workspaceRef.current.scrollTop = defaultYOffset
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
        borderRight: defaultEmptySpaceWidth / (cost / 100) + 'px solid transparent',
        borderLeft: defaultEmptySpaceWidth / (cost / 100) + 'px solid transparent',
        borderTop: defaultEmptySpaceHeight / (cost / 100) + 'px solid transparent',
        borderBottom: defaultEmptySpaceHeight / (cost / 100) + 'px solid transparent',
        transform: `scale(${(cost / 100)})`,
        transformOrigin: `0 0`,
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}