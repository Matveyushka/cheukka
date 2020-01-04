import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from '../../constants'
import { getScalePercent } from '../../utils'
import { CustomSelect } from './CustomSelect'
import { useStatusBarHandlers } from './handlers'

export interface StatusBarProps {

}

export const StatusBar = (props: StatusBarProps) => {
  const diagramType = useSelector<Store, string>((state: Store) => state.diagramType)
  const scale = useSelector<Store, number>((state: Store) => state.scale)

  const {
    onDiagramTypeSelectedHandler,
    onScaleSelectedHandler,
    onScaleSliderChangedHandler,
    onPlusClickHandler,
    onMinusClickHandler,
    onFitWindowClickHandler,
    onFitWidthClickHandler
  } = useStatusBarHandlers()

  const diagramTypes = [
    { value: 'Class diagram', label: 'Class diagram' },
    { value: 'Component diagram', label: 'Component diagram' },
    { value: 'Composite structure diagram', label: 'Composite structure diagram' },
    { value: 'Deployment diagram', label: 'Deployment diagram' },
    { value: 'Object diagram', label: 'Object diagram' },
    { value: 'Package diagram', label: 'Package diagram' },
    { value: 'Profile diagram', label: 'Profile diagram' }
  ]

  const scaleSelectVariants = [1, 7, 10, 12, 14, 16, 18, 20, 22, 25, 31].map(x => (
    { value: x, label: getScalePercent(x) }
  ))

  return (
    <div className="status-bar">
      <div className="status-bar-label status-bar-element">Status bar</div>

      <div className="status-bar-chooser status-bar-element">
        <CustomSelect
          value={{value: diagramType, label: diagramType}}
          onSelect={onDiagramTypeSelectedHandler}
          options={diagramTypes}
        />
      </div>

      <div className="status-bar-scaler status-bar-element">
        <div className="status-bar-scaler-label" onClick={onMinusClickHandler}>-</div>
        <input
          id="typeinp"
          type="range"
          min={MIN_SCALE} max={MAX_SCALE}
          value={scale}
          onChange={onScaleSliderChangedHandler}
          step={SCALE_STEP}
          className="status-bar-scaler-slider"
        />
        <div className="status-bar-scaler-label" onClick={onPlusClickHandler}>+</div>
      </div>

      <div className="status-bar-scalechooser status-bar-element">
        <CustomSelect
            value={{ value: 'currentScale', label: getScalePercent(scale) }}
            onSelect={onScaleSelectedHandler}
            options={scaleSelectVariants}
          />
      </div>

      <button className="status-bar-fit-window status-bar-button status-bar-element" onClick={onFitWindowClickHandler}><img src="full-size.svg"/></button>

      <button className="status-bar-fit-width status-bar-button status-bar-element" onClick={onFitWidthClickHandler}><img src="full-width.svg"/></button>
    </div>
  )
}