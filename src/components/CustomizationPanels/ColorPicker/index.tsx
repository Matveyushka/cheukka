import * as React from 'react'

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker = (props: ColorPickerProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const colors = [
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
  ].map((color, index) => <div
    key={index}
    className='color-picker-button'
    onClick={() => {
      props.onChange(color)
      setIsOpen(false)
    }}
    style={{backgroundColor: color, width: "1rem", height: "1rem"}}
  />)

  const getBrightness = (color: string) => {
    const r = parseInt(color.substr(1, 2), 16)
    const g = parseInt(color.substr(3, 2), 16)
    const b = parseInt(color.substr(5, 2), 16)

    return r + g + b
  }

  const getLabelColor = (backgroundColor: string) => getBrightness(backgroundColor) > 500 ? "black" : "white"

  return (<div className='color-picker'>
    <div 
      className='color-picker-header'
      style={{backgroundColor: props.currentColor, color: getLabelColor(props.currentColor)}}
      onClick={() => setIsOpen(!isOpen)}>
      {props.label}
    </div>
    {isOpen && (<div className='color-picker-body'>
      <div className='color-picker-buttons'>
      {colors}
      </div>
      <div className='dark-button color-picker-cancel' onClick={() => setIsOpen(false)}>cancel</div>
    </div>)}
  </div>)
}