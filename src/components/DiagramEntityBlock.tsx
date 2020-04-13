import * as React from 'react'
import { Entity, EntityPart } from '../types'
import { getScale } from '../utils'
import { useSelector } from 'react-redux'
import { Store } from '../stores'
import { EntityContentEditor } from './EntityContentEditor'

export interface DiagramEntityBlockProps {
  parentEntity: Entity;
  entityPart: EntityPart
  updateContent: (newContent: string) => void;
  scale: number;
}

export const DiagramEntityBlock = (props: DiagramEntityBlockProps) => {
  const [ isEditingContent, setIsEditingContent ] = React.useState<boolean>(false)

  const block = props.entityPart.renderer(props.parentEntity)

  const doubleClickHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (props.entityPart.contentEditable) {
      setIsEditingContent(true)
    }
  }

  const finishEditHandler = (newContent: string) => {
    setIsEditingContent(false)
    props.updateContent(newContent)
  }

  const x = props.parentEntity.x + block.relativeX
  const y = props.parentEntity.y + block.relativeY

  return (
    <g onDoubleClick={doubleClickHandler}>
      {block.svgComponent(x, y, block.width, block.height, props.scale)}
      <foreignObject
        x={x * props.scale}
        y={y * props.scale}
        style={{ overflow: 'visible' }}
      >
        <div
          className='block-content'
          onMouseDown={() => { }}

          style={{
            minWidth: block.width * props.scale + 'px',
            left: `${(block.width / 2) * props.scale}px`,
            top: `${(block.height / 2) * props.scale}px`,
            fontSize: 0.2 * props.scale + 'em',
            userSelect: 'none'
          }}
        >
          { 
            !isEditingContent ?
            props.entityPart.content : ''
          }
        </div>
        {
          isEditingContent ? 
            <EntityContentEditor
              x={(block.width / 2) * props.scale}
              y={(block.height / 2) * props.scale}
              width={block.width * props.scale}
              height={20}
              initContent={props.entityPart.content}
              finishEdit={finishEditHandler}
            />
          : ''
        }
      </foreignObject>
    </g>
  )
}