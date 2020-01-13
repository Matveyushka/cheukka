import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Entity } from '../../types'
import { getScale } from '../../utils'
import { Store } from '../../stores'

export interface BlockSchemeActionProps {
  entityId: number,
  entity: Entity,
}

export const BlockSchemeAction = (props: BlockSchemeActionProps) => {
  const scale = useSelector((state: Store) => getScale(state.scale))

  return (
    <rect
      x={props.entity.blocks[0].x * scale}
      y={props.entity.blocks[0].y * scale}
      width={props.entity.blocks[0].width * scale}
      height={props.entity.blocks[0].height * scale}
      strokeWidth={1}
      stroke='black'
    />
  )
}
