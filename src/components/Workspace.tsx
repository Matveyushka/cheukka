import * as React from 'react'
import { Canvas } from './Canvas'
import { useDispatch, useSelector } from 'react-redux'
import { increaseScale, decreaseScale, setOffsetX, setOffsetY } from '../actions'
import { Store } from '../stores'
import { vhToPx, vwToPx } from '../utils'
import { 
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
  LEFT_MOUSE_BUTTON
} from '../constants'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const workspaceRef = React.useRef(null)

  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const offsetX = useSelector<Store, number>((state: Store) => state.offsetX)
  const offsetY = useSelector<Store, number>((state: Store) => state.offsetY)

  const dispatch = useDispatch()

  const [scrolledByOffset, setScrolledByOffset] = React.useState<boolean>(false)
  const [offsetSyncScale, setOffsetSyncScale] = React.useState<number>(scale)

  const mouseMoveHandler = (event: any) => {
    if (event.buttons === LEFT_MOUSE_BUTTON) {
      dispatch(setOffsetX(offsetX - event.movementX))
      dispatch(setOffsetY(offsetY - event.movementY))
    }
  }

  const scrollHandler = (event: any) => {
    if (!scrolledByOffset)
    {
      dispatch(setOffsetX(workspaceRef.current.scrollLeft))
      dispatch(setOffsetY(workspaceRef.current.scrollTop))
    }
    setScrolledByOffset(false)
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
        dispatch(increaseScale(5, event.clientX, event.clientY - 18))
      }
      else if (wheelDelta > 0) {
        dispatch(decreaseScale(5, event.clientX, event.clientY - 18))
      }
    }
  }

  React.useEffect(() => {
    workspaceRef.current.addEventListener("mousewheel", onWheelHandler, { passive: false });

    const defaultXOffset = DEFAULT_EMPTY_SPACE_WIDTH - vwToPx(50) + DEFAULT_CANVAS_WIDTH / 2
    const defaultYOffset = DEFAULT_EMPTY_SPACE_HEIGHT - vhToPx(50) + DEFAULT_CANVAS_HEIGHT / 2 + 25

    dispatch(setOffsetX(defaultXOffset))
    dispatch(setOffsetY(defaultYOffset))
  }, [])

  React.useEffect(() => {
    workspaceRef.current.scrollLeft = offsetX;
    workspaceRef.current.scrollTop = offsetY; 
    setOffsetSyncScale(scale / 100)
    setScrolledByOffset(true)
  }, [offsetX, offsetY])

  return (
    <div className="workspace"
      onMouseMove={mouseMoveHandler}
      onContextMenu={preventContextMenu}
      onScroll={scrollHandler}
      ref={workspaceRef}
    >
      <div className="canvas-wrapper" style={{
        height: DEFAULT_CANVAS_HEIGHT + 'px',
        width: DEFAULT_CANVAS_WIDTH + 'px',
        borderRight: DEFAULT_EMPTY_SPACE_WIDTH / offsetSyncScale + 'px solid transparent',
        borderLeft: DEFAULT_EMPTY_SPACE_WIDTH / offsetSyncScale + 'px solid transparent',
        borderTop: DEFAULT_EMPTY_SPACE_HEIGHT / offsetSyncScale + 'px solid transparent',
        borderBottom: DEFAULT_EMPTY_SPACE_HEIGHT / offsetSyncScale + 'px solid transparent',
        transform: `scale(${offsetSyncScale})`,
        transformOrigin: `0 0`,
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}