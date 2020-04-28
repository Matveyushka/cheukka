import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTextSettingsAreOpen, setEntitySettingsAreOpen, setConnectionSettingsAreOpen } from '../../actions'
import { Store } from '../../stores'

export const RightActionPanel = () => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = React.useState(true)

  const [
    textSettingsAreOpen,
    entitySettingsAreOpen,
    connectionSettingsAreOpen
  ] = useSelector((state: Store) => [
    state.textSettingsAreOpen,
    state.entitySettingsAreOpen,
    state.connectionSettingsAreOpen
  ])

  return (
    <div className="action-panel action-panel-right">
      {
        isOpen ? (<>
          <button className="dark-button action-panel-button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => dispatch(setTextSettingsAreOpen(!textSettingsAreOpen))}>
            <svg
              className="action-panel-button-image"
              viewBox="-80 -80 500 500">
              <g><rect x="10.667" y="277.333" width="298.667" height="42.667" /><path d="M106.667,187.733h106.667l19.2,46.933h44.8L176,0h-32L42.667,234.667h44.8L106.667,187.733z M160,42.24l39.893,107.093h-79.787L160,42.24z" />
              </g>
            </svg>
          </button>
          <button className="dark-button action-panel-button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => dispatch(setConnectionSettingsAreOpen(!connectionSettingsAreOpen))}>
            <svg
              className="action-panel-button-image"
              viewBox="-15 -15 140 140">
              <g>
                <path d="M77.5,8.75v24.666h24.666V8.75H77.5z M98.166,29.416H81.5V12.75h16.666V29.416z M0,93.416h24.666V68.75H0V93.416z M4,72.75h16.666v16.666H4V72.75z M86.583,37.1h5v16.318h-1.751v0.016h-20.75h-2.25H14.833v11.733h-5V48.451h2.499v-0.017h54.5h2.25h17.501V37.1z" />
              </g>
            </svg>
          </button>
          <button className="dark-button action-panel-button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => dispatch(setEntitySettingsAreOpen(!entitySettingsAreOpen))}>
            <svg className="action-panel-button-image" viewBox="-40 -40 600 600">
              <g>
                <path d="M503.467,72.533h-51.2c-4.71,0-8.533,3.823-8.533,8.533v17.067H29.867c-2.355,0-4.267,1.911-4.267,4.267v268.8H8.533c-4.71,0-8.533,3.823-8.533,8.533v51.2c0,4.71,3.823,8.533,8.533,8.533h51.2c4.71,0,8.533-3.823,8.533-8.533v-17.067h413.867c2.355,0,4.267-1.911,4.267-4.267V140.8h17.067c4.71,0,8.533-3.823,8.533-8.533v-51.2C512,76.356,508.177,72.533,503.467,72.533zM51.2,422.4H17.067v-34.133H51.2V422.4z M469.333,396.8H68.267v-17.067c0-4.71-3.823-8.533-8.533-8.533H42.667v-256h401.067v17.067c0,4.71,3.823,8.533,8.533,8.533h17.067V396.8z M494.933,123.733H460.8V89.6h34.133V123.733z" />
              </g>
            </svg>
          </button>
        </>) : ""
      }

      <div className="action-panel-right-controller" onClick={() => setIsOpen(!isOpen)}></div>
    </div>
  )
}