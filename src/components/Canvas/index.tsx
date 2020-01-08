import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { getScale } from '../../utils'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'

interface Block {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface CanvasProps { }

export const Canvas = (props: CanvasProps) => {
  const scale = useSelector((state: Store) => state.scale)
  const [ blocks, setBlocks ] = React.useState<Array<Block>>([])

  const clickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientRect = event.currentTarget.getBoundingClientRect()
    setBlocks([...blocks, {
      x: (event.clientX - clientRect.left) / getScale(scale) - DEFAULT_CANVAS_WIDTH * 0.1 / 2,
      y: (event.clientY - clientRect.top) / getScale(scale) - DEFAULT_CANVAS_WIDTH * 0.066 / 2,
      width: DEFAULT_CANVAS_WIDTH * 0.1,
      height: DEFAULT_CANVAS_WIDTH * 0.066,
    }])
  } 

  const getBlocks = () => {
    return blocks.map((block, index) => (
      <rect 
        key={index} 
        x={block.x + 'px'}
        y={block.y + 'px'}
        width={block.width + 'px'}
        height={block.height + 'px'}
        stroke={`black`}
        strokeWidth={1 / getScale(scale)}
        fill={'white'}
      >
      </rect>
    ))
  }

  return (
    <div className="canvas-main">
      <div className="background-canvas"></div>
      <div 
        className="diagram-canvas" 
        onClick={clickHandler}
        style={{
          boxShadow: `0 0 ${5 / getScale(scale)}px gray`
        }}
      >
        <svg width="100%" height="100%" >
          {getBlocks()}
        </svg>
      </div>
    </div>
  )
}