import * as React from 'react'

interface SimpleSelectOption {
  value: any;
  label?: string;
}

interface SimpleSelectProps {
  options: Array<SimpleSelectOption>;
  onChange: (value: any) => void;
  currentOptionIndex: number;
  withButtons?: boolean;
}

export const SimpleSelect = (props: SimpleSelectProps) => {
  const [isOpened, setIsOpened] = React.useState<boolean>(false)

  const [optionIndex, setOptionIndex] = React.useState<number>(props.currentOptionIndex ?? 0)

  const selectRef = React.useRef(null)

  const getOptionLabel = (option: SimpleSelectOption) => option.label ?? ("" + option.value)

  const getHeaderContent = () => props.options[optionIndex] ?
    getOptionLabel(props.options[optionIndex]) : ""

  const preventDefault = (e: React.MouseEvent<HTMLDivElement>) => e.preventDefault()

  React.useEffect(() => {
    const handler = () => {
      if (isOpened) setIsOpened(false)
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [isOpened])

  React.useEffect(() => {
    setOptionIndex(props.currentOptionIndex)
  }, [props.currentOptionIndex])

  return (
    <div className='simple-select' ref={selectRef}>
      <div className='simple-select-header'>
        {(props.withButtons ?? false) ? <div className='simple-select-button light-button'
          onMouseDown={preventDefault}
          onClick={() => {
            if (optionIndex !== 0) { 
              props.onChange(props.options[optionIndex - 1].value)
              setOptionIndex(optionIndex - 1)
            }
          }}>-</div> : ""}
        <div className='simple-select-selector'
          onMouseDown={preventDefault}
          onClick={(e) => {
            setIsOpened(!isOpened)
          }}>{getHeaderContent()}</div>
        {(props.withButtons ?? false) ? <div className='simple-select-button light-button'
          onMouseDown={preventDefault}
          onClick={() => {
            if (optionIndex < props.options.length - 1 ) { 
              props.onChange(props.options[optionIndex + 1].value)
              setOptionIndex(optionIndex + 1)
            }
          }}>+</div> : ""}
      </div>
      {
        isOpened ?
        <div className='simple-select-body'>{
          props.options.map((option, index) => (<div
            key={index}
            className='simple-select-option'
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              setOptionIndex(index)
              props.onChange(props.options[index].value)
            }}>
            {getOptionLabel(option)}
          </div>))
        }</div> :
        ""
      }
    </div>
  )
}