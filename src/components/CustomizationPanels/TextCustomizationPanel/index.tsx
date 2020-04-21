import * as React from 'react'
import { SelectList } from '../../SelectList'

export const TextCustomizationPanel = () => {
  return (
    <div className='customization-panel-text'>
      <div className='customization-panel-text-header'>
        <div className='customization-panel-text-title dark-label'>Text settings</div>
        <div className='customization-panel-text-exit dark-button'>X</div>
      </div>
      <div className='customization-panel-text-body'>
        <div className='customization-panel-text-font-family'></div>
        <div className='customization-panel-text-font-size'>
          <input 
            type="number"
            onChange={(event: any) => { document.execCommand("fontsize", false, event.target.value) }}
          />
        </div>
        <div className='customization-panel-text-font-color'></div>
        <div className='customization-panel-text-buttons row-flex'>
          <div className='customization-panel-text-bold light-button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => { document.execCommand("bold", false, '') }}>B</div>
          <div className='customization-panel-text-italic light-button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => { document.execCommand("italic", false, '') }}>I</div>
          <div className='customization-panel-text-underline light-button'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => { document.execCommand("underline", false, '') }}>U</div>
        </div>
      </div>
    </div>
  )
}