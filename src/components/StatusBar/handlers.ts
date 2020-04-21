import { setScale, increaseScale, decreaseScale, setOffsetX, setOffsetY, setDiagramType } from '../../actions'
import { useDispatch } from 'react-redux'
import {
  MIN_SCALE,
  MAX_SCALE,
  SCALE_STEP,
  DEFAULT_EMPTY_SPACE_WIDTH,
  DEFAULT_EMPTY_SPACE_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT
} from '../../constants'
import { vhToPx, vwToPx, getScale } from '../../utils'
import { OptionTypeBase } from 'react-select'

export const useStatusBarHandlers = () => {
  const dispatch = useDispatch()

  const onDiagramTypeSelectedHandler = (diagramType: OptionTypeBase) => {
    dispatch(setDiagramType(diagramType.value))
  }

  const onScaleSelectedHandler = (selectedScale: OptionTypeBase) => {
    dispatch(setScale(+selectedScale.value, vwToPx(50), vhToPx(50)))
  }

  const onScaleSliderChangedHandler = (event: any) => {
    dispatch(setScale(+event.target.value, vwToPx(50), vhToPx(50)))
  }

  const onPlusClickHandler = () => {
    dispatch(increaseScale(SCALE_STEP, vwToPx(50), vhToPx(50)))
  }

  const onMinusClickHandler = () => {
    dispatch(decreaseScale(SCALE_STEP, vwToPx(50), vhToPx(50)))
  }

  const onFitWindowClickHandler = () => {
    const workspace = document.getElementsByClassName('workspace')[0]
    if (workspace) {
      const workspaceRect = workspace.getBoundingClientRect()

      const scaleSteps = [...Array(MAX_SCALE - MIN_SCALE + 1).keys()].map(x => x + MIN_SCALE)

      const perfectXScale = scaleSteps.filter(s => DEFAULT_CANVAS_WIDTH * getScale(s) <= workspaceRect.width).reverse()[0] || 1
      const perfectYScale = scaleSteps.filter(s => DEFAULT_CANVAS_HEIGHT * getScale(s) <= workspaceRect.height).reverse()[0] || 1

      const newScale = perfectXScale < perfectYScale ? perfectXScale : perfectYScale
      dispatch(setScale(newScale, 0, 0))
      dispatch(setOffsetX((DEFAULT_CANVAS_WIDTH * getScale(newScale) + DEFAULT_EMPTY_SPACE_WIDTH * 2) / 2 - workspaceRect.width / 2))
      dispatch(setOffsetY((DEFAULT_CANVAS_HEIGHT * getScale(newScale) + DEFAULT_EMPTY_SPACE_HEIGHT * 2) / 2 - workspaceRect.height / 2))
    }
  }

  const onFitWidthClickHandler = () => {
    const workspace = document.getElementsByClassName('workspace')[0]
    if (workspace) {
      const workspaceRect = workspace.getBoundingClientRect()

      const scaleSteps = [...Array(MAX_SCALE - MIN_SCALE + 1).keys()].map(x => x + MIN_SCALE)
      const newScale = scaleSteps.filter(s => DEFAULT_CANVAS_WIDTH * getScale(s) <= workspaceRect.width - vhToPx(1.4)).reverse()[0] || 1
      dispatch(setScale(newScale, 0, 0))
      dispatch(setOffsetX((DEFAULT_CANVAS_WIDTH * getScale(newScale) + DEFAULT_EMPTY_SPACE_WIDTH * 2) / 2 - workspaceRect.width / 2 + vhToPx(1.4)/2))
      dispatch(setOffsetY(DEFAULT_EMPTY_SPACE_HEIGHT * 0.98))
    }
  }

  return {
    onDiagramTypeSelectedHandler,
    onScaleSelectedHandler,
    onScaleSliderChangedHandler,
    onPlusClickHandler,
    onMinusClickHandler,
    onFitWindowClickHandler,
    onFitWidthClickHandler
  }
}