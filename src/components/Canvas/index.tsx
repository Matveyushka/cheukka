import * as React from 'react'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { getScale, roundCoordinateOrSize, isPointInRectangle } from '../../utils'
import { DEFAULT_CANVAS_WIDTH } from '../../constants'
import { getBackgroundSvg } from './Background'
import { BlockInfo } from '../../types'
import { Block } from './Block'

export interface CanvasProps { }

enum MouseMode {
  default,
  dragging,
}

export const Canvas = (props: CanvasProps) => {
  const scale = useSelector((state: Store) => state.scale)

  const [ blocks, setBlocks ] = React.useState<Array<BlockInfo>>([])
  const [ mode, setMode ] = React.useState<MouseMode>(MouseMode.default)

  const setBlockAtIndex = (block: BlockInfo, index: number) => {
    setBlocks(blocks.map((b, i) => i === index ? block : b))
  }

  const getCanvasX = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientRect = event.currentTarget.getBoundingClientRect()
    return (event.clientX - clientRect.left) / getScale(scale)
  }

  const getCanvasY = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientRect = event.currentTarget.getBoundingClientRect()
    return (event.clientY - clientRect.top) / getScale(scale)
  }

  const getHoveredBlock = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clientX = getCanvasX(event)
    const clientY = getCanvasY(event)

    return blocks.filter(block => 
      isPointInRectangle(clientX, clientY, block.x, block.y, block.width, block.height)
    )[0] || null
  }

  const getHoveredBlockIndex = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) : null | number => {
    const clientX = getCanvasX(event)
    const clientY = getCanvasY(event)

    const result = blocks.reduce((desiredIndex, block, currentIndex) => 
    isPointInRectangle(clientX, clientY, block.x, block.y, block.width, block.height) ? currentIndex : desiredIndex
    , -1)

    return result === -1 ? null : result
  }

  const doubleClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mode !== MouseMode.default) return;
    if (getHoveredBlock(event) !== null) return;
    const width = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH * 0.1)
    const height = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH * 0.066)

    const x = roundCoordinateOrSize(getCanvasX(event) - width / 2)
    const y = roundCoordinateOrSize(getCanvasY(event) - height / 2)

    setBlocks([...blocks, {x, y, width, height, content: 'Write text here', selected: false}])
  } 

  const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const hoveredBlockIndex = getHoveredBlockIndex(event)
    if (hoveredBlockIndex !== null) {
      setBlockAtIndex({...getHoveredBlock(event), selected: true}, hoveredBlockIndex)
    }
  }

  const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    blocks.forEach((block, index) => { if (block.selected) setBlockAtIndex({...block, selected: false}, index)})
  }

  const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    blocks.forEach((block, index) => { 
      if (block.selected) {
        const width = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH * 0.1)
        const height = roundCoordinateOrSize(DEFAULT_CANVAS_WIDTH * 0.066)
    
        const x = roundCoordinateOrSize(getCanvasX(event) - width / 2)
        const y = roundCoordinateOrSize(getCanvasY(event) - height / 2)
        setBlockAtIndex({...block, x, y}, index)
      }
    })
  }

  const getBlocks = () => {
    return blocks.map((block, index) => <Block key={index}
      block={{  
        x: block.x,
        y: block.y,
        width: block.width,
        height: block.height,
        content: block.content,
        selected: block.selected}} 
      deleteBlock={() => {setBlocks([...blocks.slice(0, index), ...blocks.slice(index + 1)])}}
      setContent={(newContent) => {
          setBlocks(blocks.map((b, i) => index === i ? {...b, content: newContent} : b))
        }
      } />)
  }

  const backgroundBlocksAmountInWidth = (() => {
    if (scale > 10) return 10
    if (scale > 5) return 5
    return 2
  })()

  return (
    <div className="canvas-main">
      <div 
        onDoubleClick={doubleClickHandler}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        className="diagram-canvas" 
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