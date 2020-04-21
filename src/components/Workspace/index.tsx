import * as React from 'react'
import { Canvas } from '../Canvas'
import { useDispatch, useSelector } from 'react-redux'
import { increaseScale, decreaseScale, setOffsetX, setOffsetY } from '../../actions'
import { Store } from '../../stores'
import { 
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
  LEFT_MOUSE_BUTTON,
  SCALE_STEP
} from '../../constants'
import {
  getScale, vwToPx, vhToPx
} from '../../utils'

export interface DiagramCanvasProps { }

export const Workspace = () => {
  const workspaceRef = React.useRef(null)

  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const offsetX = useSelector<Store, number>((state: Store) => state.offsetX)
  const offsetY = useSelector<Store, number>((state: Store) => state.offsetY)

  const dispatch = useDispatch()

  const keyPressHandler = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === '+') {
      event.preventDefault()
      dispatch(increaseScale(SCALE_STEP, vwToPx(50), vhToPx(50)))
    }
    if (event.ctrlKey && event.key === '-') {
      event.preventDefault()
      dispatch(decreaseScale(SCALE_STEP, vwToPx(50), vhToPx(50)))
    }
  }

  const [scrolledByOffset, setScrolledByOffset] = React.useState<boolean>(false)
  const [offsettedByMouseMove, setOffsettedByMouseMove] = React.useState<boolean>(false)
  const [scrollSyncScale, setScrollSyncScale] = React.useState<number>(getScale(scale))
  const [scrollScaleBlock, setScrollScaleBlock] = React.useState<boolean>(false)

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.buttons === LEFT_MOUSE_BUTTON) {
      dispatch(setOffsetX(Math.round(offsetX - event.movementX)))
      dispatch(setOffsetY(Math.round(offsetY - event.movementY)))
      setOffsettedByMouseMove(true)
    }
  }

  const scrollHandler = () => {
    if (!scrolledByOffset)
    {
      dispatch(setOffsetX(workspaceRef.current.scrollLeft))
      dispatch(setOffsetY(workspaceRef.current.scrollTop))
    }
    setScrolledByOffset(false)
  }

  const preventContextMenu = (event: any) => {
    event.preventDefault()
  }

  const onWheelHandler = (event: WheelEvent) => {
    if (event.ctrlKey && !scrollScaleBlock) {
      event.preventDefault()
      
      const workspaceBoundingClientRect = workspaceRef.current.getBoundingClientRect()
      const scaleFocusX = event.clientX - workspaceBoundingClientRect.left
      const scaleFocusY = event.clientY - workspaceBoundingClientRect.top

      const wheelDelta = Math.sign(event.deltaY)
      if (wheelDelta < 0) {
        dispatch(increaseScale(SCALE_STEP, scaleFocusX, scaleFocusY))
      }
      else if (wheelDelta > 0) {
        dispatch(decreaseScale(SCALE_STEP, scaleFocusX, scaleFocusY))
      }

      setScrollScaleBlock(true)
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', keyPressHandler);

    workspaceRef.current.addEventListener("mousewheel", onWheelHandler, { passive: false });

    const workspaceBoundingClientRect = workspaceRef.current.getBoundingClientRect()

    const workspaceHalfWidth = workspaceBoundingClientRect.width / 2

    const defaultXOffset = DEFAULT_EMPTY_SPACE_WIDTH - workspaceHalfWidth + DEFAULT_CANVAS_WIDTH / 2 * getScale(scale)
    const defaultYOffset = DEFAULT_EMPTY_SPACE_HEIGHT * 0.95

    dispatch(setOffsetX(defaultXOffset))
    dispatch(setOffsetY(defaultYOffset))
  }, [])

  React.useEffect(() => {
    if (Math.abs(offsetX - workspaceRef.current.scrollLeft) > 1) {
      workspaceRef.current.scrollLeft = offsetX
      dispatch(setOffsetX(workspaceRef.current.scrollLeft))
    }
    if (Math.abs(offsetY - workspaceRef.current.scrollTop) > 1) {
      workspaceRef.current.scrollTop = offsetY
      dispatch(setOffsetY(workspaceRef.current.scrollTop))
    }
    setScrollScaleBlock(false)
  }, [scrollSyncScale])

  React.useEffect(() => {
    workspaceRef.current.scrollLeft = offsetX;
    workspaceRef.current.scrollTop = offsetY; 

    if (offsettedByMouseMove)
    {
      if (Math.abs(offsetX - workspaceRef.current.scrollLeft) > 1) {
        workspaceRef.current.scrollLeft = offsetX
        dispatch(setOffsetX(workspaceRef.current.scrollLeft))
      }
      if (Math.abs(offsetY - workspaceRef.current.scrollTop) > 1) {
        workspaceRef.current.scrollTop = offsetY
        dispatch(setOffsetY(workspaceRef.current.scrollTop))
      }
      setOffsettedByMouseMove(false)
    }

    setScrollSyncScale(getScale(scale))
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
        borderRight: DEFAULT_EMPTY_SPACE_WIDTH / scrollSyncScale + 'px solid transparent',
        borderLeft: DEFAULT_EMPTY_SPACE_WIDTH / scrollSyncScale + 'px solid transparent',
        borderTop: DEFAULT_EMPTY_SPACE_HEIGHT / scrollSyncScale + 'px solid transparent',
        borderBottom: DEFAULT_EMPTY_SPACE_HEIGHT / scrollSyncScale + 'px solid transparent',
        transform: `Scale(${scrollSyncScale})`,
        transformOrigin: `0 0`,
      }}>
        <Canvas>
        </Canvas>
      </div>
    </div>)
}