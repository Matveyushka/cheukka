import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getScale } from '../../../utils'
import { Store } from '../../../stores'
import { Entity, Connection, ConnectionAreaPoint, FreeConnectionPoint, MouseMode } from '../../../types'
import { removeEntity, addConnection } from '../../../actions'
import { getBackgroundSvgImage, getSvgExit } from '../../../svg'
import { SizeController, SizeControlType } from './SizeController'
import { ConnectionAreaContainer } from './ConnectionAreaContainer'

export interface EntityContainerProps {
  entityId: number,
  entity: Entity,
}

export const EntityContainer = (props: EntityContainerProps) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(true)

  const [scale, mouseMode] = useSelector((state: Store) => [getScale(state.scale), state.mouseMode])
  const dispatch = useDispatch()

  const interfaceControlElementSize = 10 / scale
  const connectionAreaWidth = interfaceControlElementSize * 1.5
  const interfaceColor = props.entity.moved ? 'red' : props.entity.selected ? 'red' : isHovered ? 'red' : 'black'

  const isResized = props.entity.sizeChangedOnBottom
    || props.entity.sizeChangedOnLeft
    || props.entity.sizeChangedOnRight
    || props.entity.sizeChangedOnTop

  const realWidth = props.entity.width * scale
  const realHeight = props.entity.height * scale

  const hoverExtraAreaWidth = Math.max(interfaceControlElementSize, connectionAreaWidth)

  return (
    <g className='block'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <rect
        x={(props.entity.x - hoverExtraAreaWidth) * scale}
        y={(props.entity.y - hoverExtraAreaWidth) * scale}
        width={realWidth + hoverExtraAreaWidth * 2 * scale}
        height={realHeight + hoverExtraAreaWidth * 2 * scale}
        fill='transparent'
      />
      {
        isHovered && !(mouseMode === MouseMode.dragging) ?
        props.entity.connectionAreaCreators.map((area, index) => <ConnectionAreaContainer 
          key={index}
          width={connectionAreaWidth}
          entity={props.entity} 
          entityId={props.entityId}
          area={area(props.entity)}
          areaId={index}/>)
        : ''
      }
      {props.entity.render(props.entity)}
      {
        props.entity.selected || (isHovered && !(mouseMode === MouseMode.connecting)) ?
        <>
        <rect
          className={`block-decoration`}
          x={props.entity.x * scale}
          y={props.entity.y * scale}
          width={realWidth}
          height={realHeight}
          stroke={interfaceColor}
          strokeWidth={4}
          strokeDasharray="4,4"
          fill={'transparent'}
          pointerEvents='none'
        />
        <foreignObject
          x={(props.entity.x + props.entity.width - interfaceControlElementSize * 1.5) * scale}
          y={(props.entity.y + interfaceControlElementSize * 0.5) * scale}
          width={interfaceControlElementSize * scale}
          height={interfaceControlElementSize * scale}
        >
          {(realWidth >= interfaceControlElementSize * 3 * scale && realHeight >= interfaceControlElementSize * 3 * scale) ?
            <div
              className={`delete-button ${isResized ? 'invisible' : 'on-hover-visible'}`}
              style={{
                width: interfaceControlElementSize * scale,
                height: interfaceControlElementSize * scale,
                backgroundImage: getBackgroundSvgImage(getSvgExit(scale, interfaceColor)),
              }}
              onMouseDown={(event) => { event.stopPropagation() }}
              onClick={(event) => { dispatch(removeEntity(props.entityId)) }}
            /> : ''
          }
        </foreignObject> 
        </>: ''
      }
      {
        isHovered && !(mouseMode === MouseMode.connecting) ?
          [
            SizeControlType.top, SizeControlType.topRight, SizeControlType.right, SizeControlType.bottomRight,
            SizeControlType.bottom, SizeControlType.bottomLeft, SizeControlType.left, SizeControlType.topLeft,
          ].map((direction, index) => (
            <SizeController
              key={index}
              entityId={props.entityId}
              entity={props.entity}
              radius={interfaceControlElementSize}
              decorationRadius={interfaceControlElementSize / 2}
              color={interfaceColor}
              sizeControlType={direction}
            />
          )) : ''
      }
    </g>
  )
}