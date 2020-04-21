import * as React from 'react'
import { SizeControlType } from "./SizeController"
import { SizeController } from './SizeController'
import { Entity } from '../../types'

export interface EntitySizeContollerProps {
  entityId: number,
  entity: Entity,
}

export const EntitySizeController = (props: EntitySizeContollerProps) => {
  return (
    <>
      {[
        SizeControlType.top, SizeControlType.topRight, SizeControlType.right, SizeControlType.bottomRight,
        SizeControlType.bottom, SizeControlType.bottomLeft, SizeControlType.left, SizeControlType.topLeft,
      ].map((direction, index) => (
        <SizeController
          key={index}
          entityId={props.entityId}
          entity={props.entity}
          radius={10}
          decorationRadius={5}
          color={'red'}
          sizeControlType={direction}
        />
      ))}
    </>
  )
}