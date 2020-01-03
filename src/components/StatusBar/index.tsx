import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, increaseScale, decreaseScale, setOffsetX, setOffsetY } from '../../actions'
import { Store } from '../../stores'
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
import { CustomSelect } from './CustomSelect'

export interface StatusBarProps {

}

export const StatusBar = (props: StatusBarProps) => {
  const [selectedDiagramType, sdt] = React.useState<OptionTypeBase>({ value: 'class', label: 'Class diagram' })

  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const dispatch = useDispatch()

  const diagramTypes = [
    { value: 'class', label: 'Class diagram' },
    { value: 'component', label: 'Component diagram' },
    { value: 'composite', label: 'Composite structure diagram' },
    { value: 'deployment', label: 'Deployment diagram' },
    { value: 'object', label: 'Object diagram' },
    { value: 'package', label: 'Package diagram' },
    { value: 'profile', label: 'Profile diagram' }
  ]

  const scaleSelectVariants = [1, 7, 10, 12, 14, 16, 18, 20, 22, 25, 31].map(x => (
    { value: x, label: Math.round(getScale(x) / getScale(16) * 100) + '%' }
  ))

  const onDiagramTypeSelected = (diagramType: OptionTypeBase) => {
    sdt(diagramType)
  }

  const onScaleSelected = (selectedScale: OptionTypeBase) => {
    dispatch(setScale(+selectedScale.value, vwToPx(50), vhToPx(50)))
  }

  const handleChange = (event: any) => {
    dispatch(setScale(+event.target.value, vwToPx(50), vhToPx(50)))
  }

  const plusClickHandler = () => {
    dispatch(increaseScale(SCALE_STEP, vwToPx(50), vhToPx(50)))
  }

  const minusClickHandler = () => {
    dispatch(decreaseScale(SCALE_STEP, vwToPx(50), vhToPx(50)))
  }

  const fitWindow = () => {
    const workspace = document.getElementsByClassName('workspace')[0]
    const canvas = document.getElementsByClassName('canvas-wrapper')[0]
    if (workspace)
    {
      const workspaceRect = workspace.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()

      const scaleSteps = [...Array(MAX_SCALE - MIN_SCALE + 1).keys()].map(x => x + MIN_SCALE)
      const perfectXScale = scaleSteps.filter(s => DEFAULT_CANVAS_WIDTH * getScale(s) <= workspaceRect.width).reverse()[0]
      const perfectYScale = scaleSteps.filter(s => DEFAULT_CANVAS_HEIGHT * getScale(s) <= workspaceRect.height).reverse()[0]
      const newScale = perfectXScale < perfectYScale ? perfectXScale : perfectYScale
      dispatch(setScale(newScale, workspaceRect.x / 2, workspaceRect.y / 2))
      dispatch(setOffsetX((DEFAULT_CANVAS_WIDTH * getScale(newScale) + DEFAULT_EMPTY_SPACE_WIDTH * 2) / 2 - workspaceRect.width / 2))
      dispatch(setOffsetY((DEFAULT_CANVAS_HEIGHT * getScale(newScale) + DEFAULT_EMPTY_SPACE_HEIGHT * 2) / 2 - workspaceRect.height / 2))
    }
  }

  return (
    <div className="status-bar">
      <div className="status-bar-label status-bar-element">Status bar</div>

      <div className="status-bar-chooser status-bar-element">
        <CustomSelect
          value={selectedDiagramType}
          onSelect={onDiagramTypeSelected}
          options={diagramTypes}
        />
      </div>

      <div className="status-bar-scaler status-bar-element">
        <div className="status-bar-scaler-label" onClick={minusClickHandler}>-</div>
        <input
          id="typeinp"
          type="range"
          min={MIN_SCALE} max={MAX_SCALE}
          value={scale}
          onChange={handleChange}
          step={SCALE_STEP}
          className="status-bar-scaler-slider"
        />
        <div className="status-bar-scaler-label" onClick={plusClickHandler}>+</div>
      </div>

      <div className="status-bar-scalechooser status-bar-element">
        <CustomSelect
            value={{ value: 'profile', label: Math.round(getScale(scale) / getScale(16) * 100) + '%' }}
            onSelect={onScaleSelected}
            options={scaleSelectVariants}
          />
      </div>

      <button className="status-bar-fit-window status-bar-element" onClick={fitWindow}><img className="svg-button" src="full-size.svg"/></button>
    </div>
  )
}