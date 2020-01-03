import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, increaseScale, decreaseScale } from '../../actions'
import { Store } from '../../stores'
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from '../../constants'
import { vhToPx, vwToPx, getScale } from '../../utils'
import { OptionTypeBase } from 'react-select'
import { CustomSelect, CustomSelectProps } from './CustomSelect'

export interface StatusBarProps {

}

export const StatusBar = (props: StatusBarProps) => {
  const [selectedDiagramType, sdt] = React.useState<OptionTypeBase>({ value: 'class', label: 'Class diagram' })

  const scale = useSelector<Store, number>((state: Store) => state.Scale)
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

      <div className="status-bar-scalechooser">
        <CustomSelect
            value={{ value: 'profile', label: Math.round(getScale(scale) / getScale(16) * 100) + '%' }}
            onSelect={onScaleSelected}
            options={scaleSelectVariants}
          />
      </div>
    </div>
  )
}