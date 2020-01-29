import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Entity, MouseMode } from '../../types'
import { getScale } from '../../utils'
import { updateEntity, setMouseMode } from '../../actions'
import { Store } from '../../stores'
import {  } from '../../constants'

export enum SizeControlType {
  top,
  bottom,
  right,
  left,
  topRight,
  topLeft,
  bottomRight,
  bottomLeft,
}

export interface SizeControllerProps {
  entityId: number;
  entity: Entity;
  radius: number;
  decorationRadius: number;
  color: string;
  sizeControlType: SizeControlType;
}

export const SizeController = (props: SizeControllerProps) => {
  const scale = useSelector((state: Store) => getScale(state.scaleLevel))
  const dispatch = useDispatch()

  const possibleCoordinates = new Map<SizeControlType, [number, number]>([
    [SizeControlType.top, [props.entity.x + props.entity.width / 2, props.entity.y]],
    [SizeControlType.bottom, [props.entity.x + props.entity.width / 2, props.entity.y + props.entity.height]],
    [SizeControlType.left, [props.entity.x, props.entity.y + props.entity.height / 2]],
    [SizeControlType.right, [props.entity.x + props.entity.width, props.entity.y + props.entity.height / 2]],
    [SizeControlType.topRight, [props.entity.x + props.entity.width, props.entity.y]],
    [SizeControlType.topLeft, [props.entity.x, props.entity.y]],
    [SizeControlType.bottomRight, [props.entity.x + props.entity.width, props.entity.y + props.entity.height]],
    [SizeControlType.bottomLeft, [props.entity.x, props.entity.y + props.entity.height]],
  ])

  const isResized = props.entity.sizeChangedOnBottom
    || props.entity.sizeChangedOnLeft
    || props.entity.sizeChangedOnRight
    || props.entity.sizeChangedOnTop

  const [x, y] = possibleCoordinates.get(props.sizeControlType)

  return (
    <>
      <circle
        className={isResized ? '' : 'on-hover-visible'}
        cx={x * scale + 'px'}
        cy={y * scale + 'px'}
        r={props.decorationRadius + 'px'}
        fill={props.color}
      />
      <circle
        cx={x * scale + 'px'}
        cy={y * scale + 'px'}
        r={props.radius + 'px'}
        fill='transparent'
        cursor={(() => {
          if (props.sizeControlType === SizeControlType.top || props.sizeControlType === SizeControlType.bottom) return 'ns-resize'
          if (props.sizeControlType === SizeControlType.left || props.sizeControlType === SizeControlType.right) return 'ew-resize'
          if (props.sizeControlType === SizeControlType.topRight || props.sizeControlType === SizeControlType.bottomLeft) return 'nesw-resize'
          if (props.sizeControlType === SizeControlType.topLeft || props.sizeControlType === SizeControlType.bottomRight) return 'nwse-resize'
        })()}
        onMouseDown={(event) => {
          event.stopPropagation()
          dispatch(setMouseMode(MouseMode.dragging))
          dispatch(updateEntity(props.entityId, {
            ...props.entity, 
            selected: true,
            sizeChangedOnTop: 
              props.sizeControlType === SizeControlType.top ||
              props.sizeControlType === SizeControlType.topRight ||
              props.sizeControlType === SizeControlType.topLeft,
            sizeChangedOnBottom: 
              props.sizeControlType === SizeControlType.bottom ||
              props.sizeControlType === SizeControlType.bottomRight ||
              props.sizeControlType === SizeControlType.bottomLeft,
            sizeChangedOnRight: 
              props.sizeControlType === SizeControlType.right ||
              props.sizeControlType === SizeControlType.topRight ||
              props.sizeControlType === SizeControlType.bottomRight,
            sizeChangedOnLeft: 
              props.sizeControlType === SizeControlType.left ||
              props.sizeControlType === SizeControlType.topLeft ||
              props.sizeControlType === SizeControlType.bottomLeft,
          }))
        }}
      />
    </>
  )
}