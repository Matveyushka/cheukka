import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setScale, increaseScale, decreaseScale, setScaleFocusX, setScaleFocusY } from '../actions'
import { Store } from '../stores'

export interface StatusBarProps {

}

export const StatusBar = (props: StatusBarProps) => {
  const scale = useSelector<Store, number>((state: Store) => state.scale)
  const dispatch = useDispatch()

  const handleChange = (event: any) => {
    dispatch(setScale(event.target.value))
  }

  const plusClickHandler = () => {
    dispatch(increaseScale(5))
  }

  const minusClickHandler = () => {
    dispatch(decreaseScale(5))
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
          min="0" max="200" 
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