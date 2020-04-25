import * as React from 'react'

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
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

  return (<>
    <div 
      className='color-picker-header'
      style={{backgroundColor: props.currentColor}}
      onClick={() => setIsOpen(!isOpen)}>

    </div>
    {isOpen && (<div className='color-picker-body'>
      <div className='color-picker-buttons'>
      {colors}
      </div>
      <div className='dark-button color-picker-cancel' onClick={() => setIsOpen(false)}>cancel</div>
    </div>)}
  </>)
}