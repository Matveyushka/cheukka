import * as React from 'react'
import { SimpleSelect } from '../SImpleSelect'
import { ColorPicker } from '../ColorPicker'
import { useSelector, useDispatch } from 'react-redux'
import { Store } from '../../../stores'
import { setEntitySettings, setEntitySettingsAreOpen, updateEntity, setDefaultEntitySettings } from '../../../actions'

interface EntityCustomiationPanelProps {

}

export const EntityCustomizationPanel = (props: EntityCustomiationPanelProps) => {
  const dispatch = useDispatch()

  const [
    entitySettings,
    entities,
  ] = useSelector((state: Store) => [
    state.entitySettings,
    state.diagramEntities
  ])

  const thickness = [1, 2, 3, 4, 5]

  const thicknessOptions = thickness.map(option => ({ value: option }))

  return (
    <div className='customization-panel customization-panel-entity' onMouseDown={(event) => event.preventDefault()}>
      <div className='customization-panel-header'>
        <div className='customization-panel-title dark-label'>Block settings</div>
        <div className='customization-panel-exit dark-button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => dispatch(setEntitySettingsAreOpen(false))}>X</div>
      </div>
      <div className='customization-panel-body'>
        <div className='customization-panel-entity-setting'>
          border width
          <SimpleSelect
            options={thicknessOptions}
            onChange={(thickness) => {
              dispatch(setEntitySettings({ ...entitySettings, thickness }))
              Array.from(entities.entries()).forEach(entrie => {
                if (entrie[1].selected) {
                  dispatch(updateEntity(entrie[0], { ...entrie[1], settings: { ...entrie[1].settings, thickness } }))
                }
              })
            }}
            currentOptionIndex={thickness.indexOf(entitySettings.thickness)}
            withButtons={true}
          />
        </div>
        <div className='customization-panel-entity-setting'>
          <ColorPicker
            currentColor={entitySettings.borderColor}
            onChange={(borderColor) => {
              dispatch(setEntitySettings({ ...entitySettings, borderColor }))
              Array.from(entities.entries()).forEach(entrie => {
                if (entrie[1].selected) {
                  dispatch(updateEntity(entrie[0], { ...entrie[1], settings: { ...entrie[1].settings, borderColor } }))
                }
              })
            }}
            label="border color"
          />
        </div>
        <div className='customization-panel-entity-setting'>
          <ColorPicker
            currentColor={entitySettings.backgroundColor}
            onChange={(backgroundColor) => {
              dispatch(setEntitySettings({ ...entitySettings, backgroundColor }))
              Array.from(entities.entries()).forEach(entrie => {
                if (entrie[1].selected) {
                  dispatch(updateEntity(entrie[0], { ...entrie[1], settings: { ...entrie[1].settings, backgroundColor } }))
                }
              })
            }}
            label="background color"
          />
        </div>
        <div
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => { dispatch(setDefaultEntitySettings(entitySettings)) }}
          className='light-button '
        >Save as default</div>
      </div>
    </div>
  )
}