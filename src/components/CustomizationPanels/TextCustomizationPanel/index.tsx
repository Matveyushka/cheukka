import * as React from 'react'
import { SelectList } from '../../SelectList'
import { useSelector, useDispatch } from 'react-redux'
import { SimpleSelect } from '../SImpleSelect'
import { Store } from '../../../stores'
import { setTextSettings, setTextSettingsAreOpen, setDefaultTextSettings } from '../../../actions'

export const TextCustomizationPanel = () => {
  const dispatch = useDispatch()

  const [
    textSettings,
  ] = useSelector((state: Store) => [
    state.textSettings
  ])

  const fontSizeOptions = [
    9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 96
  ]

  const fontFamilies = [
    'Arial', 'Times New Roman', 'Courier New', 'Calibri'
  ]

  const colorRef = React.useRef(null)

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
            options={fontFamilies.map(option => ({ value: option }))}
            onChange={(value) => {
              dispatch(setTextSettings({ ...textSettings, fontFamily: value }))
              document.execCommand("fontName", false, value)
            }}
            defaultOptionIndex={fontFamilies.indexOf(textSettings.fontFamily)}
          />}
        </div>
        <div className='customization-panel-text-font-size'>
          <SimpleSelect
            options={fontSizeOptions.map(option => ({ value: option }))}
            onChange={(value) => {
              dispatch(setTextSettings({ ...textSettings, fontSize: value }))
              document.execCommand("fontSize", false, "7")
              Array.from(document.getElementsByTagName("font")).forEach((element) => {
                if (element.size == "7") {
                  element.removeAttribute("size")
                  element.style.fontSize = "" + value + "px"
                }
              })
            }}
            defaultOptionIndex={fontSizeOptions.indexOf(textSettings.fontSize)}
            withButtons={true}
          />
        </div>
        <div className='customization-panel-text-font-color'>
          <input type="color"
            ref={colorRef}
            className='customization-panel-text-font-color-chooser'
            onMouseDown={(e) => e.preventDefault()}
            onChange={() => {
              const value = colorRef.current.value
              dispatch(setTextSettings({ ...textSettings, fontSize: value }))
              document.execCommand('foreColor', false, value);
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
        >
          Save as default
        </div>
      </div>
    </div>
  )
}