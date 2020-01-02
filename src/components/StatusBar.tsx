import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, increaseScale, decreaseScale } from '../actions'
import { Store } from '../stores'
import { MIN_SCALE, MAX_SCALE } from '../constants'
import { vhToPx, vwToPx } from '../utils' 

export interface StatusBarProps {

}

export const StatusBar = (props: StatusBarProps) => {
  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const dispatch = useDispatch()

  const handleChange = (event: any) => {
    dispatch(setScale(event.target.value, vwToPx(50), vhToPx(50)))
  }

  const plusClickHandler = () => {
    dispatch(increaseScale(5, vwToPx(50), vhToPx(50)))
  }

  const minusClickHandler = () => {
    dispatch(decreaseScale(5, vwToPx(50), vhToPx(50)))
  }
  return (
    <div className="status-bar">
      <div className="status-bar-label status-bar-element">Status bar</div>
      
      <div className="status-bar-chooser status-bar-element">
        <select>
          <option>Class diagram</option>
          <option>Component diagram</option>
          <option>Composite structure diagram</option>
          <option>Deployment diagram</option>
          <option>Object diagram</option>
          <option>Package diagram</option>
          <option>Profile diagram</option>
        </select>
      </div>

      <div className="status-bar-scaler status-bar-element">
        <div className="status-bar-scaler-label" onClick={minusClickHandler}>-</div>
        <input 
          id="typeinp" 
          type="range" 
          min={MIN_SCALE} max={MAX_SCALE}
          value={scale} 
          onChange={handleChange}
          step="5"   
          className="status-bar-scaler-slider"
        />
        <div className="status-bar-scaler-label" onClick={plusClickHandler}>+</div>
      </div>
    </div>
  )
}