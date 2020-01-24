import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from '../../constants'
import { getScalePercent } from '../../utils'
import { CustomSelect } from './CustomSelect'
import { useStatusBarHandlers } from './handlers'
import { DiagramType } from '../../types'
import { diagramEntityGroups } from '../../types/DiagramEntityType'

export interface StatusBarProps {

}

export const StatusBar = (props: StatusBarProps) => {
  const diagramType = useSelector<Store, DiagramType>((state: Store) => state.diagramType)
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

  const diagramTypes = Array.from(diagramEntityGroups.entries()).map((entrie, index) => ({
    value: entrie[0], label: entrie[1].name
  }))

  const scaleSelectVariants = [1, 7, 10, 12, 14, 16, 18, 20, 22, 25, 31].map(x => (
    { value: x, label: getScalePercent(x) }
  ))

  return (
    <div className="status-bar">
      <div className="status-bar-label status-bar-element">Status bar</div>

      <div className="status-bar-chooser status-bar-element">
        <CustomSelect
          value={{value: diagramType, label: diagramEntityGroups.get(diagramType).name}}
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

      <button className="status-bar-fit-window status-bar-button status-bar-element" onClick={onFitWindowClickHandler}>
        <img src="assets/svg/full-size.svg"/>
      </button>

      <button className="status-bar-fit-width status-bar-button status-bar-element" onClick={onFitWidthClickHandler}>
        <img src="assets/svg/full-width.svg"/>
      </button>
    </div>
  )
}