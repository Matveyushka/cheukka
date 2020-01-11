import * as React from 'react'
import { useSelector } from 'react-redux'
import { getScale } from '../../../utils'
import { Store } from '../../../stores'
import { BlockInfo } from '../../../types'

export interface BlockProps {
  block: BlockInfo,
  deleteBlock: () => void,
  setContent: (newContent: any) => void,
}

export const Block = (props: BlockProps) => {
  const [ isHovered, setIsHovered ] = React.useState<boolean>(false)
  
  const scale = useSelector((state: Store) => getScale(state.scale))

  console.log(Array.from(props.block.content))

  return (  
    <g className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <rect 
        className="block-decoration"
        x={props.block.x * scale + 'px'}
        y={props.block.y * scale + 'px'}
        width={props.block.width * scale + 'px'}
        height={props.block.height * scale + 'px'}
        stroke={props.block.selected ? 'orange' : isHovered ? 'red' : 'black'}
        strokeWidth={1}
        fill={'white'}
      >
      </rect>
      <foreignObject
        x={props.block.x * scale + 'px'}
        y={props.block.y * scale + 'px'}
        style={{overflow: 'visible'}}
      >
        <div 
          className='block-content'
          contentEditable="true"
          onBlur={(e: any) => {
            props.setContent(e.currentTarget.innerText)
          }}
          style={{        
            minWidth: props.block.width * scale + 'px',
            left: `${(props.block.width / 2) * scale}px`,
            top: `${(props.block.height / 2) * scale}px`,
            fontSize: 0.2 * scale + 'em',
          }}
        >
          {props.block.content}
        </div>
      </foreignObject>
      <foreignObject
        x={(props.block.x + props.block.width - props.block.height / 7) * scale + 'px'}
        y={props.block.y * scale + 'px'}
        width={props.block.height / 7 * scale + 'px'}
        height={props.block.height / 7 * scale + 'px'}
      >
        <button 
          className="delete-button on-hover-visible"
          style={{
            width: `100%`,
            height: `100%`,
          }}
          onClick={props.deleteBlock}
        />
      </foreignObject>
    </g>
  )
}