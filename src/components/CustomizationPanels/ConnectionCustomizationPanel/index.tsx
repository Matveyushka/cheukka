import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConnectionSettingsAreOpen, setConnectionSettings, updateConnection, setDefaultConnectionSettings } from '../../../actions'
import { SimpleSelect } from '../SImpleSelect'
import { ColorPicker } from '../ColorPicker'
import { Store } from '../../../stores'

interface ConnectionCustomizationPanelProps {

}

export const ConnectionCustomizationPanel = (props: ConnectionCustomizationPanelProps) => {
  const dispatch = useDispatch()

  const [
    connectionSettings,
    connections
  ] = useSelector((state: Store) => [
    state.connectionSettings,
    state.diagramConnections
  ])

  const thickness = [1, 2, 3, 4, 5]

  const thicknessOptions = thickness.map(option => ({ value: option }))

  const arrowSize = [0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.5, 3, 4, 5]

  const arrowSizeOptions = arrowSize.map(option => ({ value: option }))

  return (
    <div className='customization-panel customization-panel-connection' onMouseDown={(event) => event.preventDefault()}>
      <div className='customization-panel-header'>
        <div className='customization-panel-title dark-label'>Connection settings</div>
        <div className='customization-panel-exit dark-button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => dispatch(setConnectionSettingsAreOpen(false))}>X</div>
      </div>
      <div className='customization-panel-body'>
        <div className='customization-panel-connection-setting'>
          width
          <SimpleSelect
            options={thicknessOptions}
            onChange={(thickness) => { 
              dispatch(setConnectionSettings({...connectionSettings, thickness}))
              Array.from(connections.entries()).forEach(entrie => {
                if (entrie[1].selected) {
                  dispatch(updateConnection(entrie[0], { ...entrie[1], settings: { ...entrie[1].settings, thickness } }))
                }
              })
            }}
            currentOptionIndex={thickness.indexOf(connectionSettings.thickness)}
            withButtons={true}
          />
        </div>
        <div className='customization-panel-connection-setting'>
          arrow size
          <SimpleSelect
            options={arrowSizeOptions}
            onChange={(arrowSize) => { 
              dispatch(setConnectionSettings({...connectionSettings, arrowSize}))
              Array.from(connections.entries()).forEach(entrie => {
                if (entrie[1].selected) {
                  dispatch(updateConnection(entrie[0], { ...entrie[1], settings: { ...entrie[1].settings, arrowSize } }))
                }
              }) 
            }}
            currentOptionIndex={arrowSize.indexOf(connectionSettings.arrowSize)}
            withButtons={true}
          />
        </div>
        <div className='customization-panel-connection-setting'>
          <ColorPicker 
            currentColor={connectionSettings.color}
            onChange={(color) => { 
              dispatch(setConnectionSettings({...connectionSettings, color})) 
              Array.from(connections.entries()).forEach(entrie => {
                if (entrie[1].selected) {
                  dispatch(updateConnection(entrie[0], { ...entrie[1], settings: { ...entrie[1].settings, color } }))
                }
              }) 
            }}
          />
        </div>
        <div
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => { dispatch(setDefaultConnectionSettings(connectionSettings)) }}
          className='light-button '
        >Save as default</div>
      </div>
    </div>
  )
}