import * as React from 'react'
import { Entity } from '../../types'
import { getScale } from '../../utils'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { EntityBlockSvg } from '../../svg'
import { EntityContentEditor } from '../EntityContentEditor'

export interface DiagramEntityBlockProps {
  parentEntity: Entity;
  relativeX: number;
  relativeY: number;
  width: number;
  height: number;
  contentEditable: boolean;
  content?: string;
  svgComponent: EntityBlockSvg;
  updateContent: (newContent: string) => void;
}

export const DiagramEntityBlock = (props: DiagramEntityBlockProps) => {
  const [ isEditingContent, setIsEditingContent ] = React.useState<boolean>(false)

  const scale = useSelector((state: Store) => getScale(state.scale))

  const doubleClickHandler = (event: React.MouseEvent) => {
    if (props.contentEditable) {
      setIsEditingContent(true)
    }
  }

  const finishEditHandler = (newContent: string) => {
    setIsEditingContent(false)
    props.updateContent(newContent)
  }

  const x = props.parentEntity.x + props.relativeX
  const y = props.parentEntity.y + props.relativeY

  return (
    <g onDoubleClick={doubleClickHandler}>
      {props.svgComponent(x, y, props.width, props.height, scale)}
      <foreignObject
        x={x * scale}
        y={y * scale}
        style={{ overflow: 'visible' }}
      >
        <div
          className='block-content'
          onMouseDown={() => { }}

          style={{
            minWidth: props.width * scale + 'px',
            left: `${(props.width / 2) * scale}px`,
            top: `${(props.height / 2) * scale}px`,
            fontSize: 0.2 * scale + 'em',
            userSelect: 'none'
          }}
        >
          { 
            !isEditingContent ?
            props.content : ''
          }
        </div>
        {
          isEditingContent ? 
            <EntityContentEditor
              x={(props.width / 2) * scale}
              y={(props.height / 2) * scale}
              width={props.width * scale}
              height={20}
              initContent={props.content}
              finishEdit={finishEditHandler}
            />
          : ''
        }
      </foreignObject>
    </g>
  )
}