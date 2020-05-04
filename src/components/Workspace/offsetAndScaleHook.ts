import * as React from 'react'
import { increaseScale, decreaseScale, setOffsetX, setOffsetY } from '../../actions'
import { useDispatch, useSelector } from 'react-redux'
import { Store } from '../../stores'
import { 
  RIGHT_MOUSE_BUTTON,
  SCALE_STEP,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  START_SCALE,
  DEFAULT_CANVAS_HEIGHT
} from '../../constants'
import { getScale } from '../../utils'

export const useWorkspaceOffsetAndScale = () => {
  const dispatch = useDispatch()

  const workspaceRef = React.useRef(null)

  const scale = useSelector<Store, number>((state: Store) => state.scaleLevel)
  const offsetX = useSelector<Store, number>((state: Store) => state.offsetX)
  const offsetY = useSelector<Store, number>((state: Store) => state.offsetY)

  const [scrolledByScaling, setScrolledByScaling] = React.useState<boolean>(false)
  const [scrollSyncScale, setScrollSyncScale] = React.useState<number>(getScale(scale))
  const [scrollScaleBlock, setScrollScaleBlock] = React.useState<boolean>(false)

  const keyPressHandler = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === '+') {
      event.preventDefault()
      dispatch(increaseScale(SCALE_STEP, workspaceRef.current.clientWidth / 2, workspaceRef.current.clientHeight / 2))
    }
    if (event.ctrlKey && event.key === '-') {
      event.preventDefault()
      dispatch(decreaseScale(SCALE_STEP, workspaceRef.current.clientWidth / 2, workspaceRef.current.clientHeight / 2))
    }
  }

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.buttons === RIGHT_MOUSE_BUTTON) {
      const maxOffsetX = DEFAULT_EMPTY_SPACE_WIDTH * 2 + DEFAULT_CANVAS_WIDTH * scrollSyncScale - workspaceRef.current.clientWidth
      const maxOffsetY = DEFAULT_EMPTY_SPACE_HEIGHT * 2 + DEFAULT_CANVAS_HEIGHT * scrollSyncScale - workspaceRef.current.clientHeight

      const newOffsetX = Math.round(offsetX - event.movementX)
      const newOffsetY = Math.round(offsetY - event.movementY)

      dispatch(setOffsetX(newOffsetX < 0 ? 0 : newOffsetX > maxOffsetX ? maxOffsetX : newOffsetX))
      dispatch(setOffsetY(newOffsetY < 0 ? 0 : newOffsetY > maxOffsetY ? maxOffsetY : newOffsetY))
    }
  }

  const scrollHandler = () => {
    if (!scrolledByScaling)
    {
      dispatch(setOffsetX(workspaceRef.current.scrollLeft))
      dispatch(setOffsetY(workspaceRef.current.scrollTop))
    }
    setScrolledByScaling(false)
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
    window.addEventListener('keydown', keyPressHandler)

    workspaceRef.current.addEventListener('mousewheel', onWheelHandler, { passive: false })

    const workspaceHalfWidth = workspaceRef.current.clientWidth / 2


    const defaultXOffset = DEFAULT_EMPTY_SPACE_WIDTH - workspaceHalfWidth + DEFAULT_CANVAS_WIDTH / 2 * getScale(START_SCALE)
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

    setScrollSyncScale(getScale(scale))
    setScrolledByScaling(true)
  }, [offsetX, offsetY])

  return {
    scale: scrollSyncScale,
    workspaceRef,
    mouseMoveHandler,
    scrollHandler,
    preventContextMenu,
  }
}