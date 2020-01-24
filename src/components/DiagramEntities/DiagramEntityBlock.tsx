import * as React from 'react'
import { Entity } from '../../types'
import { getScale, getBlockX, getBlockY } from '../../utils'
import { useSelector } from 'react-redux'
import { Store } from '../../stores'
import { EntityBlockSvg } from '../../svg'

export interface DiagramEntityBlockProps {
  parentEntity: Entity;
  relativeX: number;
  relativeY: number;
  width: number;
  height: number;
  contentEditable: boolean;
  content?: string;
  svgComponent: EntityBlockSvg;
}

export const DiagramEntityBlock = (props: DiagramEntityBlockProps) => {
  const scale = useSelector((state: Store) => getScale(state.scale))

  const x = props.parentEntity.x + props.relativeX
  const y = props.parentEntity.y + props.relativeY

  return (
    <>
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
          {props.content}
        </div>
      </foreignObject>
    </>
  )
}