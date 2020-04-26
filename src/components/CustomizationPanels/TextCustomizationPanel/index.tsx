import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SimpleSelect } from '../SImpleSelect'
import { Store } from '../../../stores'
import { setTextSettings, setTextSettingsAreOpen, setDefaultTextSettings } from '../../../actions'
import { ColorPicker } from '../ColorPicker'
import { applyFontSize } from '../../../utils'

export const TextCustomizationPanel = () => {
  const dispatch = useDispatch()

  const [
    textSettings,
  ] = useSelector((state: Store) => [
    state.textSettings
  ])

  const fontSizes = [ 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 96 ]

  const fontSizeOptions = fontSizes.map(option => ({ value: option }))

  const fontFamilies = [
    'Arial', 'Times New Roman', 'Courier New', 'Calibri'
  ]

  const fontFamilyOptions = fontFamilies.map(option => ({ value: option }))

  return (
    <div className='customization-panel-text' onMouseDown={(event) => event.preventDefault()}>
      <div className='customization-panel-text-header'>
        <div className='customization-panel-text-title dark-label'>Text settings</div>
        <div className='customization-panel-text-exit dark-button'
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => dispatch(setTextSettingsAreOpen(false))}>X</div>
      </div>
      <div className='customization-panel-text-body'>
        <div className='customization-panel-text-font-family'>
          {<SimpleSelect
            options={fontFamilyOptions}
            onChange={(fontFamily) => {
              dispatch(setTextSettings({ ...textSettings, fontFamily }))
              document.execCommand("fontName", false, fontFamily)
            }}
            currentOptionIndex={fontFamilies.indexOf(textSettings.fontFamily)}
          />}
        </div>
        <div className='customization-panel-text-font-size'>
          <SimpleSelect
            options={fontSizeOptions}
            onChange={(fontSize) => {
              dispatch(setTextSettings({ ...textSettings, fontSize }))
              applyFontSize(fontSize)
            }}
            currentOptionIndex={fontSizes.indexOf(textSettings.fontSize)}
            withButtons={true}
          />
        </div>
        <div className='customization-panel-text-font-color'>
          <ColorPicker
            currentColor={textSettings.color}
            onChange={(color) => {
              dispatch(setTextSettings({ ...textSettings, color }))
              document.execCommand('foreColor', false, color)
            }}
          />
        </div>
        <div className='customization-panel-text-buttons row-flex'>
          <div className={`customization-panel-text-bold ${textSettings.bold ? 'dark-button' : 'light-button'}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              dispatch(setTextSettings({ ...textSettings, bold: !textSettings.bold }))
              document.execCommand("bold", false, '')
            }}>B</div>
          <div className={`customization-panel-text-italic ${textSettings.italic ? 'dark-button' : 'light-button'}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              dispatch(setTextSettings({ ...textSettings, italic: !textSettings.italic }))
              document.execCommand("italic", false, '')
            }}>I</div>
          <div className={`customization-panel-text-underline ${textSettings.underline ? 'dark-button' : 'light-button'}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              dispatch(setTextSettings({ ...textSettings, underline: !textSettings.underline }))
              document.execCommand("underline", false, '')
            }}>U</div>
        </div>
        <div
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => { dispatch(setDefaultTextSettings(textSettings)) }}
          className='light-button '
        >Save as default</div>
      </div>
    </div>
  )
}