import * as React from 'react'
import { useDispatch } from 'react-redux'
import { recoveryLastDiagramEntitiesStamp } from '../../actions'

export const LeftActionPanel = () => {
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="action-panel action-panel-left">
      {isOpen ? (<>
        <button className="dark-button action-panel-button" onClick={() => dispatch(recoveryLastDiagramEntitiesStamp())}>
          <svg className="action-panel-button-image" version="1.1" viewBox="0 0 512 512"><g><path d="M447.9,368.2c0-16.8,3.6-83.1-48.7-135.7c-35.2-35.4-80.3-53.4-143.3-56.2V96L64,224l192,128v-79.8   c40,1.1,62.4,9.1,86.7,20c30.9,13.8,55.3,44,75.8,76.6l19.2,31.2H448C448,389.9,447.9,377.1,447.9,368.2z" /></g></svg>
        </button>
        <button className="dark-button action-panel-button">
          <svg className="action-panel-button-image" transform="scale (-1, 1)" transform-origin="center" viewBox="0 0 512 512"><g><path d="M447.9,368.2c0-16.8,3.6-83.1-48.7-135.7c-35.2-35.4-80.3-53.4-143.3-56.2V96L64,224l192,128v-79.8   c40,1.1,62.4,9.1,86.7,20c30.9,13.8,55.3,44,75.8,76.6l19.2,31.2H448C448,389.9,447.9,377.1,447.9,368.2z" /></g></svg>
        </button>
      </>) : ""}
      <div className="action-panel-left-controller" onClick={() => setIsOpen(!isOpen)}></div>
    </div >
  )
}