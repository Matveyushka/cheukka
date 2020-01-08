import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { getScale } from '../../utils'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'
import { getBackgroundSvg } from './Background'

interface Block {
  x: number,
  y: number,
  width: number,
  height: number,
  content: string,
}

export interface CanvasProps { }

export const Canvas = (props: CanvasProps) => {
  const scale = useSelector((state: Store) => state.scale)

  const [ blocks, setBlocks ] = React.useState<Array<Block>>([])
  const [ mode, setMode ] = React.useState<string>('default')

  const clickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientRect = event.currentTarget.getBoundingClientRect()
    const clientX = (event.clientX - clientRect.left) / getScale(scale)
    const clientY = (event.clientY - clientRect.top) / getScale(scale)

    const choosedBlocks = blocks.filter(block => {
      return block.x <= clientX && (block.x + block.width) >= clientX &&
      block.y <= clientY && (block.y + block.height) >= clientY}
    )

    if (choosedBlocks.length > 0) {
      return;
    }

    setBlocks([...blocks, {
      x: clientX - DEFAULT_CANVAS_WIDTH * 0.1 / 2,
      y: clientY - DEFAULT_CANVAS_WIDTH * 0.066 / 2,
      width: DEFAULT_CANVAS_WIDTH * 0.1,
      height: DEFAULT_CANVAS_WIDTH * 0.066,
      content: '123',
    }])
  } 

  const getBlocks = () => {
    return blocks.map((block, index) => (
      <g key={index + 'g'}
      onClick={(e: React.MouseEvent<SVGGElement, MouseEvent>)=>e.currentTarget}>
        <rect 
          x={block.x * getScale(scale) + 'px'}
          y={block.y * getScale(scale) + 'px'}
          width={block.width * getScale(scale) + 'px'}
          height={block.height * getScale(scale) + 'px'}
          stroke={`black`}
          strokeWidth={1}
          fill={'white'}
        >
        </rect>
        <foreignObject
          x={block.x * getScale(scale) + 'px'}
          y={block.y * getScale(scale) + 'px'}
          style={{overflow: 'visible'}}
        >
          <div 
            className='editable'
            contentEditable='true'
            onBlur={(e: React.FormEvent<HTMLDivElement>)=>{
              setBlocks(blocks.map((block, _index) => {
                if (index === _index) {
                  return ({
                    ...block,
                    content: e.currentTarget.innerText
                  })
                }
                return block
              }))
            }}
            style={{        
              position: 'absolute',      
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              left: `${(block.width / 2) * getScale(scale)}px`,
              top: `${(block.height / 2) * getScale(scale)}px`,
              transform: 'translateX(-50%) translateY(-50%)',
              border: 0,
              background: 'none',
              fontSize: 0.2 * getScale(scale) + 'em',
            }}
          >
            {block.content}
          </div>
        </foreignObject>
        <foreignObject
          x={(block.x + block.width - 3) * getScale(scale) + 'px'}
          y={block.y * getScale(scale) + 'px'}
          width={3 * getScale(scale) + 'px'}
          height={3 * getScale(scale) + 'px'}
        >
          <button 
            className="delete-button"
            style={{
              width: `${3 * getScale(scale)}px`,
              height: `${3 * getScale(scale)}px`,
            }}
            onClick={() => setBlocks(blocks.filter((_, _index) => _index != index))}
          />
        </foreignObject>
      </g>
    ))
  }

  const backgroundBlocksAmountInWidth = (() => {
    if (scale > 10) return 10
    if (scale > 5) return 5
    return 2
  })()

  return (
    <div className="canvas-main">
      <div className="background-canvas"></div>
      <div 
        className="diagram-canvas" 
        onDoubleClick={clickHandler}
        style={{ 
          backgroundImage: `url('data:image/svg+xml;base64,${getBackgroundSvg(scale, backgroundBlocksAmountInWidth)}')`,
          backgroundSize: `${100 / backgroundBlocksAmountInWidth}%`,
        }}
      >
        <svg width="100%" height="100%">
          {getBlocks()}
        </svg>
      </div>
    </div>
  )
}